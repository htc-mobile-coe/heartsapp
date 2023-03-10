import moment from 'moment';
import OfflineSittingDetailService from './OfflineSittingDetailService';
import { OfflineSittingDetailMachine } from '../../machines/OfflineSittingDetail';
import * as OfflineSittingDetailOperation from 'app/state/offlineSittingDetail/operations';

describe('OfflineSittingDetailService', () => {
    const dispatchMock = jest.fn();
    const offlineSittingDetailMachineInitializeMock = jest
        .spyOn(OfflineSittingDetailMachine, 'initialize')
        .mockImplementation(() => {});
    const offlineSittingDetailMachineStartMock = jest
        .spyOn(OfflineSittingDetailMachine, 'start')
        .mockImplementation(() => {});
    const onShowSeekersSelectionMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onShowSeekersSelection')
        .mockImplementation(() => {});
    const onShowSeekerBarcodeScannedResultMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onShowSeekerBarcodeScannedResult')
        .mockImplementation(() => {});
    const onShowSeekerSearchResultMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onShowSeekerSearchResult')
        .mockImplementation(() => {});
    const onShowSelectedSeekersMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onShowSelectedSeekers')
        .mockImplementation(() => {});
    const onShowSessionDetailsMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onShowSessionDetails')
        .mockImplementation(() => {});
    const onAddingSeekersMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onAddingSeekers')
        .mockImplementation(() => {});
    const onSubmitMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onSubmit')
        .mockImplementation(() => {});
    const onGoBackMock = jest
        .spyOn(OfflineSittingDetailMachine, 'onGoBack')
        .mockImplementation(() => {});
    const stopMock = jest
        .spyOn(OfflineSittingDetailMachine, 'stop')
        .mockImplementation(() => {});

    const setSessionDetailsMock = jest
        .spyOn(OfflineSittingDetailOperation, 'setSessionDetails')
        .mockImplementation(() => jest.fn());

    const dateMock = moment(1645900200000);
    let dateNowSpy;
    const offlineDetailsMockValue = {
        date: '21/01/2022',
        startTime: '11:00 AM',
        endTime: '11:23 AM',
        duration: '23:00',
        numberOfPeople: 2,
        seekerList: 'nameMock',
        comments: 'commentsMock',
    };

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });
    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    afterEach(() => {
        dispatchMock.mockClear();
        offlineSittingDetailMachineInitializeMock.mockClear();
        offlineSittingDetailMachineStartMock.mockClear();
        onShowSeekersSelectionMock.mockClear();
        onShowSeekerBarcodeScannedResultMock.mockClear();
        onShowSeekerSearchResultMock.mockClear();
        onShowSelectedSeekersMock.mockClear();
        onShowSessionDetailsMock.mockClear();
        onAddingSeekersMock.mockClear();
        onSubmitMock.mockClear();
        onGoBackMock.mockClear();
        setSessionDetailsMock.mockClear();
        stopMock.mockClear();
    });

    const prepare = (value, screenName) => {
        const getState = jest.fn().mockImplementation(() => ({
            offlineSittingDetail: {
                offlineSessionDetails: value,
            },
        }));
        OfflineSittingDetailService.initialize(dispatchMock, getState);
        OfflineSittingDetailService.start(screenName);
    };
    it('Should able to start with new offline sitting Details', () => {
        prepare();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(setSessionDetailsMock).toHaveBeenCalledWith({
            date: moment(),
            startTime: moment().subtract(35, 'm'),
            endTime: moment(),
            numberOfPeople: '',
            seekerList: [],
            comments: '',
        });
    });
    it('Should able to start with existing offline sitting Details', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onShowSeekersSelection();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(setSessionDetailsMock).not.toBeCalled();
    });
    it('Should able to call show seekers selection, when show seekers selection event called', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onShowSeekersSelection();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onShowSeekersSelectionMock).toHaveBeenCalled();
    });
    it('Should able to call show seeker barcode scanned result, when show seeker barcode scanned result event called', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onShowSeekerBarcodeScannedResult();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onShowSeekerBarcodeScannedResultMock).toHaveBeenCalled();
    });
    it('Should able to call show seeker search result, when show seeker search result event called ', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onShowSeekerSearchResult();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onShowSeekerSearchResultMock).toHaveBeenCalled();
    });
    it('Should able to call show selected seekers, when show selected seekers event called', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onShowSelectedSeekers();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onShowSelectedSeekersMock).toHaveBeenCalled();
    });

    it('Should able to call show session details, when show session details event called', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onShowSessionDetails();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
    });
    it('Should able to call adding seekers, when adding seekers event called', () => {
        const seekerListMock = [{ name: 'nameMock', id: 1 }];
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onAddingSeekers(seekerListMock);
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onAddingSeekersMock).toHaveBeenCalledWith(seekerListMock);
    });
    it('Should able to call submit, when submit event called', () => {
        prepare(offlineDetailsMockValue, 'sittingHistory');

        OfflineSittingDetailService.onSubmit({
            shouldFetchSessionHistory: true,
        });
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onSubmitMock).toHaveBeenCalledWith('sittingHistory', {
            shouldFetchSessionHistory: true,
        });
    });
    it('Should able to call go back, when goBack event called', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.onGoBack();
        expect(offlineSittingDetailMachineStartMock).toHaveBeenCalled();
        expect(onGoBackMock).toHaveBeenCalled();
    });
    it('Should able to stop machine, when stop event called', () => {
        prepare(offlineDetailsMockValue);

        OfflineSittingDetailService.stop();
        expect(stopMock).toHaveBeenCalled();
    });
});
