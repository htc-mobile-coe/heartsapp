import reducer from './reducers';
import {
    SET_STATE,
    SET_ELAPSED_MEDITATION_DURATION,
    SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
} from './types';
import { PRECEPTOR_MEDITATION_UI_STATE } from '../../shared/Constants';

describe('UserReducers', () => {
    it('Should set initial state null by default to indicate not yet determined', () => {
        expect(reducer(undefined, {})).toEqual({
            elapsedMeditationDuration: undefined,
            optedPostMeditationExperienceRecording: true,
            totalNoOfSeekers: 0,
            uiState: undefined,
        });
    });

    it('Should set uiState values based on payload', () => {
        expect(
            reducer(
                {
                    uiState:
                        PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_AVAILABLE_FOR_SITTING,
                },
                {
                    type: SET_STATE,
                    payload:
                        PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_AVAILABLE_FOR_SITTING,
                },
            ),
        ).toEqual({
            uiState:
                PRECEPTOR_MEDITATION_UI_STATE.PRECEPTOR_AVAILABLE_FOR_SITTING,
        });
    });

    it('Should set elapsedMeditationDuration values based on payload', () => {
        expect(
            reducer(
                {
                    elapsedMeditationDuration: 100,
                },
                {
                    type: SET_ELAPSED_MEDITATION_DURATION,
                    payload: { elapsedMeditationDuration: 100 },
                },
            ),
        ).toEqual({
            elapsedMeditationDuration: 100,
        });
    });

    it('Should set optedPostMeditationExperienceRecording values based on payload', () => {
        expect(
            reducer(
                {
                    optedPostMeditationExperienceRecording: true,
                },
                {
                    type: SET_OPTED_POST_MEDITATION_EXPERIENCE_RECORDING,
                    payload: { optedPostMeditationExperienceRecording: false },
                },
            ),
        ).toEqual({
            optedPostMeditationExperienceRecording: false,
        });
    });
});
