import {
    SET_UI_STATE,
    SET_SESSION_DETAILS,
    CLEAR_SITTING_DETAILS,
} from './types';

export const setOfflineSittingDetailUIState = uiState => {
    return {
        type: SET_UI_STATE,
        payload: {
            uiState,
        },
    };
};

export const setSessionDetails = offlineSessionDetails => {
    return {
        type: SET_SESSION_DETAILS,
        payload: {
            offlineSessionDetails,
        },
    };
};

export const clearOfflineSittingDetails = () => {
    return {
        type: CLEAR_SITTING_DETAILS,
    };
};
