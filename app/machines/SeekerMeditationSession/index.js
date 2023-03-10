import { machine } from './machine';
import { interpret } from 'xstate';
import { isNil, get, isEqual, isUndefined } from 'lodash';
import {
    isAppInBackground,
    Scenes,
    SEEKER_MEDITATION_UI_STATE,
    SITTING_STATE as SITTING_STATUS_ON_SERVER,
} from '../../shared/Constants';
import moment from 'moment';
import operations from '../../state/operations';
import { log } from '../../services/DiagnosticLogService';
import {
    isGuidedRelaxationPlaying,
    playGuidedRelaxation,
    playPleaseStartMeditation,
    playThatsAll,
    stopIfPlayingGuidedRelaxation,
} from '../../services/sound';
import {
    disableDoNotDisturbMode,
    enableDoNotDisturbMode,
} from '../../services/native/DoNotDisturbService';
import { Actions } from 'react-native-router-flux';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import MeditationSessionCountService from '../../services/meditation/MeditationSessionCountService';
import { getSeekerConnectWaitTime } from '../../services/firebase/RemoteConfigService';
import { wait } from '../../utils/AsyncUtils';

export const Events = {
    ERROR_OCCURRED_WHILE_REQUESTING_SESSION:
        'ERROR_OCCURRED_WHILE_REQUESTING_SESSION',
    SITTING_LIMIT_EXCEEDED: 'SITTING_LIMIT_EXCEEDED',
    REQUESTED_EXIT_FROM_SITTING: 'REQUESTED_EXIT_FROM_SITTING',
    SUCCESSFULLY_REQUESTED_SESSION: 'SUCCESSFULLY_REQUESTED_SESSION',
    SERVER_STATUS_RECEIVED: 'SERVER_STATUS_RECEIVED',
    SITTING_TIMED_OUT: 'SITTING_TIMED_OUT',
    SITTING_WITH_MASTER_COMPLETED: 'SITTING_WITH_MASTER_COMPLETED',
};

export const States = {
    REQUESTING_SERVER_FOR_A_SESSION: 'requestingServerForASession',
    WAITING_FOR_SERVER_TO_ALLOCATE_A_TRAINER:
        'waitingForServerToAllocateTrainer',
    WAITING_FOR_TRAINER_TO_ACCEPT_SITTING_REQUEST:
        'waitingForTrainerToAcceptSittingRequest',
    WAITING_FOR_TRAINER_TO_START_SITTING: 'waitingForTrainerToStartSitting',
    SITTING_WITH_TRAINER_IN_PROGRESS: 'sittingWithTrainerInProgress',
    SITTING_WITH_MASTER_IN_PROGRESS: 'sittingWithMasterInProgress',
    SITTING_LIMIT_EXCEEDED: 'sittingLimitExceeded',
    REQUESTED_EXIT_FROM_SITTING: 'seekerExitedSitting',
    SITTING_COMPLETED: 'sittingCompleted',
    UNABLE_TO_DETERMINE_STATUS_ON_SERVER: 'unableToDetermineStatusOnServer',
    ERROR_OCCURRED_WHILE_REQUESTING_FOR_A_SITTING:
        'errorOccurredWhileRequestingForASitting',
};

class Service {
    initialize = (dispatch, getState, config = this.machineConfig) => {
        this.getState = getState;
        this.dispatch = dispatch;
        this.stop();
        this.machine = machine.withConfig(config);
        this.machineService = interpret(this.machine);
        this.machineService.onTransition(this._onStateChange);
        this.machineService.onDone(this._onDone);
    };

    onSessionRequestSuccess = (seekerResponse, sessionRequestTime) => {
        this.machineService.send({
            type: Events.SUCCESSFULLY_REQUESTED_SESSION,
            seekerResponse,
            sessionRequestTime,
        });
    };

    onSessionRequestErrored = error => {
        this.machineService.send({
            type: Events.ERROR_OCCURRED_WHILE_REQUESTING_SESSION,
            error,
        });
    };

    onSessionInProgressTimeout = (meditationSession, sessionCompletedTime) => {
        this.machineService.send({
            type: Events.SITTING_TIMED_OUT,
            meditationSession,
            sessionCompletedTime,
        });
    };

    onSittingWithMasterCompleted = (
        meditationSession,
        sessionCompletedTime,
    ) => {
        this.machineService.send({
            type: Events.SITTING_WITH_MASTER_COMPLETED,
            meditationSession,
            sessionCompletedTime,
        });
    };

    onSeekerResponseReceived = (seekerResponse, sessionCompletedTime) => {
        this.machineService.send({
            type: Events.SERVER_STATUS_RECEIVED,
            seekerResponse,
            sessionCompletedTime,
        });
    };

    onMeditationSessionReceived = (meditationSession, sessionCompletedTime) => {
        this.machineService.send({
            type: Events.SERVER_STATUS_RECEIVED,
            meditationSession,
            sessionCompletedTime,
        });
    };

    onReRequestingForASession = () => {
        this.machineService.send({
            type: Events.SERVER_STATUS_RECEIVED,
            reRequestingForASession: true,
        });
    };

    onSeekerMeditationCancelled = () => {
        this.machineService.send({
            type: Events.REQUESTED_EXIT_FROM_SITTING,
        });
    };

    onUnableToDetermineStatusOnServer = () => {
        this.machineService.send({
            type: Events.SERVER_STATUS_RECEIVED,
            isSessionStatusUnDeterminable: true,
        });
    };

    getCurrentState = () => this.machineService.state;

    isDone = () => this.machineService.state.done;

    _getStatus = event => {
        const status = get(event, 'seekerResponse.status');

        if (isNil(status)) {
            return get(event, 'meditationSession.state');
        }

        return status;
    };

    _isSessionStateEqual = (event, status) =>
        isEqual(this._getStatus(event), status);

    isSittingsLimitExceeded = (context, event) => {
        const statusOnServer = get(event, 'seekerResponse.status');
        return (
            isEqual(
                statusOnServer,
                SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED,
            ) ||
            isEqual(
                statusOnServer,
                SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
            )
        );
    };

    isWaitingForTrainerToAcceptSittingRequestOnServer = (context, event) => {
        return (
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.WAITING_FOR_PRECEPTOR_TO_START_BATCH,
            )
        );
    };

    isWaitingForTrainerToStartSittingOnServer = (context, event) => {
        return (
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.STARTED,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.STARTED_BATCH,
            )
        );
    };

    isSittingWithTrainerInProgressOnServer = (context, event) => {
        return (
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.IN_PROGRESS,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.IN_PROGRESS_BATCH,
            )
        );
    };

    _getMeditationSession = event => {
        const meditationSession = get(event, 'seekerResponse.session');

        if (isNil(meditationSession)) {
            return get(event, 'meditationSession');
        }

        return meditationSession;
    };

    _isMasterGivingSitting = (context, event) => {
        const session = this._getMeditationSession(event);

        const sessionId = get(session, 'sessionId');

        if (isNil(sessionId)) {
            return false;
        }

        return isEqual(get(session, 'preceptorId'), 'MASTER_PRECEPTOR_ID');
    };

    _isSittingEndTimePassed = event => {
        const session = this._getMeditationSession(event);
        return get(session, 'endTime.seconds') - moment().unix() <= 0;
    };

    isSittingWithMasterInProgressOnServer = (context, event) => {
        const masterGivingSitting = this._isMasterGivingSitting(context, event);

        if (masterGivingSitting) {
            return !this._isSittingEndTimePassed(event);
        }

        return false;
    };

    isSittingWithMasterCompleted = (context, event) => {
        const masterGivingSitting = this._isMasterGivingSitting(context, event);

        if (masterGivingSitting) {
            return this._isSittingEndTimePassed(event);
        }

        return false;
    };

    isSittingCompletedOnServer = (context, event) => {
        const isSessionCompleted =
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.TIMED_OUT,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.BATCH_MEDITATION_COMPLETED,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.MEDITATION_COMPLETED,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.PRECEPTOR_COMPLETED,
            ) ||
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.COMPLETED,
            );

        if (!isSessionCompleted) {
            return isEqual(get(event, 'isMeditationSessionCompleted'), true);
        }

        return true;
    };

    isSessionStatusUnDeterminable = (context, event) => {
        return isEqual(get(event, 'isSessionStatusUnDeterminable'), true);
    };

    shouldReRequestForASession = (context, event) => {
        return isEqual(get(event, 'reRequestingForASession'), true);
    };

    _onStateChange = state => {
        const previousState = get(state, 'history.value');

        log('SeekerMeditationSessionMachine', 'StateChange', {
            machineId: this.machineService.sessionId,
            previousState,
            triggeredEvent: state.event.type,
            currentState: state.value,
        });
    };

    getMachineSessionId = () => {
        return this.machineService.sessionId;
    };

    _onDone = event => {
        log('SeekerMeditationSessionMachine', 'Done', {
            machineId: this.machineService.sessionId,
            data: event.data,
        });
    };

    start = () => {
        if (!isNil(this.machineService)) {
            this.machineService.start();
        }
    };

    stop = () => {
        if (!isNil(this.machineService)) {
            this.machineService.stop();
            log('SeekerMeditationSessionMachine', 'Stop', {
                machineId: this.machineService.sessionId,
            });
        }
    };

    _transitionUIState = (uiState, event) => {
        const session = this._getMeditationSession(event);
        const preceptorName = get(session, 'preceptorName');
        const startTimeEpochSeconds = get(session, 'startTime.seconds', 0);
        const endTimeEpochSeconds = get(event, 'sessionCompletedTime', 0);

        const startTime =
            startTimeEpochSeconds > 0
                ? moment.unix(startTimeEpochSeconds)
                : undefined;

        const endTime =
            endTimeEpochSeconds > 0
                ? moment.unix(endTimeEpochSeconds)
                : undefined;

        log('SeekerMeditationSessionMachine', '_transitionUIState', {
            machineId: this.machineService.sessionId,
            session,
            preceptorName,
            startTime: isUndefined(startTime) ? undefined : startTime.unix(),
            endTime: isUndefined(endTime) ? undefined : endTime.unix(),
            startTimeEpochSeconds,
            endTimeEpochSeconds,
        });

        operations.seekerMeditation.transitionTo(
            uiState,
            preceptorName,
            startTime,
            endTime,
        )(this.dispatch, this.getState);
    };

    goToRequestingSessionScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            event,
        );
    };

    playRelaxationAudioIfApplicable = (context, event) => {
        const relaxationAudioNeedsToBePlayed = operations.user.shouldPlayGuidedRelaxation(
            this.getState(),
        );
        const isRelaxationAudioPlaying = isGuidedRelaxationPlaying();

        log(
            'SeekerMeditationSessionMachine',
            'playRelaxationAudioIfApplicable',
            {
                machineId: this.machineService.sessionId,
                relaxationAudioNeedsToBePlayed,
                isRelaxationAudioPlaying,
                event,
            },
        );
        if (relaxationAudioNeedsToBePlayed && !isRelaxationAudioPlaying) {
            playGuidedRelaxation(
                this._afterAudioPlayedEnableDNDModeIfApplicable,
            );
        }
    };
    _afterAudioPlayedEnableDNDModeIfApplicable = () => {
        if (!isAppInBackground()) {
            enableDoNotDisturbMode();
        }
    };
    stopRelaxationAudioAfterSessionIsEndedIfPlaying = (context, event) => {
        const isRelaxationAudioPlaying = isGuidedRelaxationPlaying();

        log('SeekerMeditationSessionMachine', 'stopRelaxationAudioIfPlaying', {
            machineId: this.machineService.sessionId,
            isRelaxationAudioPlaying,
            event,
        });

        stopIfPlayingGuidedRelaxation();
    };

    goToWaitingForServerToAllocateTrainerScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
            event,
        );
    };

    goToWaitingForTrainerToAcceptRequestScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_ACCEPT,
            event,
        );
    };

    goToWaitingForTrainerToStartSittingScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.WAITING_FOR_TRAINER_TO_START,
            event,
        );
    };

    goToSittingInProgressScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.MEDITATION_IN_PROGRESS,
            event,
        );
    };

    goToMasterSittingInProgressScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.MASTER_SITTING_IN_PROGRESS,
            event,
        );
    };

    playPleaseStartMeditationAudioIfApplicable = (context, event) => {
        const relaxationAudioNeedsToBePlayed = operations.user.shouldPlayGuidedRelaxation(
            this.getState(),
        );
        const isAppInBackgroundState = isAppInBackground();
        log(
            'SeekerMeditationSessionMachine',
            'playPleaseStartMeditationAudioIfApplicable',
            {
                machineId: this.machineService.sessionId,
                relaxationAudioNeedsToBePlayed,
                event,
                isAppInBackgroundState,
            },
        );
        if (!relaxationAudioNeedsToBePlayed && !isAppInBackgroundState) {
            playPleaseStartMeditation(
                this._afterAudioPlayedEnableDNDModeIfApplicable,
            );
        }
    };

    goToSittingLimitExceededScreen = (context, event) => {
        if (
            this._isSessionStateEqual(
                event,
                SITTING_STATUS_ON_SERVER.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
            )
        ) {
            this._transitionUIState(
                SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED_FOR_PERIOD,
                event,
            );
        } else {
            this._transitionUIState(
                SEEKER_MEDITATION_UI_STATE.SITTING_LIMIT_EXCEEDED,
                event,
            );
        }
    };

    goToSittingCancelledScreen = (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.SITTING_CANCELLED,
            event,
        );
    };

    showRemindForNextSessionButtonIfApplicable = async (context, event) => {
        const isReminderForNextSittingEnabled = operations.user.isReminderForNextSittingEnabled(
            this.getState(),
        );

        operations.user.setRemindForNextSessionButtonVisibility(
            !isReminderForNextSittingEnabled,
        )(this.dispatch);
    };

    scheduleMeditateWithTrainerReminderNotificationIfApplicable = async (
        context,
        event,
    ) => {
        const isReminderForNextSittingEnabled = operations.user.isReminderForNextSittingEnabled(
            this.getState(),
        );
        const nextSittingReminderIntervalInDays = operations.user.nextSittingReminderIntervalInDays(
            this.getState(),
        );
        if (
            isEqual(isReminderForNextSittingEnabled, true) &&
            !isUndefined(nextSittingReminderIntervalInDays)
        ) {
            ReminderNotificationService.cancelAndScheduleMeditateWithTrainerReminderNotifications(
                nextSittingReminderIntervalInDays,
            );
        }
    };

    goToSittingCompletedScreen = async (context, event) => {
        this._transitionUIState(
            SEEKER_MEDITATION_UI_STATE.MEDITATION_COMPLETED,
            event,
        );
    };

    playThatsAllAudioIfApplicable = async (context, event) => {
        const isAppInBackgroundState = isAppInBackground();
        log('SeekerMeditationSessionMachine', 'playThatsAllAudioIfApplicable', {
            machineId: this.machineService.sessionId,
            event,
            isAppInBackgroundState,
        });
        await disableDoNotDisturbMode();
        if (!isAppInBackgroundState) {
            playThatsAll();
        }
    };
    enableOnGoingSessionCancelButton = () => {
        operations.seekerMeditation.setEnableMeditationCancelButton(true)(
            this.dispatch,
        );
    };

    disableOnGoingSessionCancelButton = () => {
        operations.seekerMeditation.setEnableMeditationCancelButton(false)(
            this.dispatch,
        );
    };

    hideRemindForNextSessionButton = () => {
        operations.user.setRemindForNextSessionButtonVisibility(false)(
            this.dispatch,
        );
    };

    goToUnableToDetermineStatusOnServerScreen = () => {
        Actions.jump(Scenes.home);
    };

    goToErrorOccurredScreen = () => {
        Actions.jump(Scenes.home);
    };

    fetchSittingCount = async (context, event) => {
        await wait(2000);
        MeditationSessionCountService.updateCountOfSittingsTaken();
    };
    setMaxWaitingEndTimeBeforeSessionStart = (context, event) => {
        if (isUndefined(event.reRequestingForASession)) {
            const seconds = getSeekerConnectWaitTime().valueInSeconds;
            operations.seekerMeditation.setMaxWaitingEndTimeBeforeSessionStart(
                moment().add(seconds, 'seconds'),
            )(this.dispatch);
        }
    };

    machineConfig = {
        guards: {
            isWaitingForTrainerToAcceptSittingRequestOnServer: this
                .isWaitingForTrainerToAcceptSittingRequestOnServer,

            isWaitingForTrainerToStartSittingOnServer: this
                .isWaitingForTrainerToStartSittingOnServer,

            isSittingWithTrainerInProgressOnServer: this
                .isSittingWithTrainerInProgressOnServer,

            isSittingWithMasterInProgressOnServer: this
                .isSittingWithMasterInProgressOnServer,

            isSittingCompletedOnServer: this.isSittingCompletedOnServer,

            isSessionStatusUnDeterminable: this.isSessionStatusUnDeterminable,

            shouldReRequestForASession: this.shouldReRequestForASession,

            isSittingsLimitExceeded: this.isSittingsLimitExceeded,

            isSittingWithMasterCompleted: this.isSittingWithMasterCompleted,
        },
        actions: {
            goToRequestingSessionScreen: this.goToRequestingSessionScreen,
            goToWaitingForServerToAllocateTrainerScreen: this
                .goToWaitingForServerToAllocateTrainerScreen,
            playRelaxationAudioIfApplicable: this
                .playRelaxationAudioIfApplicable,
            goToWaitingForTrainerToAcceptRequestScreen: this
                .goToWaitingForTrainerToAcceptRequestScreen,
            goToWaitingForTrainerToStartSittingScreen: this
                .goToWaitingForTrainerToStartSittingScreen,
            goToSittingInProgressScreen: this.goToSittingInProgressScreen,
            goToMasterSittingInProgressScreen: this
                .goToMasterSittingInProgressScreen,
            disableDoNotDisturbMode: disableDoNotDisturbMode,
            playPleaseStartMeditationAudioIfApplicable: this
                .playPleaseStartMeditationAudioIfApplicable,
            goToSittingLimitExceededScreen: this.goToSittingLimitExceededScreen,
            goToSittingCancelledScreen: this.goToSittingCancelledScreen,
            goToSittingCompletedScreen: this.goToSittingCompletedScreen,
            showRemindForNextSessionButtonIfApplicable: this
                .showRemindForNextSessionButtonIfApplicable,
            scheduleMeditateWithTrainerReminderNotificationIfApplicable: this
                .scheduleMeditateWithTrainerReminderNotificationIfApplicable,
            playThatsAllAudioIfApplicable: this.playThatsAllAudioIfApplicable,
            enableOnGoingSessionCancelButton: this
                .enableOnGoingSessionCancelButton,
            disableOnGoingSessionCancelButton: this
                .disableOnGoingSessionCancelButton,
            stopRelaxationAudioAfterSessionIsEndedIfPlaying: this
                .stopRelaxationAudioAfterSessionIsEndedIfPlaying,
            goToUnableToDetermineStatusOnServerScreen: this
                .goToUnableToDetermineStatusOnServerScreen,
            goToErrorOccurredScreen: this.goToErrorOccurredScreen,
            hideRemindForNextSessionButton: this.hideRemindForNextSessionButton,
            fetchSittingCount: this.fetchSittingCount,
            setMaxWaitingEndTimeBeforeSessionStart: this
                .setMaxWaitingEndTimeBeforeSessionStart,
        },
    };
}

export const SeekerMeditationSessionMachine = new Service();
