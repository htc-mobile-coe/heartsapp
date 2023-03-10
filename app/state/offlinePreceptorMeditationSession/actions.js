import {
    SET_UI_STATE,
    SET_TRACK_OPTIONS,
    SET_MEDITATION_SESSION_START_TIME,
    CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
} from './types';

export const setUiState = uiState => {
    return {
        type: SET_UI_STATE,
        payload: { uiState },
    };
};
export const setTrackOptions = trackOptions => {
    return {
        type: SET_TRACK_OPTIONS,
        payload: { trackOptions },
    };
};

export const setMeditationSessionStartTime = meditationSessionStartTime => {
    return {
        type: SET_MEDITATION_SESSION_START_TIME,
        payload: {
            meditationSessionStartTime,
        },
    };
};
export const clearOfflinePreceptorMeditationDetails = () => {
    return {
        type: CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
    };
};
