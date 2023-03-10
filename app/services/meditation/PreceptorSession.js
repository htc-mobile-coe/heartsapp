import operations from '../../state/operations';
import { NativeEventEmitter, NativeModules } from 'react-native';
import {
    Scenes,
    PRECEPTOR_MEDITATION_UI_STATE,
    SITTING_STATE,
    isSessionInProgress,
    isAppInBackground,
} from '../../shared/Constants';
import {
    closePreceptorSessionStreaming,
    getPreceptorAvailabilityStatus,
    preceptorAccept,
    preceptorCancel,
    preceptorEndMeditation,
    getMeditationSession,
    preceptorStartMeditation,
    sendPreceptorSessionHeartbeat,
    startPreceptorSessionStreaming,
    updatePreceptorAvailabilityStatus,
    sharePreceptorHistory,
    createUpdateDiaryEntry,
} from '../grpc/MeditationService';
import { Actions } from 'react-native-router-flux';
import { onError } from '../../utils/ErrorHandlingUtils';
import BackgroundTimer from 'react-native-background-timer';
import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import StorageService from '../native/AppStorageService';
import { getMaxMeditationSessionDurationInSeconds } from '../firebase/RemoteConfigService';
import { getFormattedTimeLeft } from '../../utils/date-utils';
import moment from 'moment';
import { log } from '../DiagnosticLogService';
import MeditationSessionCountService from './MeditationSessionCountService';
import {
    ZeroPreceptorNotificationSubscriptionMachine,
    Events,
} from '../../machines/ZeroPreceptorNotificationSubscription';
import { get, includes, isNil, isUndefined } from 'lodash';
// import { findKey } from 'lodash';

class PreceptorSession {
    TAG = 'PreceptorSession';

    _setHeartbeatTimer = () => {
        if (!this._heartbeatTimer) {
            this._heartbeatTimer = BackgroundTimer.setInterval(
                this._sendHeartbeat,
                20000,
            );
        }
    };

    _clearHeartbeatTimer = () => {
        if (this._heartbeatTimer) {
            BackgroundTimer.clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = undefined;
            log(this.TAG, '_clearHeartbeatTimer');
        }
    };

    /* seek medidate timer interval every 1 min */
    setMeditationDurationTimerInterval = () => {
        if (!this._meditationDurationTimerInterval) {
            this._meditationDurationTimerInterval = BackgroundTimer.setInterval(
                this._onMeditationDurationTimerTick,
                1000,
            );
            log(this.TAG, 'setMeditationDurationTimerInterval');
        }
    };
    /* clear the seek timer interval if  expire*/
    _clearMeditationDurationTimerInterval = () => {
        if (this._meditationDurationTimerInterval) {
            BackgroundTimer.clearInterval(
                this._meditationDurationTimerInterval,
            );
            this._meditationDurationTimerInterval = undefined;
            log(this.TAG, '_clearMeditationDurationTimerInterval');
        }
    };
    /* timer interval callback and update the state */
    _onMeditationDurationTimerTick = () => {
        /* calculate end time */
        const meditateTimingDetails = this._calculateMeditateTime();
        /* calculate counter timer */
        const timeCounter = getFormattedTimeLeft(
            meditateTimingDetails.elapsedMeditationDurationInSeconds,
        );
        if (meditateTimingDetails.remainingTimeInSeconds <= 0) {
            this._requestToEndMeditate();
            log(
                this.TAG,
                '_onMeditationDurationTimerTick',
                meditateTimingDetails,
            );
        }
        operations.preceptorMeditation.updateMeditationDurationTimerTick(
            timeCounter,
        )(this.dispatch, this.getState);
    };

    _subscribe = () => {
        const eventEmitter = new NativeEventEmitter(
            NativeModules.MeditationService,
        );

        if (!this.onNextSubscription) {
            this.onNextSubscription = eventEmitter.addListener(
                'PreceptorSessionStreamingOnNext',
                this._onNext,
            );
        }

        if (!this.onErrorSubscription) {
            this.onErrorSubscription = eventEmitter.addListener(
                'PreceptorSessionStreamingOnError',
                this._onError,
            );
        }

        if (!this.onCompletedSubscription) {
            this.onCompletedSubscription = eventEmitter.addListener(
                'PreceptorSessionStreamingOnCompleted',
                this._onCompleted,
            );
        }
        log(this.TAG, '_subscribe');
    };

    _unsubscribe = () => {
        if (this.onNextSubscription) {
            this.onNextSubscription.remove();
            this.onNextSubscription = undefined;
        }
        if (this.onErrorSubscription) {
            this.onErrorSubscription.remove();
            this.onErrorSubscription = undefined;
        }
        if (this.onCompletedSubscription) {
            this.onCompletedSubscription.remove();
            this.onCompletedSubscription = undefined;
        }
        log(this.TAG, '_unsubscribe');
    };

    _noop = () => {
        log(this.TAG, '_noop');
    };

    resetUIState = () => {
        operations.preceptorMeditation.reset()(this.dispatch, this.getState);
    };

    _transitionUIState = (uiState, totalNoOfSeekers) => {
        operations.preceptorMeditation.transitionTo(uiState, totalNoOfSeekers)(
            this.dispatch,
            this.getState,
        );
        log(this.TAG, '_transitionUIState', {
            uiState,
            scene: Actions.currentScene,
            totalNoOfSeekers,
            appInBackground: isAppInBackground(),
        });
        if (
            !includes(
                [Scenes.preceptorMeditationSession, Scenes.weeklyInspiration],
                Actions.currentScene,
            )
        ) {
            Actions.push(Scenes.preceptorMeditationSession);
        }
    };

    _onNext = event => {
        const response = JSON.parse(event.message);
        this.sessionId = response.session.sessionId;
        const totalNoOfSeekers = response.session.totalSeekers;
        StorageService.setOngoingMeditationSession(response.session).catch(
            () => {},
        );
        log(this.TAG, '_onNext_1', {
            response,
            appInBackground: isAppInBackground(),
        });
        switch (response.status) {
            case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START_BATCH:
            case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START:
                operations.preceptorMeditation.updateMeditationDurationTimerTick(
                    undefined,
                )(this.dispatch, this.getState);
                this._transitionUIState(
                    PRECEPTOR_MEDITATION_UI_STATE.WAITING_FOR_PRECEPTOR_TO_ACCEPT,
                    totalNoOfSeekers,
                );
                break;

            case SITTING_STATE.STARTED:
            case SITTING_STATE.STARTED_BATCH:
                this._transitionUIState(
                    PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_ACCEPTED_YET_TO_START,
                    totalNoOfSeekers,
                );
                operations.preceptorMeditation.updateMeditationDurationTimerTick(
                    getFormattedTimeLeft(0),
                )(this.dispatch, this.getState);
                break;

            case SITTING_STATE.IN_PROGRESS:
            case SITTING_STATE.IN_PROGRESS_BATCH:
                this._transitionUIState(
                    PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
                    totalNoOfSeekers,
                );
                this.handleSessionTimer(response.session);
                break;

            case SITTING_STATE.PRECEPTOR_NOT_AVAILABLE:
            case SITTING_STATE.PRECEPTOR_CANCELLED:
                this._transitionUIState(
                    PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
                    totalNoOfSeekers,
                );
                log(this.TAG, '_onNext_2', {
                    totalNoOfSeekers,
                    status: response.status,
                });
                Actions.replace(Scenes.home);
                this.resetUIState();
                this.medidateSession = undefined;
                StorageService.clearOngoingMeditationSession().catch(() => {});
                break;

            case SITTING_STATE.BATCH_MEDITATION_COMPLETED:
            case SITTING_STATE.MEDITATION_COMPLETED:
            case SITTING_STATE.TIMED_OUT:
            case SITTING_STATE.PRECEPTOR_COMPLETED:
                this.onSessionComplete(response.session);
                break;

            case SITTING_STATE.COMPLETED:
                this.handleSittingCompletedState();
                MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
                log(this.TAG, '_onNext_3', {
                    status: response.status,
                });
                break;

            default:
                this._noop();
        }
    };

    handleSittingCompletedState = () => {
        this.stop();
        StorageService.clearOngoingMeditationSession().catch(() => {});
        this.checkAvailabilityStatusAndSetReady();
        log(this.TAG, 'handleSittingCompletedState', {
            appInBackground: isAppInBackground(),
        });
    };

    _onError = async () => {
        await this.stop();
        ServerReachabilityCheckService.checkForOngoingSessionWhenOnline();
        ServerReachabilityCheckService.determineNetworkConnectivityStatus();
        log(this.TAG, '_onError');
    };

    _onCompleted = () => {
        log(this.TAG, '_onCompleted');
    };

    _sendHeartbeat = async () => {
        // If user logs out but still timer is running
        const isUserPreceptor = operations.user.isPreceptor(this.getState());

        log(this.TAG, '_sendHeartbeat_1', {
            isStreamingSessionOpen: this.isStreamingSessionOpen,
            sendingHeartbeat: this.sendingHeartbeat,
            isUserPreceptor,
        });

        if (this.isStreamingSessionOpen && isUserPreceptor) {
            if (!this.sendingHeartbeat) {
                // playBeep();
                this.sendingHeartbeat = true;
                try {
                    await sendPreceptorSessionHeartbeat();
                } catch (err) {
                    onError(err, 'MEDSESS-SHB');
                    await this.stop();
                    ServerReachabilityCheckService.checkForOngoingSessionWhenOnline();
                    ServerReachabilityCheckService.determineNetworkConnectivityStatus();

                    log(this.TAG, '_sendHeartbeat_2', {
                        reconnecting: true,
                        sendingHeartbeat: this.sendingHeartbeat,
                        isUserPreceptor,
                    });
                }
                this.sendingHeartbeat = false;
            }
        } else {
            this._clearHeartbeatTimer();
        }
    };

    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;

        //Clearing just to make sure the background timer is not stopped
        this._clearHeartbeatTimer();
        this._subscribe();
    };

    cleanup = () => {
        this._unsubscribe();
        this._clearHeartbeatTimer();
        this._clearMeditationDurationTimerInterval();
        log(this.TAG, 'cleanup');
    };

    checkAvailabilityStatusAndSetReady = async () => {
        if (operations.user.isPreceptor(this.getState())) {
            try {
                const available = await getPreceptorAvailabilityStatus();

                if (available) {
                    const DO_NOT_UPDATE_STATUS_ON_SERVER = false;
                    const UPDATE_STATUS_IN_PRECEPTOR_DASHBOARD = true;
                    await this.setReady(
                        DO_NOT_UPDATE_STATUS_ON_SERVER,
                        UPDATE_STATUS_IN_PRECEPTOR_DASHBOARD,
                    );
                }
                log(this.TAG, 'checkAvailabilityStatusAndSetReady', {
                    available,
                });

                operations.preceptorDashboard.setAvailable(available)(
                    this.dispatch,
                );

                return available;
            } catch (err) {
                onError(err, 'MEDSESS-CASSR');
            }
        }

        return false;
    };

    connectToSession = async () => {
        await this.startStreaming();
        this._setHeartbeatTimer();
        log(this.TAG, 'connectToSession');
    };

    reconnectToSession = async () => {
        this._clearHeartbeatTimer();
        await this.stopStreaming();

        await this.connectToSession();
        log(this.TAG, 'reconnectToSession');
    };

    setReady = async (
        updateStatusOnServer,
        updateStatusInPreceptorDashboard,
    ) => {
        try {
            await this.stop();
            this.resetUIState();

            if (updateStatusOnServer) {
                await updatePreceptorAvailabilityStatus(true);
            }

            if (updateStatusInPreceptorDashboard) {
                operations.preceptorDashboard.setAvailable(true)(this.dispatch);
                ZeroPreceptorNotificationSubscriptionMachine.send(
                    Events.AVAILABLE_FOR_SITTINGS,
                );
            }
            log(this.TAG, 'setReady', {
                updateStatusOnServer,
                updateStatusInPreceptorDashboard,
            });
            await this.startStreaming();
            this._setHeartbeatTimer();
        } catch (err) {
            onError(err, 'MEDSESS-SR');
            operations.preceptorDashboard.setAvailable(false)(this.dispatch);
        }
    };

    stop = async setToOffline => {
        try {
            this._clearHeartbeatTimer();
            await this.stopStreaming();
            log(this.TAG, 'stop_1', { setToOffline });
            if (setToOffline) {
                StorageService.clearOngoingMeditationSession();
                this.medidateSession = undefined;
                await updatePreceptorAvailabilityStatus(false);
                operations.preceptorDashboard.setAvailable(false)(
                    this.dispatch,
                );
                log(this.TAG, 'stop_2', {
                    availabilityStatus: false,
                });
            }
        } catch (err) {
            onError(err, 'MEDSESS-STP');
        }
    };

    startMeditation = async () => {
        log(this.TAG, 'startMeditation');
        try {
            await preceptorStartMeditation(this.sessionId);
        } catch (err) {
            onError(err, 'MEDSESS-PSM');
        }
    };

    acceptMeditation = async () => {
        log(this.TAG, 'acceptMeditation');
        try {
            await preceptorAccept(this.sessionId);
        } catch (err) {
            onError(err, 'MEDSESS-AM');
        }
    };

    _requestToEndMeditate = () => {
        log(this.TAG, '_requestToEndMeditate', {
            isApplicationServerReachable: operations.deviceState.isApplicationServerReachable(
                this.getState(),
            ),
        });

        if (
            operations.deviceState.isApplicationServerReachable(this.getState())
        ) {
            this.endMeditation();
        }
    };

    endMeditation = async () => {
        if (isUndefined(this.isRequestedToEndMeditation)) {
            this.isRequestedToEndMeditation = true;
            try {
                const meditationSession = await getMeditationSession(
                    this.sessionId,
                );

                const inProgress = isSessionInProgress(meditationSession.state);

                if (inProgress) {
                    await preceptorEndMeditation(this.sessionId);
                }
                log(this.TAG, 'endMeditation', {
                    inProgress,
                    ...meditationSession,
                });

                this.onSessionComplete(meditationSession);
                this.handleSittingCompletedState();

                this.isRequestedToEndMeditation = undefined;
            } catch (err) {
                onError(err, 'MEDSESS-EM');
                this.isRequestedToEndMeditation = undefined;
            }
        }
    };

    cancelMeditationRequest = async () => {
        try {
            log(this.TAG, 'cancelMeditationRequest', {
                redirectTo: Scenes.home,
            });
            await preceptorCancel(this.sessionId);
            this.stop(true);
            Actions.replace(Scenes.home);
        } catch (err) {
            onError(err, 'MEDSESS-CAMR');
        }
    };

    startStreaming = async () => {
        log(this.TAG, 'startStreaming', {
            isStreamingSessionOpen: this.isStreamingSessionOpen,
        });

        if (!this.isStreamingSessionOpen) {
            await startPreceptorSessionStreaming();
            this.isStreamingSessionOpen = true;
        }
    };

    stopStreaming = async () => {
        log(this.TAG, 'stopStreaming', {
            isStreamingSessionOpen: this.isStreamingSessionOpen,
        });
        if (this.isStreamingSessionOpen) {
            await closePreceptorSessionStreaming();
            this.isStreamingSessionOpen = undefined;
        }
    };

    onSessionComplete = session => {
        this._transitionUIState(PRECEPTOR_MEDITATION_UI_STATE.PLAY_END_SOUND);

        this._transitionUIState(
            PRECEPTOR_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
        );
        this.resetUIState();
        this._clearMeditationDurationTimerInterval();
        const startTime = get(
            session ?? this.medidateSession,
            'startTime.seconds',
        );
        log(this.TAG, 'onSessionComplete', {
            startTime,
        });
        /*if meditation ended and means while app is background or internet interrupted*/
        if (!isUndefined(startTime) && startTime > 0) {
            this.medidateSession = session;
            this._onMeditationDurationTimerTick();
        } else {
            // if trainner is not accepted ignore the spend time,
            operations.preceptorMeditation.updateMeditationDurationTimerTick(
                undefined,
            )(this.dispatch, this.getState);
        }
        StorageService.clearOngoingMeditationSession().catch(() => {});
    };

    handleSessionTimer = session => {
        this._clearMeditationDurationTimerInterval();
        try {
            this.medidateSession = session;
            // if already session completed interval tick method will be end the session
            this.setMeditationDurationTimerInterval();
        } catch (e) {
            onError(e, 'MEDSESS-HMS');
        }
    };
    _calculateMeditateTime = () => {
        const remaining =
            moment().unix() - get(this.medidateSession, 'startTime.seconds');
        return {
            remainingTimeInSeconds:
                getMaxMeditationSessionDurationInSeconds() - remaining,
            elapsedMeditationDurationInSeconds: remaining,
        };
    };

    submitPostMeditationExperience = async text => {
        const canDoNetworkCalls = await ServerReachabilityCheckService.determineNetworkConnectivityStatus();

        if (canDoNetworkCalls) {
            const meditationSessionId = get(this.medidateSession, 'sessionId');

            if (!isNil(meditationSessionId)) {
                const result = await createUpdateDiaryEntry(
                    text,
                    moment().unix(),
                    undefined,
                    meditationSessionId,
                );
                log(this.TAG, 'submitPostMeditationExperience', {
                    postMeditationExperienceResponse: result,
                });
                return result;
            }
            return null;
        }
    };

    sendPreceptorHistory = async (
        fromDateInSeconds,
        toDateInSeconds,
        email,
        timeZoneId,
        meansThroughWhichSittingGiven,
    ) => {
        const canDoNetworkCalls = await ServerReachabilityCheckService.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            const result = await sharePreceptorHistory(
                fromDateInSeconds,
                toDateInSeconds,
                email,
                timeZoneId,
                meansThroughWhichSittingGiven,
            );
            return result;
        }
    };
}

export default new PreceptorSession();
