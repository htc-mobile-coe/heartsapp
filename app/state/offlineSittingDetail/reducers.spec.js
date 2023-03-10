import reducer from './reducers';
import {
    SET_UI_STATE,
    SET_SESSION_DETAILS,
    CLEAR_SITTING_DETAILS,
} from './types';

describe('OfflineSittingDetailReducers', () => {
    it('Should set initial state by default', () => {
        expect(reducer(undefined, {})).toEqual({
            uiState: undefined,
        });
    });
    it('Should able to set UI state based on payload', () => {
        expect(
            reducer(
                { uiState: 'SEEKERS_SELECTION_COMPONENT' },
                {
                    type: SET_UI_STATE,
                    payload: {
                        uiState: 'SEEKERS_SELECTION_COMPONENT',
                    },
                },
            ),
        ).toEqual({
            uiState: 'SEEKERS_SELECTION_COMPONENT',
        });
    });
    it('Should set offlineSessionDetails values based on payload', () => {
        expect(
            reducer(
                {
                    offlineSessionDetails: {
                        date: '21/01/2022',
                        startTime: '11:00 AM',
                        endTime: '11:23 AM',
                        duration: '23:00',
                        numberOfPeople: 2,
                        seekerList: [],
                        comments: 'commentsMock',
                    },
                },
                {
                    type: SET_SESSION_DETAILS,
                    payload: {
                        offlineSessionDetails: {
                            date: '21/01/2022',
                            startTime: '11:00 AM',
                            endTime: '11:23 AM',
                            duration: '23:00',
                            numberOfPeople: 2,
                            seekerList: [],
                            comments: 'commentsMock',
                        },
                    },
                },
            ),
        ).toEqual({
            offlineSessionDetails: {
                date: '21/01/2022',
                startTime: '11:00 AM',
                endTime: '11:23 AM',
                duration: '23:00',
                numberOfPeople: 2,
                seekerList: [],
                comments: 'commentsMock',
            },
        });
    });
    it('Should able clear offline sitting details', () => {
        expect(
            reducer(
                {
                    uiState: 'SEEKERS_SELECTION_COMPONENT',
                    offlineSessionDetails: {
                        date: '21/01/2022',
                        startTime: '11:00 AM',
                        endTime: '11:23 AM',
                        duration: '23:00',
                        numberOfPeople: 2,
                        seekerList: [],
                        comments: 'commentsMock',
                    },
                },
                {
                    type: CLEAR_SITTING_DETAILS,
                },
            ),
        ).toEqual({
            uiState: null,
            offlineSessionDetails: null,
        });
    });
});
