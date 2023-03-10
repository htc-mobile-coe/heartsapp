import reducer from './reducers';
import {
    SET_MEDITATION_CANCEL_BUTTON_ENABLE,
    SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
    SET_REQUEST_FOR_MEDITATION_SESSION,
} from './types';
import { DEFAULT_TRAINER_NAME } from '../../shared/Constants';

describe('SeekerMeditationReducers', () => {
    it('Should be initial state value', () => {
        expect(reducer(undefined, {})).toEqual({
            uiState: undefined,
            preceptorName: DEFAULT_TRAINER_NAME,
            maxMeditateSessionDuration: undefined,
            maxMeditationSessionsRecommended: undefined,
            timeperiodForSessions: undefined,
            elapsedMeditationDuration: undefined,
            sessionStartTime: undefined,
            sessionEndTime: undefined,
            enableMeditationCancelButton: false,
            shouldRequestForMeditationWithTrainerSession: undefined,
        });
    });
    it('Should able set enableMeditationCancelButton to true', () => {
        expect(
            reducer(
                { enableMeditationCancelButton: false },
                {
                    type: SET_MEDITATION_CANCEL_BUTTON_ENABLE,
                    payload: { enableMeditationCancelButton: true },
                },
            ),
        ).toEqual({
            enableMeditationCancelButton: true,
        });
    });
    it('Should able set shouldRequestForMeditationWithTrainerSession to true', () => {
        expect(
            reducer(
                { shouldRequestForMeditationWithTrainerSession: false },
                {
                    type: SET_REQUEST_FOR_MEDITATION_SESSION,
                    payload: true,
                },
            ),
        ).toEqual({
            shouldRequestForMeditationWithTrainerSession: true,
        });
    });
    it('Should able set sessionWaitingCountDownEndTime to true', () => {
        expect(
            reducer(
                { sessionWaitingCountDownEndTime: false },
                {
                    type: SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
                    payload: { sessionWaitingCountDownEndTime: '12-09-2029' },
                },
            ),
        ).toEqual({
            sessionWaitingCountDownEndTime: '12-09-2029',
        });
    });
});
