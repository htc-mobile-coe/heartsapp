import {
    SET_TRACK_OPTIONS,
    SET_MEDITATION_SESSION_START_TIME,
    CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
    SET_UI_STATE,
} from './types';
import { OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE } from '../../shared/Constants';
const initial = {
    uiState:
        OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
    trackOptions: undefined,
    meditationSessionStartTime: null,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_UI_STATE:
            return { ...previousState, uiState: action.payload.uiState };
        case SET_TRACK_OPTIONS:
            return {
                ...previousState,
                trackOptions: action.payload.trackOptions,
            };
        case SET_MEDITATION_SESSION_START_TIME:
            return {
                ...previousState,
                meditationSessionStartTime:
                    action.payload.meditationSessionStartTime,
            };
        case CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS:
            return {
                ...previousState,
                uiState:
                    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
                meditationSessionStartTime: null,
            };
        default:
            return previousState;
    }
};
