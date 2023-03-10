import {
    SET_STATE,
    SET_ELAPSED_MEDITATION_DURATION,
    SET_MEDITATION_SESSION_CONFIGURATION,
    SET_MEDITATION_CANCEL_BUTTON_ENABLE,
    SET_REQUEST_FOR_MEDITATION_SESSION,
    SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
} from './types';

export const setState = (
    uiState,
    preceptorName,
    sessionStartTime,
    sessionEndTime,
) => {
    return {
        type: SET_STATE,
        payload: {
            uiState,
            preceptorName,
            sessionStartTime,
            sessionEndTime,
        },
    };
};

export const setElapsedMeditationDuration = elapsedMeditationDuration => {
    return {
        type: SET_ELAPSED_MEDITATION_DURATION,
        payload: {
            elapsedMeditationDuration,
        },
    };
};

export const setMeditationSessionConfiguration = (
    maxMeditateSessionDuration,
    maxMeditationSessionsRecommended,
    timeperiodForSessions,
) => {
    return {
        type: SET_MEDITATION_SESSION_CONFIGURATION,
        payload: {
            maxMeditateSessionDuration,
            maxMeditationSessionsRecommended,
            timeperiodForSessions,
        },
    };
};

export const setMeditationCancelButtonEnable = enableMeditationCancelButton => {
    return {
        type: SET_MEDITATION_CANCEL_BUTTON_ENABLE,
        payload: {
            enableMeditationCancelButton,
        },
    };
};
export const setShouldRequestForMeditationWithTrainerSession = requestForMeditation => {
    return {
        type: SET_REQUEST_FOR_MEDITATION_SESSION,
        payload: requestForMeditation,
    };
};
export const setMaxWaitingEndTimeBeforeSessionStart = endTime => {
    return {
        type: SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
        payload: { sessionWaitingCountDownEndTime: endTime },
    };
};
