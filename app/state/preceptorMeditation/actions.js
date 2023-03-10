import {
    SET_STATE,
    SET_ELAPSED_MEDITATION_DURATION,
    SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
} from './types';

export const setState = (uiState, totalNoOfSeekers) => {
    return {
        type: SET_STATE,
        payload: {
            uiState,
            totalNoOfSeekers,
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

export const setOptedPostMeditationExperienceRecording = opted => {
    return {
        type: SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
        payload: {
            optedPostMeditationExperienceRecording: opted,
        },
    };
};
