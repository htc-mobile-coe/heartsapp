import {
    SEEKER_MEDITATION_UI_STATE,
    DEFAULT_TRAINER_NAME,
} from '../../shared/Constants';
import {
    setState,
    setElapsedMeditationDuration,
    setMeditationSessionConfiguration,
    setMeditationCancelButtonEnable,
    setShouldRequestForMeditationWithTrainerSession as setShouldRequestForMeditationWithTrainerSessionAction,
    setMaxWaitingEndTimeBeforeSessionStart as setMaxWaitingEndTimeBeforeSessionStartAction,
} from './actions';
import { isEmpty } from 'lodash';
import {
    getMaxMeditationSessionDurationInSeconds,
    getMaxNoOfRecommendedMeditationSessionsInTimePeriod,
    getTimePeriodOfMaxRecommendedMeditationSessionsInDays,
} from '../../services/firebase/RemoteConfigService';
import { getFormattedTimeInMinutes } from '../../utils/date-utils';

export const transitionTo = (
    targetState,
    preceptorName,
    startTime,
    endTime,
) => {
    return dispatch => {
        const _preceptorName = isEmpty(preceptorName)
            ? DEFAULT_TRAINER_NAME
            : preceptorName;

        dispatch(setState(targetState, _preceptorName, startTime, endTime));
    };
};

export const updateMeditationDurationTimerTick = time => {
    return dispatch => {
        dispatch(setElapsedMeditationDuration(time));
    };
};

export const loadMeditateSessionConfigurationFromFirebase = () => {
    return dispatch => {
        const value = getFormattedTimeInMinutes(
            getMaxMeditationSessionDurationInSeconds(),
        );
        dispatch(
            setMeditationSessionConfiguration(
                value,
                getMaxNoOfRecommendedMeditationSessionsInTimePeriod(),
                getTimePeriodOfMaxRecommendedMeditationSessionsInDays(),
            ),
        );
    };
};

export const reset = () => {
    return dispatch => {
        dispatch(
            setState(
                SEEKER_MEDITATION_UI_STATE.CONNECTING_TO_TRAINER,
                DEFAULT_TRAINER_NAME,
            ),
        );
    };
};

export const setEnableMeditationCancelButton = value => {
    return dispatch => {
        dispatch(setMeditationCancelButtonEnable(value));
    };
};

export const setShouldRequestForMeditationWithTrainerSession = value => {
    return dispatch => {
        dispatch(setShouldRequestForMeditationWithTrainerSessionAction(value));
    };
};
export const setMaxWaitingEndTimeBeforeSessionStart = value => {
    return dispatch => {
        dispatch(setMaxWaitingEndTimeBeforeSessionStartAction(value));
    };
};
