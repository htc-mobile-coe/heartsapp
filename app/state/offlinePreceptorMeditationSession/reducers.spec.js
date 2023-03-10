import reducer from './reducers';
import {
    SET_UI_STATE,
    SET_MEDITATION_DURATION,
    SET_TRACK_OPTIONS,
    SET_MEDITATION_SESSION_START_TIME,
    CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
} from './types';

describe('OfflinePreceptorMeditationReducers', () => {
    const initialStateMock = {
        uiState: 'MEDITATION_YET_TO_START',
        trackOptions: undefined,
        meditationSessionStartTime: null,
    };
    it('Should set initial state by default to indicate not yet determined', () => {
        expect(reducer(undefined, {})).toEqual(initialStateMock);
    });

    it('Should set uiState values based on payload', () => {
        expect(
            reducer(
                {
                    uiState: 'MEDITATION_IN_PROGRESS',
                },
                {
                    type: SET_UI_STATE,
                    payload: { uiState: 'MEDITATION_IN_PROGRESS' },
                },
            ),
        ).toEqual({
            uiState: 'MEDITATION_IN_PROGRESS',
        });
    });

    it('Should set meditationDuration values based on payload', () => {
        expect(
            reducer(
                {
                    meditationDuration: '13:00',
                },
                {
                    type: SET_MEDITATION_DURATION,
                    payload: { meditationDuration: '13:00' },
                },
            ),
        ).toEqual({
            meditationDuration: '13:00',
        });
    });

    it('Should set trackOptions values based on payload', () => {
        expect(
            reducer(
                {
                    trackOptions: 'TRACK_NOW',
                },
                {
                    type: SET_TRACK_OPTIONS,
                    payload: { trackOptions: 'TRACK_NOW' },
                },
            ),
        ).toEqual({
            trackOptions: 'TRACK_NOW',
        });
    });

    it('Should set meditationSessionStartTime values based on payload', () => {
        expect(
            reducer(
                {
                    meditationSessionStartTime: '2022-02-04',
                },
                {
                    type: SET_MEDITATION_SESSION_START_TIME,
                    payload: { meditationSessionStartTime: '2022-02-04' },
                },
            ),
        ).toEqual({
            meditationSessionStartTime: '2022-02-04',
        });
    });
    it('Should clear offlineSessionDetails values', () => {
        expect(
            reducer(
                {},
                {
                    type: CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
                    payload: {},
                },
            ),
        ).toEqual({
            uiState: 'MEDITATION_YET_TO_START',
            meditationSessionStartTime: null,
        });
    });
});
