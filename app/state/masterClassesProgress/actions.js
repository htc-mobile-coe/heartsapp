import {
    SET_LOADING,
    SET_MASTER_CLASS_FINISHED_DATE,
    SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
    SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
    SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
    SET_MASTERCLASS_HOME_BUTTON_ENABLED,
    SET_UI_STATE,
} from './types';

export const setLoading = () => {
    return {
        type: SET_LOADING,
    };
};

export const setMasterClassFinishedDates = (
    introductionAboutMasterClasses,
    day1,
    day2,
    day3,
) => {
    return {
        type: SET_MASTER_CLASS_FINISHED_DATE,
        payload: {
            introductionAboutMasterClasses,
            day1,
            day2,
            day3,
        },
    };
};

export const setMasterClassContinueButtonEnabledAction = enableContinueButton => {
    return {
        type: SET_MASTERCLASS_CONTINUE_BUTTON_ENABLED,
        payload: {
            enableContinueButton,
        },
    };
};
export const setMasterClassHomeButtonEnabledAction = enableHomeButton => {
    return {
        type: SET_MASTERCLASS_HOME_BUTTON_ENABLED,
        payload: {
            enableHomeButton,
        },
    };
};
export const setMasterClassContinueButtonVisibilityAction = showContinueButton => {
    return {
        type: SET_MASTERCLASS_CONTINUE_BUTTON_VISIBILITY,
        payload: {
            showContinueButton,
        },
    };
};
export const setMasterClassHomeButtonVisibilityAction = showHomeButton => {
    return {
        type: SET_MASTERCLASS_HOME_BUTTON_VISIBILITY,
        payload: {
            showHomeButton,
        },
    };
};

export const setMasterClassUIState = uiState => {
    return {
        type: SET_UI_STATE,
        payload: {
            uiState,
        },
    };
};
