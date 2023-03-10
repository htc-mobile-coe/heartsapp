import {
    setEnableMeditationCancelButton,
    setMaxWaitingEndTimeBeforeSessionStart,
    setShouldRequestForMeditationWithTrainerSession,
} from './operations';
import {
    SET_MEDITATION_CANCEL_BUTTON_ENABLE,
    SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
    SET_REQUEST_FOR_MEDITATION_SESSION,
} from './types';

describe('SeekerMeditationOperations', () => {
    const dispatchMock = jest.fn();
    afterEach(() => {
        dispatchMock.mockClear();
    });
    it('should set enable meditation cancel Button', () => {
        setEnableMeditationCancelButton(true)(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { enableMeditationCancelButton: true },
            type: SET_MEDITATION_CANCEL_BUTTON_ENABLE,
        });
    });
    it('should able set request for Meditation with trainer session', () => {
        setShouldRequestForMeditationWithTrainerSession(true)(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: true,
            type: SET_REQUEST_FOR_MEDITATION_SESSION,
        });
    });
    it('should set  Meditation Waiting CountDown end Time', () => {
        setMaxWaitingEndTimeBeforeSessionStart('05-10-2021')(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { sessionWaitingCountDownEndTime: '05-10-2021' },
            type: SET_MAX_WAITING_END_TIME_BEFORE_SESSION_START,
        });
    });
});
