import {
    SET_UI_STATE,
    SET_SESSION_DETAILS,
    CLEAR_SITTING_DETAILS,
} from './types';
import {
    setOfflineSittingDetailUIState,
    getOfflineSittingDetailSeekerList,
    setSessionDetails,
    clearOfflineSittingDetails,
} from './operations';

describe('OfflineSittingDetailOperations', () => {
    it('Should able to set offline sitting detail UI state', () => {
        const dispatchMock = jest.fn();
        setOfflineSittingDetailUIState('ADD_OFFLINE_SITTING_DETAILS')(
            dispatchMock,
        );

        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { uiState: 'ADD_OFFLINE_SITTING_DETAILS' },
            type: SET_UI_STATE,
        });
    });
    it('Should able to clear offline sittings details', () => {
        const dispatchMock = jest.fn();
        clearOfflineSittingDetails()(dispatchMock);

        expect(dispatchMock).toHaveBeenCalledWith({
            type: CLEAR_SITTING_DETAILS,
        });
    });
    it('Should be able to call setSessionDetailsAction and set values to offlineSessionDetails state properly', () => {
        const offlineSessionDetailsMock = {
            date: '21/01/2022',
            startTime: '11:00 AM',
            endTime: '11:23 AM',
            duration: '23:00',
            numberOfPeople: 2,
            seekerList: 'nameMock',
            comments: 'commentsMock',
        };
        const dispatchMock = jest.fn();
        setSessionDetails(offlineSessionDetailsMock)(dispatchMock);
        expect(dispatchMock).toHaveBeenCalledWith({
            payload: { offlineSessionDetails: offlineSessionDetailsMock },
            type: SET_SESSION_DETAILS,
        });
    });
    it('Should able to get offline sitting detail seeker list', () => {
        const seekerListMock = [{ name: 'nameMock', id: 1 }];
        expect(
            getOfflineSittingDetailSeekerList({
                offlineSittingDetail: {
                    offlineSessionDetails: {
                        seekerList: seekerListMock,
                    },
                },
            }),
        ).toBe(seekerListMock);
    });
});
