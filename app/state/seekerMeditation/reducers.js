import {
    SET_STATE,
    SET_MEDITATION_SESSION_CONFIGURATION,
    SET_MEDITATION_CANCEL_BUTTON_ENABLE,
    SET_REQUEST_FOR_MEDITATION_SESSION,
    SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
} from './types';
import { DEFAULT_TRAINER_NAME } from '../../shared/Constants';

const initial = {
    uiState: undefined,
    preceptorName: DEFAULT_TRAINER_NAME,
    maxMeditateSessionDuration: undefined,
    maxMeditationSessionsRecommended: undefined,
    timeperiodForSessions: undefined,
    elapsedMeditationDuration: undefined,
    sessionStartTime: undefined,
    sessionEndTime: undefined,
    sessionWaitingCountDownEndTime: undefined,
    enableMeditationCancelButton: false,
    shouldRequestForMeditationWithTrainerSession: undefined,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_STATE:
            return { ...previousState, ...action.payload };
        case SET_MEDITATION_SESSION_CONFIGURATION:
            return {
                ...previousState,
                maxMeditateSessionDuration:
                    action.payload.maxMeditateSessionDuration,
                maxMeditationSessionsRecommended:
                    action.payload.maxMeditationSessionsRecommended,
                timeperiodForSessions: action.payload.timeperiodForSessions,
            };
        case SET_MEDITATION_CANCEL_BUTTON_ENABLE:
            return {
                ...previousState,
                enableMeditationCancelButton:
                    action.payload.enableMeditationCancelButton,
            };
        case SET_REQUEST_FOR_MEDITATION_SESSION:
            return {
                ...previousState,
                shouldRequestForMeditationWithTrainerSession: action.payload,
            };
        case SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START:
            return {
                ...previousState,
                sessionWaitingCountDownEndTime:
                    action.payload.sessionWaitingCountDownEndTime,
            };
        default:
            return { ...previousState };
    }
};
