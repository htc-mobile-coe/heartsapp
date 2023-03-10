import {
    SET_UI_STATE,
    SET_SESSION_DETAILS,
    CLEAR_SITTING_DETAILS,
} from './types';

const initial = {
    uiState: undefined,
    offlineSessionDetails: undefined,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_UI_STATE:
            return { ...previousState, uiState: action.payload.uiState };
        case SET_SESSION_DETAILS:
            return {
                ...previousState,
                offlineSessionDetails: action.payload.offlineSessionDetails,
            };
        case CLEAR_SITTING_DETAILS:
            return {
                uiState: null,
                offlineSessionDetails: null,
            };
        default:
            return previousState;
    }
};
