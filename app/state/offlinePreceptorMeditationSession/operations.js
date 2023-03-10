import {
    setUiState as setUiStateAction,
    setTrackOptions as setTrackOptionsAction,
    setMeditationSessionStartTime as setMeditationSessionStartTimeAction,
    clearOfflinePreceptorMeditationDetails as clearOfflinePreceptorMeditationDetailsAction,
} from './actions';
import StorageService from '../../services/native/AppStorageService';
import { isNil } from 'lodash';
import { OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE } from '../../shared/Constants';
import moment from 'moment';

export const setUiState = uiState => {
    return dispatch => {
        dispatch(setUiStateAction(uiState));
    };
};
export const setTrackOptions = trackOptions => {
    return dispatch => {
        dispatch(setTrackOptionsAction(trackOptions));
    };
};

export const setMeditationSessionStartTime = value => {
    return dispatch => {
        StorageService.offlinePreceptorMeditationStartedTime.setValue(value);
        dispatch(setMeditationSessionStartTimeAction(value));
    };
};

export const clearOfflinePreceptorMeditationDetails = () => {
    return dispatch => {
        dispatch(clearOfflinePreceptorMeditationDetailsAction());
    };
};

export const loadFromStorage = () => {
    return async dispatch => {
        await _loadOfflinePreceptorMeditationStartedTimeFromStorage(dispatch);
    };
};

const _loadOfflinePreceptorMeditationStartedTimeFromStorage = async dispatch => {
    try {
        const value = await StorageService.offlinePreceptorMeditationStartedTime.getValue();
        if (!isNil(value)) {
            setMeditationSessionStartTime(moment(value))(dispatch);
            setUiState(
                OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_IN_PROGRESS,
            )(dispatch);
        }
    } catch (err) {}
};
