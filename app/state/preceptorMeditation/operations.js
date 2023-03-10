import { PRECEPTOR_MEDITATION_UI_STATE } from '../../shared/Constants';
import {
    setState,
    setElapsedMeditationDuration,
    setOptedPostMeditationExperienceRecording as setOptedPostMeditationExperienceRecordingAction,
} from './actions';
import StorageService from '../../services/native/AppStorageService';
import { isUndefined } from 'lodash';

export const transitionTo = (targetState, totalNoOfSeekers) => {
    return (dispatch, getState) => {
        const currentUiState = getState().preceptorMeditation.uiState;

        if (!currentUiState) {
            dispatch(setState(targetState, totalNoOfSeekers));
            return;
        }

        const isPreviousStateOfCurrentState = currentUiState > targetState;

        if (!isPreviousStateOfCurrentState) {
            dispatch(setState(targetState, totalNoOfSeekers));
        }
    };
};

export const updateMeditationDurationTimerTick = time => {
    return dispatch => {
        dispatch(setElapsedMeditationDuration(time));
    };
};

export const reset = () => {
    return dispatch => {
        dispatch(
            setState(
                PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_AVAILABLE_FOR_SITTING,
                0,
            ),
        );
    };
};

export const setOptedPostMeditationExperienceRecording = opted => {
    return dispatch => {
        savePostMeditationExperienceRecordingOptionInStorage(opted);
        dispatch(setOptedPostMeditationExperienceRecordingAction(opted));
    };
};

export const loadFromStorage = () => {
    return async dispatch => {
        await _loadPostMeditationExperienceRecordingOptionFromStorage(dispatch);
    };
};

const _loadPostMeditationExperienceRecordingOptionFromStorage = async dispatch => {
    try {
        const opted = await StorageService.preceptorPostMeditationExperienceRecordingOption.getValue();
        if (!isUndefined(opted)) {
            setOptedPostMeditationExperienceRecording(opted)(dispatch);
        } else {
            setOptedPostMeditationExperienceRecording(true)(dispatch);
        }
    } catch (err) {}
};

const savePostMeditationExperienceRecordingOptionInStorage = value => {
    StorageService.preceptorPostMeditationExperienceRecordingOption.setValue(
        value,
    );
};
