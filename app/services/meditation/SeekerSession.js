import {
    seekerSeekNow,
    startSeekerSessionStreaming,
    sendSeekerSessionHeartbeat,
    closeSeekerSessionStreaming,
} from '../grpc/MeditationService';
// import { NativeEventEmitter, NativeModules } from 'react-native';
import {
    SITTING_STATE,
    SEEKER_MEDITATION_UI_STATE,
    isAppInBackground,
    NOTIFICATION_CHANNEL_ID,
} from '../../shared/Constants';
import operations from '../../state/operations';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import PreceptorSession from './PreceptorSession';
import { onError } from '../../utils/ErrorHandlingUtils';
import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import StorageService from '../native/AppStorageService';
import NotificationService from '../NotificationService';
import { get, isUndefined, isEqual, includes } from 'lodash';
import moment from 'moment';
import { getFormattedTimeLeft } from '../../utils/date-utils';
import { getMaxMeditationSessionDurationInSeconds } from '../firebase/RemoteConfigService';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';
import { log } from '../DiagnosticLogService';

class SeekerSession {
    TAG = 'SeekerSession';
    /* when app was terminated based on last sessoin guided relaxation audio & please start meditation will be played */
    setLastSessionActive(active) {
        this.isLastSessionActive = active;
        log(this.TAG, 'setLastSessionActive', { active });
    }
    _setHeartbeatTimer = () => {
        if (!this._heartbeatTimer) {
            this._heartbeatTimer = setInterval(this._sendHeartbeat, 25000);
        }
    };

    _clearHeartbeatTimer = () => {
        if (this._heartbeatTimer) {
            clearInterval(this._heartbeatTimer);
            this._heartbeatTimer = undefined;
            log(this.TAG, '_clearHeartbeatTimer');
        }
    };

    _clearSeekNowTimer = () => {
        if (this._seekNowTimer) {
            clearTimeout(this._seekNowTimer);
            this._seekNowTimer = undefined;
            log(this.TAG, '_clearSeekNowTimer');
        }
    };

    _setMasterSittingTimerInterval = () => {
        if (!this._masterSittingMedidateSessionInterval) {
            this._masterSittingMedidateSessionInterval = setInterval(
                this._sendMasterSittingTimeTick,
                1000,
            );
        }
    };
    _clearMasterSittingTimer = () => {
        if (this._masterSittingMedidateSessionInterval) {
            clearInterval(this._masterSittingMedidateSessionInterval);
            this._masterSittingMedidateSessionInterval = undefined;
            log(this.TAG, '_clearMasterSittingTimer');
        }
    };
    // /* timer interval callback and update the state */
    _sendMasterSittingTimeTick = () => {
        /* to do logic  (session.endTime.seconds - moment().unix()) * 1000 */
        const endMeditationInMilliSeconds =
            this.medidateSession.endTime.seconds - moment().unix();
        if (endMeditationInMilliSeconds <= 0) {
            log(this.TAG, '_sendMasterSittingTimeTick', {
                endMeditationInMilliSeconds,
            });
            this.endMasterSitting();
        }
        const startMeditationInMilliSeconds =
            moment().unix() - this.medidateSession.startTime.seconds;
        this._dispatchTimerValue(
            getFormattedTimeLeft(startMeditationInMilliSeconds),
        );
    };

    /* seek medidate timer interval every 1 min */
    _setMeditationDurationTimerInterval = () => {
        if (!this._meditationDurationTimerInterval) {
            this._meditationDurationTimerInterval = setInterval(
                this._onMeditationDurationTimerTick,
                1000,
            );
        }
    };

    /* clear the seek timer interval if  expire*/
    _clearMeditationDurationTimerInterval = () => {
        if (this._meditationDurationTimerInterval) {
            clearInterval(this._meditationDurationTimerInterval);
            this._meditationDurationTimerInterval = undefined;
            log(this.TAG, '_clearMeditationDurationTimerInterval');
        }
    };
    /* timer interval callback and update the state */
    _onMeditationDurationTimerTick = () => {
        const meditateTimingDetails = this._calculateMeditateTime();
        if (meditateTimingDetails.remainingTimeInSeconds <= 0) {
            log(
                this.TAG,
                '_onMeditationDurationTimerTick',
                meditateTimingDetails,
            );
            this.endSeekerSitting();
        }

        this._dispatchTimerValue(
            getFormattedTimeLeft(
                meditateTimingDetails.elapsedMeditationDurationInSeconds,
            ),
        );
    };

    _dispatchTimerValue = timeCounter => {
        operations.seekerMeditation.updateMeditationDurationTimerTick(
            timeCounter,
        )(this.dispatch, this.getState);
    };
    /*subcribe the events */
    _subscribe = () => {
        // const eventEmitter = new NativeEventEmitter(
        //     NativeModules.MeditationService,
        // );
        //
        // if (!this.onNextSubscription) {
        //     this.onNextSubscription = eventEmitter.addListener(
        //         'SeekerSessionStreamingOnNext',
        //         this._onNext,
        //     );
        // }
        //
        // if (!this.onErrorSubscription) {
        //     this.onErrorSubscription = eventEmitter.addListener(
        //         'SeekerSessionStreamingOnError',
        //         this._onError,
        //     );
        // }
        //
        // if (!this.onCompletedSubscription) {
        //     this.onCompletedSubscription = eventEmitter.addListener(
        //         'SeekerSessionStreamingOnCompleted',
        //         this._onCompleted,
        //     );
        // }
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

    _transitionUIState = (uiState, preceptorName) => {
        operations.seekerMeditation.transitionTo(uiState, preceptorName)(
            this.dispatch,
            this.getState,
        );
        log(this.TAG, '_transitionUIState', {
            uiState,
            scene: Actions.currentScene,
            appInBackground: isAppInBackground(),
        });

        if (
            !includes(
                [
                    Scenes.seekerMeditationSession,
                    Scenes.donationPromptingMeditation,
                    Scenes.donationFormScreen,
                    Scenes.paymentScreen,
                    Scenes.weeklyInspiration,
                ],
                Actions.currentScene,
            )
        ) {
            Actions.push(Scenes.seekerMeditationSession);
        }
    };

    _resetUIState = () => {
        operations.seekerMeditation.reset()(this.dispatch, this.getState);
    };

    _playPleaseStartMeditateIfApplicable = () => {
        // play please start meditation if last session is not active, initially undefined audio will play
        log(this.TAG, '_playPleaseStartMeditateIfApplicable', {
            shouldPlayGuidedRelaxation: operations.user.shouldPlayGuidedRelaxation(
                this.getState(),
            ),
            isLastSessionActive: this.isLastSessionActive,
            appInBackground: isAppInBackground(),
        });
        if (
            !operations.user.shouldPlayGuidedRelaxation(this.getState()) &&
            !isEqual(this.isLastSessionActive, true)
        ) {
            this._transitionUIState(
                SEEKER_MEDITATION_UI_STATE.PLAY_PLEASE_START_MEDITATION_SOUND,
            );
        }
    };
    handleMasterSitting = session => {
        this._clearMasterSittingTimer();
        try {
            this.medidateSession = session;
            const endMeditationInMilliSeconds =
                (session.endTime.seconds - moment().unix()) * 1000;

            log(this.TAG, 'handleMasterSitting_1', {
                endMeditationInMilliSeconds,
                appInBackground: isAppInBackground(),
            });

            if (endMeditationInMilliSeconds > 0) {
                this._setMasterSittingTimerInterval();
                StorageService.setOngoingMasterSitting(true);
                this._playPleaseStartMeditateIfApplicable();
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
                );
                NotificationService.cancelAll();
                NotificationService.scheduleNotification({
                    channelId: NOTIFICATION_CHANNEL_ID.MEDITATION_END,
                    date: new Date(Date.now() + endMeditationInMilliSeconds), //20 mins
                    title: 'Meditation Service',
                    message: 'Your meditation session has ended',
                    soundName: 'tha_m.mp3',
                });
                log(this.TAG, 'handleMasterSitting_2', {
                    notificationDate:
                        moment().unix() + endMeditationInMilliSeconds,
                    endMeditationInMilliSeconds,
                });
            } else {
                this.endMasterSitting();
            }
        } catch (e) {
            onError(e, 'SKMEDSESS-HMS');
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
    saveSessionInStorage = response => {
        StorageService.setOngoingSeekerMeditationSession({
            ...response.session,
            noOfAdditionalSeekers: this.noOfAdditionalSeekers,
            sittingRequestedTimeInSeconds: this.sittingRequestedTimeInSeconds,
        }).catch(() => {});
    };

    _onNext = event => {
        const response = JSON.parse(event.message);
        const preceptorName = get(response, 'session.preceptorName');
        log(this.TAG, '_onNext_1', {
            response,
            appInBackground: isAppInBackground(),
        });

        // console.log('=======Seeker Next', response);
        // const statusStr = findKey(SITTING_STATE, o => o === response.status);
        // console.log('===========SeekerOnNext', statusStr);

        switch (response.status) {
            case SITTING_STATE.NO_SITTING:
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
                    preceptorName,
                );
                break;

            case SITTING_STATE.PRECEPTOR_CANCELLED:
            case SITTING_STATE.PRECEPTOR_NOT_AVAILABLE:
                StorageService.clearOngoingSeekerMeditationSession().catch(
                    () => {},
                );
                this.doRetryIfCompleted = true;
                log(this.TAG, '_onNext_2', { doRetryIfCompleted: true });
                break;

            case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START:
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
                    preceptorName,
                );
                this.saveSessionInStorage(response);
                break;

            case SITTING_STATE.MASTER_SITTING:
                this.handleMasterSitting(response.session);
                this._clearHeartbeatTimer();
                this.stopStreaming();
                this.doNotClearOngoingSeekerMeditationSession = true;
                break;

            case SITTING_STATE.COMPLETED:
                this.stop();
                if (!this.doNotClearOngoingSeekerMeditationSession) {
                    StorageService.clearOngoingSeekerMeditationSession().catch(
                        () => {},
                    );
                    this.doNotClearOngoingSeekerMeditationSession = undefined;
                    log(this.TAG, '_onNext_3', { state: response.status });
                }

                if (this.doRetryIfCompleted) {
                    this.doRetryIfCompleted = false;

                    this.start(this.noOfAdditionalSeekers);

                    log(this.TAG, '_onNext_4', {
                        doRetryIfCompleted: true,
                        state: response.status,
                    });
                }
                break;

            case SITTING_STATE.STARTED:
            case SITTING_STATE.STARTED_BATCH:
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START,
                    preceptorName,
                );
                this.saveSessionInStorage(response);
                break;

            case SITTING_STATE.IN_PROGRESS:
            case SITTING_STATE.IN_PROGRESS_BATCH:
                this.medidateSession = response.session;
                this._setMeditationDurationTimerInterval();
                this._playPleaseStartMeditateIfApplicable();
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
                    preceptorName,
                );
                this.isLastSessionActive = true;
                this.saveSessionInStorage(response);
                break;

            case SITTING_STATE.TIMED_OUT:
            case SITTING_STATE.BATCH_MEDITATION_COMPLETED:
            case SITTING_STATE.MEDITATION_COMPLETED:
            case SITTING_STATE.PRECEPTOR_COMPLETED:
                this.stop();
                this.onSessionComplete(response.session);
                log(this.TAG, '_onNext_5', {
                    state: response.status,
                });
                break;

            case SITTING_STATE.SITTING_LIMIT_EXCEEDED:
            case SITTING_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD:
                this._onSittingLimitExceeded(response.status);
                break;

            default:
                this._noop();
        }
    };

    _onError = async () => {
        await this.stop();
        ServerReachabilityCheckService.checkForOngoingSessionWhenOnline();
        ServerReachabilityCheckService.determineNetworkConnectivityStatus();
        log(this.TAG, '_onError', {
            stopped: true,
            checkForOngoingSessionWhenOnline: true,
        });
    };

    _onCompleted = () => {
        log(this.TAG, '_onCompleted');
    };

    _sendHeartbeat = async () => {
        // If user logs out but still timer is running
        const isLoggedIn = operations.user.isLoggedIn(this.getState());
        log(this.TAG, '_sendHeartbeat_1', {
            isStreamingSessionOpen: this.isStreamingSessionOpen,
            sendingHeartbeat: this.sendingHeartbeat,
            isLoggedIn,
        });

        if (this.isStreamingSessionOpen && isLoggedIn) {
            if (!this.sendingHeartbeat) {
                // playBeep();
                this.sendingHeartbeat = true;
                try {
                    await sendSeekerSessionHeartbeat();
                } catch (err) {
                    onError(err, 'SKMEDSESS-SHB');
                    this.stop();
                    ServerReachabilityCheckService.checkForOngoingSessionWhenOnline();
                    ServerReachabilityCheckService.determineNetworkConnectivityStatus();

                    log(this.TAG, '_sendHeartbeat_2', {
                        reconnecting: true,
                        sendingHeartbeat: this.sendingHeartbeat,
                        isLoggedIn,
                    });
                }
                this.sendingHeartbeat = false;
            }
        } else {
            this._clearHeartbeatTimer();
        }
    };
    endSeekerSitting = () => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND,
        );
        log(this.TAG, 'endSeekerSitting', { playThatsAll: true });

        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
        );
        this._clearMeditationDurationTimerInterval();
        StorageService.clearOngoingSeekerMeditationSession().catch(() => {});
        this.medidateSession = undefined;
        this.isLastSessionActive = undefined;
    };
    endMasterSitting = async () => {
        if (!isAppInBackground()) {
            const timeLapsed = await this.isPermittedTimeLapsedAfterSittingRequestedInSeconds();
            if (!timeLapsed) {
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND,
                );
            }
            NotificationService.cancelAll();
            log(this.TAG, 'endMasterSitting_1', {
                timeLapsed,
                appInBackground: false,
            });
        }

        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
        );
        log(this.TAG, 'endMasterSitting_2', {
            appInBackground: isAppInBackground(),
        });
        ZeroPreceptorNotificationSubscriptionMachine.send(
            Events.MEDITATION_SESSION_ENDED,
        );

        StorageService.clearOngoingSeekerMeditationSession().catch(() => {});
        StorageService.clearOngoingMasterSitting().catch(() => {});
        this._clearMasterSittingTimer();
    };

    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
        //Clearing just to make sure the background timer is not stopped
        this._clearHeartbeatTimer();
        this._clearMeditationDurationTimerInterval();
        this._subscribe();
    };
    cleanup = () => {
        this._unsubscribe();
        this._clearHeartbeatTimer();
        this._clearSeekNowTimer();
        this._clearMeditationDurationTimerInterval();
        this._clearMasterSittingTimer();
        NotificationService.cancelAll();
        log(this.TAG, 'cleanup');
    };

    _onSittingLimitExceeded = meditationSittingState => {
        this.stop();
        switch (meditationSittingState) {
            case SITTING_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD:
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
                );
                break;

            default:
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED,
                );
                break;
        }
        StorageService.clearOngoingSeekerMeditationSession().catch(() => {});
        log(this.TAG, '_onSittingLimitExceeded', {
            meditationSittingState,
            appInBackground: isAppInBackground(),
        });
    };

    _seekNow = async () => {
        try {
            await this.connectToSession();
            log(this.TAG, '_seekNow', { appInBackground: isAppInBackground() });
        } catch (err) {
            onError(err, 'SKMEDSESS-SKNW');
            this.stop();
        }

        this._clearSeekNowTimer();
    };

    connectToSession = async () => {
        await this.startStreaming();
        this._setHeartbeatTimer();
    };

    reconnectToSession = async () => {
        this._clearHeartbeatTimer();
        await this.stopStreaming();

        await this.connectToSession();
        log(this.TAG, 'reconnectToSession', {
            appInBackground: isAppInBackground(),
        });
    };

    isPermittedTimeLapsedAfterSittingRequestedInSeconds = async () => {
        const meditationSession = await StorageService.getOngoingSeekerMeditationSession();

        if (meditationSession) {
            return (
                moment().unix() -
                    meditationSession.sittingRequestedTimeInSeconds >
                80 * 60
            );
        }

        return true;
    };

    onSessionComplete = async session => {
        log(this.TAG, 'onSessionComplete_1', {
            appInBackground: isAppInBackground(),
        });
        const timeLapsed = await this.isPermittedTimeLapsedAfterSittingRequestedInSeconds();
        if (!timeLapsed) {
            this._transitionUIState(
                SEEKER_MEDITATION_UI_STATE.PLAY_THATS_ALL_SOUND,
            );
        }

        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
        );
        this._clearMeditationDurationTimerInterval();

        const startTime = get(session, 'startTime.seconds');
        /*if meditation ended and means while app is background or internet interrupted*/
        if (!isUndefined(startTime) && startTime > 0) {
            this.medidateSession = session;
            const meditateTimingDetails = this._calculateMeditateTime();
            this._dispatchTimerValue(
                getFormattedTimeLeft(
                    meditateTimingDetails.elapsedMeditationDurationInSeconds,
                ),
            );
        } else {
            // if trainner is not accepted ignore the spend time,
            this._dispatchTimerValue(undefined);
        }
        log(this.TAG, 'onSessionComplete_2', {
            startTime: startTime,
            timeLapsed,
            session,
        });

        ZeroPreceptorNotificationSubscriptionMachine.send(
            Events.MEDITATION_SESSION_ENDED,
        );
        StorageService.clearOngoingSeekerMeditationSession().catch(() => {});
        this.isLastSessionActive = undefined;
    };

    start = async (noOfAdditionalSeekers, isNewSession = false) => {
        try {
            await this.stop();
            if (operations.user.isPreceptor(this.getState())) {
                PreceptorSession.stop(true);
            }
            this._dispatchTimerValue(undefined);
            this._resetUIState();

            const seekNowResponse = await seekerSeekNow(noOfAdditionalSeekers);
            const sittingLimitExceeded =
                isEqual(
                    seekNowResponse.status,
                    SITTING_STATE.SITTING_LIMIT_EXCEEDED,
                ) ||
                isEqual(
                    seekNowResponse.status,
                    SITTING_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
                );

            log(this.TAG, 'start_1', {
                noOfAdditionalSeekers,
                isNewSession,
                sittingLimitExceeded,
            });
            if (sittingLimitExceeded) {
                this._onSittingLimitExceeded(seekNowResponse.status);
                return;
            }
            if (
                operations.user.shouldPlayGuidedRelaxation(this.getState()) &&
                !isEqual(this.isLastSessionActive, true)
            ) {
                this._transitionUIState(
                    SEEKER_MEDITATION_UI_STATE.PLAY_GUIDE_RELAXATION_SOUND,
                );
                log(this.TAG, 'start_2', { guide_relaxationPlaing: true });
            }
            this._transitionUIState(
                SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            );
            this.noOfAdditionalSeekers = noOfAdditionalSeekers;
            this.sittingRequestedTimeInSeconds = moment().unix();

            this.saveSessionInStorage(seekNowResponse);

            if (!this._seekNowTimer) {
                this._seekNowTimer = setTimeout(this._seekNow, 2000);
            }
        } catch (err) {
            onError(err, 'SKMEDSESS-STRT');
            this.stop();
            Actions.replace(Scenes.home);
            log(this.TAG, 'start_4');
        }
    };

    stop = async () => {
        log(this.TAG, 'stop', {
            appInBackground: isAppInBackground(),
        });
        try {
            this.isLastSessionActive = undefined;
            this._clearHeartbeatTimer();
            await this.stopStreaming();
        } catch (err) {
            onError(err, 'SKMEDSESS-STP');
        }
    };

    startStreaming = async () => {
        log(this.TAG, 'startStreaming', {
            isStreamingSessionOpen: this.isStreamingSessionOpen,
        });
        if (!this.isStreamingSessionOpen) {
            try {
                await startSeekerSessionStreaming();
                this.isStreamingSessionOpen = true;
            } catch (err) {
                onError(err, 'SKMEDSESS-STRTSTR');
            }
        }
    };

    stopStreaming = async () => {
        if (this.isStreamingSessionOpen) {
            try {
                await closeSeekerSessionStreaming();
                this.isStreamingSessionOpen = undefined;
            } catch (err) {
                onError(err, 'SKMEDSESS-STPSTR');
            }
        }
    };
}

export default new SeekerSession();
