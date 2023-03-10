import {
    closeSeekerSessionStreaming,
    getExistingSessionByUser,
    getMeditationSession,
    isAnyPendingSeekerSessionRequest,
    seekerExitSession,
    seekerSeekNow,
    sendSeekerSessionHeartbeat,
    startSeekerSessionStreaming,
    createUpdateDiaryEntry,
} from '../grpc/MeditationService';
import moment from 'moment';
import {
    SeekerMeditationSessionMachine,
    States,
} from '../../machines/SeekerMeditationSession';
import { NativeEventEmitter, NativeModules, AppState } from 'react-native';
import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import { get, isNil, isEqual, isEmpty, includes } from 'lodash';
import { onError } from '../../utils/ErrorHandlingUtils';
import {
    NotificationCategory,
    NotificationSubCategory,
    SITTING_STATE,
    isAppInBackground,
    NOTIFICATION_CHANNEL_ID,
    MASTER_PRECEPTOR_ID,
} from '../../shared/Constants';
import {
    getMaxMeditationSessionDurationInSeconds,
    getSeekerConnectWaitTime,
} from '../firebase/RemoteConfigService';
import { log } from '../DiagnosticLogService';
import NetInfo from '@react-native-community/netinfo';
import StorageService from '../native/AppStorageService';
import NotificationService from '../NotificationService';
import {
    disableDoNotDisturbMode,
    enableDoNotDisturbMode,
} from '../native/DoNotDisturbService';
import { isGuidedRelaxationPlaying } from '../sound';
import { operations } from '../../state';

export const RequestError = {
    MAKING_REQUEST_FAILED: 'MAKING_REQUEST_FAILED',
    NOT_ENOUGH_GAP_BETWEEN_TWO_SITTINGS: 'NOT_ENOUGH_GAP_BETWEEN_TWO_SITTINGS',
    MAX_NO_OF_SITTINGS_EXCEEDED: 'MAX_NO_OF_SITTINGS_EXCEEDED',
};

const GRPC_STREAMING_HEART_BEAT_INTERVAL_IN_SECONDS = 25;

export const wait = millis =>
    new Promise(resolve => setTimeout(resolve, millis));

export class NetworkConnectionChangeFacade {
    isInternetReachable = async state => {
        const actualState = !isEmpty(state) ? state : await NetInfo.fetch();
        return actualState.isConnected && actualState.isInternetReachable;
    };

    register = async meditationSessionService => {
        this._unRegister();

        this._unSubscribe = NetInfo.addEventListener(async state => {
            if (this.isMeditationServiceSubscribedForEvent) {
                const isOnline = await this.isInternetReachable(state);
                log(
                    'SeekerMeditationSession',
                    'NetworkConnectionChangeFacade.networkChangeEvent',
                    {
                        state,
                        isOnline,
                    },
                );

                if (isOnline) {
                    meditationSessionService.onNetworkConnected(state);
                } else {
                    meditationSessionService.onNetworkDisconnected(state);
                }
            }
        });
    };

    subscribe = () => {
        this.isMeditationServiceSubscribedForEvent = true;
    };

    unSubscribe = () => {
        this.isMeditationServiceSubscribedForEvent = false;
    };

    _unRegister = () => {
        if (!isEmpty(this._unSubscribe)) {
            this._unSubscribe();
            this._unSubscribe = undefined;
            this.isMeditationServiceSubscribedForEvent = false;
        }
    };
}

export const networkConnectionChangeFacade = new NetworkConnectionChangeFacade();

export class AppStateChangeFacade {
    _handleAppStateChange = eventData => {
        if (this.isMeditationServiceSubscribedForEvent) {
            this.meditationSessionService.onAppStateChange(eventData);
        }
    };

    register = async meditationSessionService => {
        this._unRegister();
        this.meditationSessionService = meditationSessionService;

        AppState.addEventListener('change', this._handleAppStateChange);

        this._unSubscribe = () => {
            AppState.removeEventListener('change', this._handleAppStateChange);
        };
    };

    subscribe = () => {
        this.isMeditationServiceSubscribedForEvent = true;
    };

    unSubscribe = () => {
        this.isMeditationServiceSubscribedForEvent = false;
    };

    _unRegister = () => {
        if (!isEmpty(this._unSubscribe)) {
            this._unSubscribe();
            this._unSubscribe = undefined;
        }
    };
}

const appStateChangeFacade = new AppStateChangeFacade();

export class SeekerMeditationSessionGRPCStreaming {
    sendHeartbeat = async () => {
        if (this.isHeartbeatScheduled) {
            return;
        }

        this.isHeartbeatScheduled = true;
        await wait(GRPC_STREAMING_HEART_BEAT_INTERVAL_IN_SECONDS * 1000);

        if (this.isStreamingSessionOpen) {
            const canDoNetworkCalls = await networkConnectionChangeFacade.isInternetReachable();

            if (canDoNetworkCalls) {
                try {
                    const sentHeartbeat = await sendSeekerSessionHeartbeat();
                    log('SeekerMeditationSession', 'sendHeartbeat', {
                        sentHeartbeat,
                    });

                    if (!sentHeartbeat) {
                        this.stop();
                        return;
                    }
                } catch (err) {
                    log('SeekerMeditationSession', 'sendHeartbeat-error', err);
                }
            }

            this.isHeartbeatScheduled = false;
            this.sendHeartbeat();
        } else {
            this.isHeartbeatScheduled = false;
        }
    };

    start = async () => {
        if (!this.isStreamingSessionOpen) {
            await startSeekerSessionStreaming();
            this.isStreamingSessionOpen = true;
            this.sendHeartbeat();
        }
    };

    stop = async () => {
        if (this.isStreamingSessionOpen) {
            try {
                await closeSeekerSessionStreaming();
                this.isStreamingSessionOpen = undefined;
            } catch (err) {
                onError(err, 'SKMEDSESS-STPSTR');
            }
        }
    };

    subscribe = meditationSessionService => {
        this.unSubscribe();

        const eventEmitter = new NativeEventEmitter(
            NativeModules.MeditationService,
        );

        if (!this.onNextSubscription) {
            this.onNextSubscription = eventEmitter.addListener(
                'SeekerSessionStreamingOnNext',
                meditationSessionService.onSessionReceived,
            );
        }

        if (!this.onErrorSubscription) {
            this.onErrorSubscription = eventEmitter.addListener(
                'SeekerSessionStreamingOnError',
                meditationSessionService.onSessionStreamingErrored,
            );
        }
    };

    unSubscribe = () => {
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
    };
}

export const grpcStreaming = new SeekerMeditationSessionGRPCStreaming();

export class SessionTimeoutSchedulingHandler {
    schedule = async (session, handler) => {
        const shouldScheduleTimeout =
            !isEmpty(get(session, 'sessionId')) &&
            !isNil(get(session, 'startTime')) &&
            get(session, 'startTime.seconds') > 0;

        // Clear any existing timeout
        this.cancel();

        if (shouldScheduleTimeout) {
            const sessionStartTime = get(session, 'startTime.seconds');
            const elapsedSessionTime = moment().unix() - sessionStartTime;
            const remainingSessionTimeInSeconds =
                getMaxMeditationSessionDurationInSeconds() - elapsedSessionTime;

            log('SeekerMeditationSession', 'SessionTimeoutSchedule', {
                session,
                remainingSessionTimeInSeconds,
            });
            this.timeout = setTimeout(() => {
                const endTime =
                    sessionStartTime +
                    getMaxMeditationSessionDurationInSeconds();
                handler(session, endTime);
            }, remainingSessionTimeInSeconds * 1000);
        } else {
            log('SeekerMeditationSession', 'SessionTimeoutSchedule', {
                session,
            });
        }
    };

    cancel = () => {
        if (!isNil(this.timeout)) {
            clearTimeout(this.timeout);
            this.timeout = undefined;
        }
    };
}

const sessionInProgressTimeoutScheduler = new SessionTimeoutSchedulingHandler();

export class SeekerMeditationSessionService {
    initialize(dispatch, getState) {
        this.dispatch = dispatch;
        this.getState = getState;
        grpcStreaming.subscribe(this);
        networkConnectionChangeFacade.register(this);
        appStateChangeFacade.register(this);
    }

    _getRetryOffsetTimeSecs = requestedTime => {
        if (isNil(requestedTime)) {
            return 0;
        }

        return moment().diff(requestedTime, 'seconds');
    };

    _saveSessionInStorage = session => {
        this.meditationSessionId = get(session, 'sessionId');
        StorageService.setOngoingSeekerMeditationSession({
            ...session,
            noOfAdditionalSeekers: this.additionalAbhyasis,
            sittingRequestedTimeInSeconds: this.requestedTime,
        }).catch(() => {});
    };

    _cleanUp = () => {
        grpcStreaming.stop();
        sessionInProgressTimeoutScheduler.cancel();
        networkConnectionChangeFacade.unSubscribe();
        appStateChangeFacade.unSubscribe();
        StorageService.clearOngoingSeekerMeditationSession();
    };

    _syncWhenConnectedToATrainer = async retryCount => {
        try {
            const sessionInStorage = await StorageService.getOngoingSeekerMeditationSession();
            const sessionId = get(sessionInStorage, 'sessionId');
            const sessionOnServer = await getMeditationSession(sessionId);

            log('SeekerMeditationSession', '_syncWhenConnectedToATrainer_1', {
                sessionInStorage,
                sessionOnServer,
                retryCount,
            });

            SeekerMeditationSessionMachine.onMeditationSessionReceived(
                sessionOnServer,
            );

            if (SeekerMeditationSessionMachine.isDone()) {
                this._cleanUp();
            } else {
                await grpcStreaming.start();
            }
            log('SeekerMeditationSession', '_syncWhenConnectedToATrainer_2', {
                sessionInStorage,
                sessionOnServer,
                isDone: SeekerMeditationSessionMachine.isDone(),
            });
        } catch (e) {
            const count = retryCount ? retryCount + 1 : 1;
            if (count < 12) {
                await wait(3000);
                this._syncWhenConnectedToATrainer(count);
            }
            log('SeekerMeditationSession', '_syncWhenConnectedToATrainer_3', {
                e,
                count,
            });
        }
    };

    _syncWhenWaitingForConnectingToATrainer = async retryCount => {
        try {
            const isRequestInQueueInServer = await isAnyPendingSeekerSessionRequest();

            log(
                'SeekerMeditationSession',
                '_syncWhenWaitingForConnectingToATrainer',
                {
                    isRequestInQueueInServer,
                },
            );
            if (isRequestInQueueInServer) {
                await grpcStreaming.start();
                return;
            }

            const sessionOnServer = await getExistingSessionByUser();

            log(
                'SeekerMeditationSession',
                '_syncWhenWaitingForConnectingToATrainer_2',
                {
                    isRequestInQueueInServer,
                    sessionOnServer,
                },
            );

            const isPreceptorSession =
                this.getState().user.firebaseUserInfo.uid ===
                sessionOnServer.preceptorId;

            if (isPreceptorSession) {
                SeekerMeditationSessionMachine.stop();
                this._cleanUp();
                return;
            }

            const isSessionPresentInServer = !isEmpty(
                sessionOnServer.sessionId,
            );

            if (isSessionPresentInServer) {
                SeekerMeditationSessionMachine.onMeditationSessionReceived(
                    sessionOnServer,
                );
                this.enableDNDIfApplicable();
                const isMasterSitting = isEqual(
                    sessionOnServer.preceptorId,
                    MASTER_PRECEPTOR_ID,
                );
                if (isMasterSitting) {
                    this.handleMasterSitting(sessionOnServer);
                } else {
                    grpcStreaming.start();
                }
            } else {
                const secondsLapsedAfterRequesting = this._getRetryOffsetTimeSecs(
                    this.requestedTime,
                );
                const maxWaitTimeInSeconds = getSeekerConnectWaitTime()
                    .valueInSeconds;
                const gracePeriodSeconds = 60;

                const shouldReRequest =
                    secondsLapsedAfterRequesting <=
                    maxWaitTimeInSeconds + gracePeriodSeconds;

                log(
                    'SeekerMeditationSession',
                    '_syncWhenWaitingForConnectingToATrainer_3',
                    {
                        isRequestInQueueInServer,
                        sessionOnServer,
                        secondsLapsedAfterRequesting,
                        maxWaitTimeInSeconds,
                        gracePeriodSeconds,
                    },
                );

                if (shouldReRequest) {
                    this._reRequest();
                } else {
                    SeekerMeditationSessionMachine.onUnableToDetermineStatusOnServer();
                    this._cleanUp();
                }
            }
        } catch (e) {
            const count = retryCount ? retryCount + 1 : 1;
            if (count < 12) {
                await wait(3000);
                this._syncWhenWaitingForConnectingToATrainer(count);
            }
            log(
                'SeekerMeditationSession',
                '_syncWhenWaitingForConnectingToATrainer_4',
                {
                    e,
                    count,
                },
            );
        }
    };

    /**
     *  We will handle the session based on local state
     *
     *  1. Sitting is completed in local, do nothing
     *  2. if Connected to a master, do nothing, as a timer is already scheduled. that will take care of the sitting
     *  3. if Connected to a trainer, sync local state with server state
     *  4. if waiting for connecting to a trainer,
     *      4.1 - If session is there on server, Sync the local state with server
     *      4.2 - If sitting request is in queue in server, Sync the local state with server.
     *      4.3 - otherwise
     *              4.3.1 - If last request is made long back, more than 10 mins back, set local state to unDeterminable
     *              4.2.2 - If last request is made less than 10 mins back, reRequest for a session and set state accordingly.
     */
    checkAndConnectToSessionOnServer = async () => {
        if (SeekerMeditationSessionMachine.isDone()) {
            log('SeekerMeditationSession', 'checkAndConnectToSessionOnServer', {
                stateMachineDone: true,
                stateMachineState: SeekerMeditationSessionMachine.getCurrentState()
                    .value,
            });
            this._cleanUp();
            // Do nothing
            return;
        }

        const localState = SeekerMeditationSessionMachine.getCurrentState()
            .value;

        log('SeekerMeditationSession', 'checkAndConnectToSessionOnServer', {
            stateMachineDone: false,
            localState: localState,
        });

        switch (localState) {
            case States.SITTING_WITH_MASTER_IN_PROGRESS:
                return;

            case States.WAITING_FOR_TRAINER_TO_START_SITTING:
            case States.SITTING_WITH_TRAINER_IN_PROGRESS:
                await this._syncWhenConnectedToATrainer();
                return;

            case States.REQUESTING_SERVER_FOR_A_SESSION:
            case States.WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER:
            case States.WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST:
                await this._syncWhenWaitingForConnectingToATrainer();
                return;

            default:
                return;
        }
    };

    onNetworkDisconnected = state => {
        log('SeekerMeditationSession', 'onNetworkDisconnected', state);
        grpcStreaming.stop();
    };

    onNetworkConnected = state => {
        log('SeekerMeditationSession', 'onNetworkConnected', state);
        this.checkAndConnectToSessionOnServer();
    };

    onAppStateChange = async state => {
        const isAppPutInBackground =
            isEqual('inactive', state) || isEqual('background', state);

        if (isAppPutInBackground) {
            await disableDoNotDisturbMode();
            this.appWentToBackgroundAt = moment();
            log('SeekerMeditationSession', 'onAppStateChange', {
                isAppPutInBackground,
                appWentToBackgroundAt: this.appWentToBackgroundAt,
            });
        } else {
            await this.enableDNDIfApplicable();
            const noOfSecondsAppIsInBackground = moment().diff(
                this.appWentToBackgroundAt,
                'seconds',
            );

            this.appWentToBackgroundAt = undefined;

            log('SeekerMeditationSession', 'onAppStateChange', {
                isAppPutInBackground,
                appWentToBackgroundAt: this.appWentToBackgroundAt,
                noOfSecondsAppIsInBackground,
                heartbeatInterval: GRPC_STREAMING_HEART_BEAT_INTERVAL_IN_SECONDS,
            });

            if (
                noOfSecondsAppIsInBackground >=
                GRPC_STREAMING_HEART_BEAT_INTERVAL_IN_SECONDS
            ) {
                grpcStreaming.stop();
                const canDoNetworkCalls = await networkConnectionChangeFacade.isInternetReachable();

                if (canDoNetworkCalls) {
                    this.checkAndConnectToSessionOnServer();
                }
            }
        }
    };
    enableDNDIfApplicable = async () => {
        const shouldPlayGuidedRelaxation = operations.user.shouldPlayGuidedRelaxation(
            this.getState(),
        );
        if (
            includes(
                [
                    States.SITTING_WITH_TRAINER_IN_PROGRESS,
                    States.SITTING_WITH_MASTER_IN_PROGRESS,
                ],
                SeekerMeditationSessionMachine.getCurrentState().value,
            ) &&
            (isEqual(shouldPlayGuidedRelaxation, false) ||
                !isGuidedRelaxationPlaying())
        ) {
            await enableDoNotDisturbMode();
        }
    };
    request = async (
        additionalAbhyasis = 0,
        requestedTime = moment(),
        retryOffsetTime = 0,
        initializeMachine = true,
    ) => {
        if (initializeMachine) {
            SeekerMeditationSessionMachine.initialize(
                this.dispatch,
                this.getState,
            );
            SeekerMeditationSessionMachine.start();
        }

        this.additionalAbhyasis = additionalAbhyasis;
        this.requestedTime = requestedTime;

        try {
            this.seekNowResponse = await seekerSeekNow(
                this.additionalAbhyasis,
                retryOffsetTime,
            );

            log('SeekerMeditationSession', 'request', {
                seekNowResponse: this.seekNowResponse,
                additionalAbhyasis,
                requestedTime: requestedTime.unix(),
                retryOffsetTime,
                initializeMachine,
            });

            SeekerMeditationSessionMachine.onSessionRequestSuccess(
                this.seekNowResponse,
                this.requestedTime,
            );

            const isSittingLimitExceeded = isEqual(
                SeekerMeditationSessionMachine.getCurrentState().value,
                States.SITTING_LIMIT_EXCEEDED,
            );

            if (
                !(
                    isSittingLimitExceeded &&
                    SeekerMeditationSessionMachine.isDone()
                )
            ) {
                this._saveSessionInStorage(this.seekNowResponse.session);
                networkConnectionChangeFacade.subscribe();
                appStateChangeFacade.subscribe();
                await wait(2000);
                grpcStreaming.start();
            }
        } catch (err) {
            log('SeekerMeditationSession', 'request-error', err);
            SeekerMeditationSessionMachine.onSessionRequestErrored(err);
            grpcStreaming.stop();
            throw new Error('Error occurred while making a seek now request', {
                code: RequestError.MAKING_REQUEST_FAILED,
                err,
            });
        }
    };

    _reRequest = async () => {
        SeekerMeditationSessionMachine.onReRequestingForASession();
        await wait(2000);
        const timeLapsedFromFirstRequest = this._getRetryOffsetTimeSecs(
            this.requestedTime,
        );

        log('SeekerMeditationSession', '_reRequest', {
            additionalAbhyasis: this.additionalAbhyasis,
            requestedTime: this.requestedTime,
            timeLapsedFromFirstRequest,
        });

        try {
            await this.request(
                this.additionalAbhyasis,
                this.requestedTime,
                timeLapsedFromFirstRequest,
                false,
            );
        } catch (err) {}
    };

    handleMasterSitting = async session => {
        sessionInProgressTimeoutScheduler.cancel();
        SeekerMeditationSessionMachine.onMeditationSessionReceived(session);
        const endMeditationInMilliSeconds =
            (session.endTime.seconds - moment().unix()) * 1000;

        log('SeekerMeditationSession', 'handleMasterSitting_1', {
            session,
            endMeditationInMilliSeconds,
        });

        if (endMeditationInMilliSeconds > 0) {
            NotificationService.cancelAll();
            NotificationService.scheduleNotification({
                channelId: NOTIFICATION_CHANNEL_ID.MEDITATION_END,
                date: new Date(Date.now() + endMeditationInMilliSeconds),
                title: 'Meditation Service',
                message: 'Your meditation session has ended',
                soundName: 'tha_m.mp3',
            });
            await wait(endMeditationInMilliSeconds);
        }

        log('SeekerMeditationSession', 'handleMasterSitting_2', {
            session,
            endMeditationInMilliSeconds,
        });

        SeekerMeditationSessionMachine.onSittingWithMasterCompleted(
            session,
            session.endTime.seconds,
        );
    };

    handleSessionTimeout = (session, time) => {
        log('SeekerMeditationSession', 'handleSessionTimeout', {
            session,
            time,
        });
        SeekerMeditationSessionMachine.onSessionInProgressTimeout(
            session,
            time,
        );
    };

    onSessionReceived = event => {
        const response = JSON.parse(event.message);
        this._saveSessionInStorage(response.session);
        const status = response.status;
        log('SeekerMeditationSession', 'onSessionReceived_1', {
            response,
        });
        switch (status) {
            case SITTING_STATE.PRECEPTOR_CANCELLED:
            case SITTING_STATE.PRECEPTOR_NOT_AVAILABLE:
                this.doRetryIfCompleted = true;
                break;

            case SITTING_STATE.MASTER_SITTING:
                grpcStreaming.stop();
                this.handleMasterSitting(response.session);
                break;

            case SITTING_STATE.TIMED_OUT:
            case SITTING_STATE.BATCH_MEDITATION_COMPLETED:
            case SITTING_STATE.MEDITATION_COMPLETED:
            case SITTING_STATE.PRECEPTOR_COMPLETED:
                SeekerMeditationSessionMachine.onSeekerResponseReceived(
                    response,
                    moment().unix(),
                );
                break;

            case SITTING_STATE.COMPLETED:
                if (this.doRetryIfCompleted) {
                    grpcStreaming.stop();
                    this.doRetryIfCompleted = false;
                    this._reRequest();
                } else {
                    SeekerMeditationSessionMachine.onSeekerResponseReceived(
                        response,
                        moment().unix(),
                    );
                }

                break;

            default:
                SeekerMeditationSessionMachine.onSeekerResponseReceived(
                    response,
                );
                sessionInProgressTimeoutScheduler.schedule(
                    response.session,
                    this.handleSessionTimeout,
                );
                break;
        }

        if (SeekerMeditationSessionMachine.isDone()) {
            this._cleanUp();
        }

        log('SeekerMeditationSession', 'onSessionReceived_2', {
            response,
            doRetryIfCompleted: this.doRetryIfCompleted,
            isStateMachineDone: SeekerMeditationSessionMachine.isDone(),
        });
    };

    onSessionStreamingErrored = async () => {
        await grpcStreaming.stop();
        ServerReachabilityCheckService.checkForOngoingSessionWhenOnline();
        ServerReachabilityCheckService.determineNetworkConnectivityStatus();
        log('SeekerMeditationSession', 'onSessionStreamingErrored', {});
    };

    cancelOnGoingSeekerSession = async () => {
        const canDoNetworkCalls = await networkConnectionChangeFacade.isInternetReachable();
        if (
            isEqual(
                SeekerMeditationSessionMachine.getCurrentState().value,
                States.REQUESTING_SERVER_FOR_A_SESSION,
            ) ||
            isEqual(canDoNetworkCalls, false)
        ) {
            log('SeekerMeditationSession', 'cancelOnGoingSeekerSession_1', {
                canDoNetworkCalls,
                currentStateMachineState: SeekerMeditationSessionMachine.getCurrentState()
                    .value,
            });
            return;
        }
        const sessionInStorage = await StorageService.getOngoingSeekerMeditationSession();
        log('SeekerMeditationSession', 'cancelOnGoingSeekerSession_2', {
            sessionInStorage,
            currentStateMachineState: SeekerMeditationSessionMachine.getCurrentState()
                .value,
        });
        if (!isNil(sessionInStorage)) {
            const sessionId = get(sessionInStorage, 'sessionId');
            await seekerExitSession(sessionId, this.additionalAbhyasis);
            SeekerMeditationSessionMachine.onSeekerMeditationCancelled();
            NotificationService.cancelAll();
            this._cleanUp();
            log('SeekerMeditationSession', 'cancelOnGoingSeekerSession_3', {
                cancelledOnGoingSeekerSession: true,
            });
        }
    };

    onNotificationReceived = async (category, subCategory, message) => {
        if (isEqual(NotificationCategory.MEDITATION_SERVICE, category)) {
            const logTime = moment();
            const sessionInStorage = await StorageService.getOngoingSeekerMeditationSession();

            switch (subCategory) {
                case NotificationSubCategory.IN_PROGRESS:
                case NotificationSubCategory.IN_PROGRESS_BATCH:
                case NotificationSubCategory.MASTER_SITTING:
                case NotificationSubCategory.BATCH_MEDITATION_COMPLETED:
                case NotificationSubCategory.MEDITATION_COMPLETED:
                case NotificationSubCategory.IN_PROGRESS_TIMED_OUT:
                    log(
                        'SeekerMeditationSession',
                        'onNotificationReceived',
                        {
                            message,
                            isAppInBackground: isAppInBackground(),
                            currentStateMachineState: SeekerMeditationSessionMachine.getCurrentState(),
                            sessionInStorage,
                        },
                        logTime,
                    );
                    break;
            }
        }
    };

    submitPostMeditationExperience = async (text, moodRating) => {
        const canDoNetworkCalls = await networkConnectionChangeFacade.isInternetReachable();

        if (canDoNetworkCalls) {
            if (!isNil(this.meditationSessionId)) {
                const result = await createUpdateDiaryEntry(
                    text,
                    moment().unix(),
                    moodRating,
                    this.meditationSessionId,
                );
                log(
                    'SeekerMeditationSession',
                    'submitPostMeditationExperience',
                    {
                        postMeditationExperienceResponse: result,
                    },
                );
                return result;
            }
            return null;
        }
    };
}

export const service = new SeekerMeditationSessionService();
