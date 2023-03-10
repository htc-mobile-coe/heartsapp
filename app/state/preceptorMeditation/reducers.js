import {
    SET_STATE,
    SET_ELAPSED_MEDITATION_DURATION,
    SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
} from './types';

const initial = {
    uiState: undefined,
    totalNoOfSeekers: 0,
    elapsedMeditationDuration: undefined,
    optedPostMeditationExperienceRecording: true,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_STATE:
            return { ...previousState, ...action.payload };
        case SET_ELAPSED_MEDITATION_DURATION:
            return {
                ...previousState,
                elapsedMeditationDuration:
                    action.payload.elapsedMeditationDuration,
            };
        case SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING:
            return {
                ...previousState,
                optedPostMeditationExperienceRecording:
                    action.payload.optedPostMeditationExperienceRecording,
            };
        default:
            return previousState;
    }
};
