import { machine } from './machine';
import { assign, interpret } from 'xstate';
import {
    isNil,
    get,
    isNull,
    isEqual,
    last,
    concat,
    slice,
    isUndefined,
} from 'lodash';
import { log } from '../../services/DiagnosticLogService';
import operations from '../../state/operations';
import { MASTER_CLASS_UI_STATE } from '../../services/MasterClassProgressService';
import { Actions } from 'react-native-router-flux';
import { Scenes, REMINDER } from '../../shared/Constants';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import StorageService from '../../services/native/AppStorageService';

export const Events = {
    STATUS_DETERMINED: 'STATUS_DETERMINED',
    PROMPTED_FOR_MASTER_CLASS: 'PROMPTED_FOR_MASTER_CLASS',
    GO_TO_MASTER_CLASS_SUMMARY: 'GO_TO_MASTER_CLASS_SUMMARY',
    GO_TO_INTRODUCTION_OF_MASTER_CLASS: 'GO_TO_INTRODUCTION_OF_MASTER_CLASS',
    GO_TO_DAY_1: 'GO_TO_DAY_1',
    GO_TO_DAY_2: 'GO_TO_DAY_2',
    GO_TO_DAY_3: 'GO_TO_DAY_3',
    CONTINUE: 'CONTINUE',
    VIDEO_WATCHED: 'VIDEO_WATCHED',
    GO_BACK: 'GO_BACK',
    HOME: 'HOME',
};

export const States = {
    DETERMINING_MASTER_CLASS_COMPLETION_STATUS:
        'determiningMasterClassCompletionStatus',
    PROMPTING_FOR_MASTER_CLASSES_COMPLETION:
        'promptingForMasterClassesCompletion',
    INTRODUCTION_ABOUT_MASTER_CLASSES_NOT_YET_FINISHED:
        'introductionAboutMasterClassesNotYetFinished',
    INTRODUCTION_ABOUT_MASTER_CLASSES_FINISHED:
        'introductionAboutMasterClassesFinished',
    DAY1_NOT_YET_FINISHED: 'day1NotYetFinished',
    DAY1_FINISHED: 'day1Finished',
    DAY1_GIVING_NEXT_STEP_HEADSUP: 'day1GivingNextStepHeadsUp',
    DAY2_TO_UNLOCK: 'day2ToUnlock',
    DAY2_NOT_YET_FINISHED: 'day2NotYetFinished',
    DAY2_FINISHED: 'day2Finished',
    DAY2_GIVING_NEXT_STEP_HEADSUP: 'day2GivingNextStepHeadsUp',
    DAY3_TO_UNLOCK: 'day3ToUnlock',
    DAY3_NOT_YET_FINISHED: 'day3NotYetFinished',
    DAY3_FINISHED: 'day3Finished',
    WAITING_FOR_DAY2_TO_UNLOCK: 'waitingForDay2ToUnlock',
    WAITING_FOR_DAY3_TO_UNLOCK: 'waitingForDay3ToUnlock',
    COMPLETED_ALL_MASTER_CLASSES: 'completedAllMasterClasses',
};

class Service {
    TAG = 'MasterClassProgressMachine';

    initialize = (dispatch, getState, config = this.machineConfig) => {
        this.getState = getState;
        this.dispatch = dispatch;
        this.stop();
        this.machine = machine.withConfig(config);
        this.machineService = interpret(this.machine);
        this.machineService.onTransition(this._onStateChange);
        this.machineService.onDone(this._onDone);
    };

    getCurrentState = () => this.machineService.state;

    isDone = () => this.machineService.state.done;

    _onStateChange = state => {
        const previousState = get(state, 'history.value');
        log(this.TAG, 'StateChange', {
            previousState,
            triggeredEvent: state.event.type,
            currentState: state.value,
        });
    };

    _onDone = event => {
        log(this.TAG, 'Done', {
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
            log(this.TAG, 'Stop', {
                machineId: this.machineService.sessionId,
            });
        }
    };

    onShowMasterClassesVideosList = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        day,
    ) => {
        this.machineService.send({
            type: Events.GO_TO_MASTER_CLASS_SUMMARY,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            day,
        });
    };
    onPromptedForMasterClasses = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        day,
    ) => {
        this.machineService.send({
            type: Events.PROMPTED_FOR_MASTER_CLASS,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            day,
        });
    };
    goToIntroductionOfMasterClass = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        day,
    ) => {
        this.machineService.send({
            type: Events.GO_TO_INTRODUCTION_OF_MASTER_CLASS,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            day,
        });
    };
    goToDay1 = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        day,
    ) => {
        this.machineService.send({
            type: Events.GO_TO_DAY_1,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            day,
        });
    };
    goToDay2 = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        day,
    ) => {
        this.machineService.send({
            type: Events.GO_TO_DAY_2,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            day,
        });
    };
    goToDay3 = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        day,
    ) => {
        this.machineService.send({
            type: Events.GO_TO_DAY_3,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            day,
        });
    };
    onVideoWatched = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
    ) => {
        this.machineService.send({
            type: Events.VIDEO_WATCHED,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
        });
    };
    onRequestedToContinue = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
    ) => {
        this.machineService.send({
            type: Events.CONTINUE,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
        });
    };
    onRequestedToGoBack = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
        previousScreen,
    ) => {
        this.machineService.send({
            type: Events.GO_BACK,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
            previousScreen,
        });
    };

    onRequestedToGoToHomeScreen = (
        unlockState,
        masterClassesFinishedDates,
        hasTakenIntroductorySittings,
    ) => {
        this.machineService.send({
            type: Events.HOME,
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
        });
    };

    _transitionUIState = event => {
        operations.masterClassesProgress.setMasterClassUIState(event.uiState)(
            this.dispatch,
        );
    };

    showContinueButton = () => {
        operations.masterClassesProgress.setMasterClassContinueButtonVisibility(
            true,
        )(this.dispatch);
    };

    enableContinueButton = () => {
        operations.masterClassesProgress.setMasterClassContinueButtonEnabled(
            true,
        )(this.dispatch);
    };
    disableContinueButton = () => {
        operations.masterClassesProgress.setMasterClassContinueButtonEnabled(
            false,
        )(this.dispatch);
    };

    showHomeButton = () => {
        operations.masterClassesProgress.setMasterClassHomeButtonVisibility(
            true,
        )(this.dispatch);
    };
    enableHomeButton = () => {
        operations.masterClassesProgress.setMasterClassHomeButtonEnabled(true)(
            this.dispatch,
        );
    };
    disableHomeButton = () => {
        operations.masterClassesProgress.setMasterClassHomeButtonEnabled(false)(
            this.dispatch,
        );
    };
    goToPromptingForMasterClassesCompletionScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.INTRODUCTION_TO_HFN_MEDITATION,
        });
    };

    goToMasterClassesSummaryScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.MASTER_CLASS_PROGRESS_SUMMARY,
        });
    };

    goToIntroductionAboutMasterClassesScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.INTRODUCTION_MASTER_CLASS_VIDEO_INFO,
        });
    };

    goToDay1MasterClassesScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_1_MASTER_CLASS_VIDEO_INFO,
        });
    };

    goToDay2MasterClassesScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_2_MASTER_CLASS_VIDEO_INFO,
        });
    };

    goToDay3MasterClassesScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_3_MASTER_CLASS_VIDEO_INFO,
        });
    };

    goToDay1CongratulationsScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_1_CONGRATULATIONS,
        });
    };

    goToDay2CongratulationsScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_2_CONGRATULATIONS,
        });
    };

    goToDay3CongratulationsScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_3_CONGRATULATIONS,
        });
    };

    goToDay2WelcomeScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_2_WELCOME_BACK,
        });
    };

    goToDay3WelcomeScreen = () => {
        this._transitionUIState({
            uiState: MASTER_CLASS_UI_STATE.DAY_3_WELCOME_BACK,
        });
    };

    scheduleDay2MasterClassReminderNotification = async (context, event) => {
        const hasTakenIntroductorySittings = event.hasTakenIntroductorySittings;
        const masterClassesFinishedDates = get(
            event,
            'masterClassesFinishedDates',
        );
        const { day1, day2, day3 } = masterClassesFinishedDates;
        const notificationId = await StorageService.day2MasterClassReminderSchedulingNotificationId.getValue();
        if (
            !hasTakenIntroductorySittings &&
            !isNull(day1) &&
            isNull(day2) &&
            isNull(day3) &&
            isUndefined(notificationId)
        ) {
            ReminderNotificationService.scheduleDay2MasterClassReminderNotification(
                day1,
                REMINDER.masterClassDay2ReminderContentId,
            );
        }
    };

    scheduleDay3MasterClassReminderNotification = async (context, event) => {
        const hasTakenIntroductorySittings = event.hasTakenIntroductorySittings;
        const masterClassesFinishedDates = get(
            event,
            'masterClassesFinishedDates',
        );
        const { day2, day3 } = masterClassesFinishedDates;
        const notificationId = await StorageService.day3MasterClassReminderSchedulingNotificationId.getValue();
        if (
            !hasTakenIntroductorySittings &&
            !isNull(day2) &&
            isNull(day3) &&
            isUndefined(notificationId)
        ) {
            ReminderNotificationService.scheduleDay3MasterClassReminderNotification(
                day2,
                REMINDER.masterClassDay3ReminderContentId,
            );
        }
    };
    cancelDay2MasterClassReminderNotification = () => {
        ReminderNotificationService.cancelNotificationIfPresentInStorage(
            StorageService.day2MasterClassReminderSchedulingNotificationId,
        );
    };
    cancelDay3MasterClassReminderNotification = () => {
        ReminderNotificationService.cancelNotificationIfPresentInStorage(
            StorageService.day3MasterClassReminderSchedulingNotificationId,
        );
    };

    goToPreviousScreen = (context, event) => {
        Actions.jump(event.previousScreen);
    };

    goToHomeScreen = () => {
        Actions.jump(Scenes.home);
    };

    isIntroductorySittingsCompleted = (context, event) => {
        return event.hasTakenIntroductorySittings;
    };

    shouldPromptForMasterClassOnBack = context => {
        return (
            context.history.length > 0 &&
            isEqual(context.history[0], 'promptingForMasterClassesCompletion')
        );
    };

    pushToHistory = assign({
        history: (context, event, { state }) => {
            return concat(context.history, state.value);
        },
    });

    popFromHistory = assign({
        history: context => {
            return slice(context.history, 0, context.history.length - 1);
        },
    });

    isMatchingTargetState = (context, event, { cond }) => {
        const { targetState } = cond;
        const history = context.history;
        return isEqual(last(history), targetState);
    };

    isIntroductionAboutMasterClassesFinished = (context, event) => {
        return (
            event.hasTakenIntroductorySittings ||
            !isNull(
                get(
                    event,
                    'masterClassesFinishedDates.introductionAboutMasterClasses',
                ),
            )
        );
    };
    isDay1NotYetFinished = (context, event) => {
        return isNull(get(event, 'masterClassesFinishedDates.day1'));
    };

    isDay1Finished = (context, event) => {
        return (
            event.hasTakenIntroductorySittings ||
            !isNull(get(event, 'masterClassesFinishedDates.day1'))
        );
    };

    isDay2Finished = (context, event) => {
        return (
            event.hasTakenIntroductorySittings ||
            !isNull(get(event, 'masterClassesFinishedDates.day2'))
        );
    };

    machineConfig = {
        guards: {
            isIntroductorySittingsCompleted: this
                .isIntroductorySittingsCompleted,
            isIntroductionAboutMasterClassesFinished: this
                .isIntroductionAboutMasterClassesFinished,
            isDay1NotYetFinished: this.isDay1NotYetFinished,
            isDay1Finished: this.isDay1Finished,
            isDay2Finished: this.isDay2Finished,
            shouldPromptForMasterClassOnBack: this
                .shouldPromptForMasterClassOnBack,
            isMatchingTargetState: this.isMatchingTargetState,
        },
        actions: {
            pushToHistory: this.pushToHistory,
            popFromHistory: this.popFromHistory,
            goToPromptingForMasterClassesCompletionScreen: this
                .goToPromptingForMasterClassesCompletionScreen,
            goToMasterClassesSummaryScreen: this.goToMasterClassesSummaryScreen,
            goToIntroductionAboutMasterClassesScreen: this
                .goToIntroductionAboutMasterClassesScreen,
            showContinueButton: this.showContinueButton,
            enableContinueButton: this.enableContinueButton,
            disableContinueButton: this.disableContinueButton,
            goToDay1MasterClassesScreen: this.goToDay1MasterClassesScreen,
            goToDay1CongratulationsScreen: this.goToDay1CongratulationsScreen,
            goToDay2WelcomeScreen: this.goToDay2WelcomeScreen,
            goToDay2MasterClassesScreen: this.goToDay2MasterClassesScreen,
            goToDay2CongratulationsScreen: this.goToDay2CongratulationsScreen,
            goToDay3WelcomeScreen: this.goToDay3WelcomeScreen,
            goToDay3MasterClassesScreen: this.goToDay3MasterClassesScreen,
            goToDay3CongratulationsScreen: this.goToDay3CongratulationsScreen,
            showHomeButton: this.showHomeButton,
            enableHomeButton: this.enableHomeButton,
            disableHomeButton: this.disableHomeButton,
            goToPreviousScreen: this.goToPreviousScreen,
            goToHomeScreen: this.goToHomeScreen,
            scheduleDay2MasterClassReminderNotification: this
                .scheduleDay2MasterClassReminderNotification,
            scheduleDay3MasterClassReminderNotification: this
                .scheduleDay3MasterClassReminderNotification,
            cancelDay2MasterClassReminderNotification: this
                .cancelDay2MasterClassReminderNotification,
            cancelDay3MasterClassReminderNotification: this
                .cancelDay3MasterClassReminderNotification,
        },
    };
}

export const MasterClassProgressMachine = new Service();
