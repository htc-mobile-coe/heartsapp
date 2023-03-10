import {
    SET_MASTER_CLASS_FINISHED_DATE,
    SET_LOADING,
    SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
    SET_UI_STATE,
    SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
    SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
    SET_MASTERCLASS_HOME_BUTTON_ENABLED,
} from './types';

const initial = {
    masterClassesFinishedDates: {
        introductionAboutMasterClasses: null,
        day1: null,
        day2: null,
        day3: null,
    },
    loading: false,
    uiState: undefined,
    enableContinueButton: false,
    enableHomeButton: false,
    showContinueButton: false,
    showHomeButton: false,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...previousState,
                loading: true,
            };

        case SET_MASTER_CLASS_FINISHED_DATE:
            return {
                ...previousState,
                masterClassesFinishedDates: {
                    ...previousState.masterClassesFinishedDates,
                    ...action.payload,
                },
                loading: false,
            };

        case SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED:
            return {
                ...previousState,
                enableContinueButton: action.payload.enableContinueButton,
            };
        case SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY:
            return {
                ...previousState,
                showContinueButton: action.payload.showContinueButton,
            };
        case SET_MASTERCLASS_HOME_BUTTON_VISIBILITY:
            return {
                ...previousState,
                showHomeButton: action.payload.showHomeButton,
            };
        case SET_MASTERCLASS_HOME_BUTTON_ENABLED:
            return {
                ...previousState,
                enableHomeButton: action.payload.enableHomeButton,
            };
        case SET_UI_STATE:
            return {
                ...previousState,
                uiState: action.payload.uiState,
            };
    }

    return previousState;
};
