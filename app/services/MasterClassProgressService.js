import { operations } from '../state';
import { MasterClassProgressMachine } from '../machines/MasterClassProgress';
import { get, isNull } from 'lodash';
import { Scenes } from '../shared/Constants';

export const MASTER_CLASS_UI_STATE = {
    //Newly added ui states
    INTRODUCTION_TO_HFN_MEDITATION: 'INTRODUCTION_TO_HFN_MEDITATION',
    MASTER_CLASS_PROGRESS_SUMMARY: 'MASTER_CLASS_PROGRESS_SUMMARY',
    INTRODUCTION_MASTER_CLASS_VIDEO_INFO:
        'INTRODUCTION_MASTER_CLASS_VIDEO_INFO',
    DAY_1_MASTER_CLASS_VIDEO_INFO: 'DAY_1_MASTER_CLASS_VIDEO_INFO',
    DAY_2_MASTER_CLASS_VIDEO_INFO: 'DAY_2_MASTER_CLASS_VIDEO_INFO',
    DAY_3_MASTER_CLASS_VIDEO_INFO: 'DAY_3_MASTER_CLASS_VIDEO_INFO',
    DAY_1_CONGRATULATIONS: 'DAY_1_CONGRATULATIONS',
    DAY_2_CONGRATULATIONS: 'DAY_2_CONGRATULATIONS',
    DAY_3_CONGRATULATIONS: 'DAY_3_CONGRATULATIONS',
    DAY_2_WELCOME_BACK: 'DAY_2_WELCOME_BACK',
    DAY_3_WELCOME_BACK: 'DAY_3_WELCOME_BACK',
};

class MasterClassProgressService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };
    start = (
        previousScreen = Scenes.home,
        landOnMasterClassesSummary = true,
    ) => {
        MasterClassProgressMachine.stop();
        MasterClassProgressMachine.start();
        this.previousScreen = previousScreen;
        const masterClassesFinishedDates = get(
            this.getState(),
            'masterClassesProgress.masterClassesFinishedDates',
        );
        const requestMasterClass = landOnMasterClassesSummary
            ? MasterClassProgressMachine.onShowMasterClassesVideosList
            : MasterClassProgressMachine.onPromptedForMasterClasses;

        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        const hasTakenIntroductorySittings = operations.user.hasTakenIntroductorySittings(
            this.getState(),
        );
        requestMasterClass(
            unlockState,
            masterClassesFinishedDates,
            hasTakenIntroductorySittings,
        );
    };
    goToIntroductionOfMasterClass = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.goToIntroductionOfMasterClass(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
        );
    };
    goToDay1 = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.goToDay1(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
        );
    };
    goToDay2 = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.goToDay2(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
        );
    };
    goToDay3 = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.goToDay3(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
        );
    };
    onRequestedToGoBack = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.onRequestedToGoBack(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
            this.previousScreen,
        );
    };
    onRequestedContinueForMasterClass = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.onRequestedToContinue(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
        );
    };
    onVideoWatched = masterClassVideoId => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        operations.masterClassesProgress.setMasterClassFinished(
            masterClassVideoId,
        )(this.dispatch, this.getState);

        const masterClassesFinishedDates = get(
            this.getState(),
            'masterClassesProgress.masterClassesFinishedDates',
        );
        if (
            !isNull(masterClassesFinishedDates.day3) &&
            !operations.user.hasTakenIntroductorySittings(this.getState())
        ) {
            operations.user.setTakenIntroductorySittings(true)(this.dispatch);
        }

        MasterClassProgressMachine.onVideoWatched(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
            masterClassVideoId,
        );
    };
    onRequestedToGoToHomeScreen = () => {
        const unlockState = operations.masterClassesProgress.getUnLocked(
            this.getState(),
        );
        MasterClassProgressMachine.onRequestedToGoToHomeScreen(
            unlockState,
            get(
                this.getState(),
                'masterClassesProgress.masterClassesFinishedDates',
            ),
            operations.user.hasTakenIntroductorySittings(this.getState()),
        );
    };
}

export default new MasterClassProgressService();
