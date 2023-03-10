import {
    setUiState,
    setTrackOptions,
    setMeditationSessionStartTime,
    clearOfflinePreceptorMeditationDetails,
    loadFromStorage,
} from './operations';
import {
    SET_UI_STATE,
    SET_TRACK_OPTIONS,
    SET_MEDITATION_SESSION_START_TIME,
    CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
} from './types';
import { spyOnProperty } from '../../utils/TestUtils';
import StorageService from '../../services/native/AppStorageService';
import moment from 'moment';

describe('OfflinePreceptorMeditationOperations', () => {
    let setOfflinePreceptorMeditationStartedTimeStorageMock;
    let getOfflinePreceptorMeditationStartedTimeStorageMock;

    const prepareOfflinePreceptorMeditationStartedTimeStorage = value => {
        setOfflinePreceptorMeditationStartedTimeStorageMock = jest
            .fn()
            .mockImplementation(() => {});
        getOfflinePreceptorMeditationStartedTimeStorageMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(StorageService, 'offlinePreceptorMeditationStartedTime', {
            setValue: setOfflinePreceptorMeditationStartedTimeStorageMock,
            getValue: getOfflinePreceptorMeditationStartedTimeStorageMock,
        });
    };
    afterEach(() => {
        if (setOfflinePreceptorMeditationStartedTimeStorageMock) {
            setOfflinePreceptorMeditationStartedTimeStorageMock.mockClear();
            setOfflinePreceptorMeditationStartedTimeStorageMock = undefined;
        }
        if (getOfflinePreceptorMeditationStartedTimeStorageMock) {
            getOfflinePreceptorMeditationStartedTimeStorageMock.mockClear();
            getOfflinePreceptorMeditationStartedTimeStorageMock = undefined;
        }
    });

    it('Should be able to call setUiStateAction and set value to uiState state properly', () => {
        const dispatchMock = jest.fn();
        setUiState(0)(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { uiState: 0 },
            type: SET_UI_STATE,
        });
    });
    it('Should be able to call setTrackOptionsAction and set value to trackOptions state properly', () => {
        const dispatchMock = jest.fn();
        setTrackOptions('TRACK_NOW')(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { trackOptions: 'TRACK_NOW' },
            type: SET_TRACK_OPTIONS,
        });
    });

    it('Should be able to call setMeditationSessionStartTimeAction and set value to meditationSessionStartTime state  properly', () => {
        const dispatchMock = jest.fn();
        setMeditationSessionStartTime('2022-10-30T00:00:00.000Z')(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { meditationSessionStartTime: '2022-10-30T00:00:00.000Z' },
            type: SET_MEDITATION_SESSION_START_TIME,
        });
    });
    it('Should able to clear offline preceptor meditation session details', () => {
        const dispatchMock = jest.fn();
        clearOfflinePreceptorMeditationDetails()(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            type: CLEAR_OFFLINE_PRECEPTOR_MEDITATION_DETAILS,
        });
    });

    describe('#loadFromStorage', () => {
        it('should set meditationSessionStartTime and uiState values properly from storage when offlinePreceptorMeditationStartedTime storage is having a valid value', async () => {
            const dispatchMock = jest.fn();
            prepareOfflinePreceptorMeditationStartedTimeStorage(
                '2022-10-30T00:00:00.000Z',
            );
            await loadFromStorage()(dispatchMock);
            expect(
                getOfflinePreceptorMeditationStartedTimeStorageMock,
            ).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    meditationSessionStartTime: moment(
                        '2022-10-30T00:00:00.000Z',
                    ),
                },
                type: SET_MEDITATION_SESSION_START_TIME,
            });
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    uiState: 'MEDITATION_IN_PROGRESS',
                },
                type: SET_UI_STATE,
            });
        });
        it('should not call setMeditationSessionStartTime and setUiState when offlinePreceptorMeditationStartedTime storage is undefined', async () => {
            const dispatchMock = jest.fn();
            prepareOfflinePreceptorMeditationStartedTimeStorage(undefined);

            await loadFromStorage()(dispatchMock);

            expect(
                getOfflinePreceptorMeditationStartedTimeStorageMock,
            ).toBeCalled();
            expect(dispatchMock).not.toBeCalled();
        });
    });
});
