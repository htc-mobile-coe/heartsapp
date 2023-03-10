import { OfflineSittingDetailMachine } from './index';
import * as OfflineSittingDetailOperation from '../../state/offlineSittingDetail/operations';
import { Actions } from 'react-native-router-flux';

describe('Offline Sitting Detail', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn();

    const setOfflineSittingDetailUIStateMock = jest.spyOn(
        OfflineSittingDetailOperation,
        'setOfflineSittingDetailUIState',
    );
    const actionsJumpMock = jest.spyOn(Actions, 'jump');
    const initialize = () => {
        OfflineSittingDetailMachine.initialize(dispatchMock, getStateMock);
        OfflineSittingDetailMachine.start();
    };

    afterEach(() => {
        dispatchMock.mockClear();
        getStateMock.mockClear();
        actionsJumpMock.mockClear();
        setOfflineSittingDetailUIStateMock.mockClear();
    });

    it('Should show Add offline sitting details component, when initial state is addingOfflineSittingDetails', () => {
        initialize();
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'ADD_OFFLINE_SITTING_DETAILS',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'addingOfflineSittingDetails',
        );
    });

    it('Should show Seeker selection component, when show seekers selection event called', () => {
        initialize();
        OfflineSittingDetailMachine.onShowSeekersSelection();
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'SEEKER_SELECTION_COMPONENT',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'selectingSeekers',
        );
    });

    it('Should show Seeker Barcode Scanned Result component, when show barcode scanned result event called', () => {
        initialize();
        OfflineSittingDetailMachine.onShowSeekersSelection();
        OfflineSittingDetailMachine.onShowSeekerBarcodeScannedResult();
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'SEEKER_BARCODE_SCANNED_RESULT',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'displayingSeekerBarcodeScannedResult',
        );
    });

    it('Should show Seeker Search Result component, when show seeker search result event called', () => {
        initialize();
        OfflineSittingDetailMachine.onShowSessionDetails();
        OfflineSittingDetailMachine.onShowSeekersSelection();
        OfflineSittingDetailMachine.onShowSeekerSearchResult();
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'SEEKER_SEARCH_RESULT',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'displayingSeekerSearchResult',
        );
    });

    it('Should show Selected Seekers component, when show selected seekers event called', () => {
        initialize();
        OfflineSittingDetailMachine.onShowSessionDetails();
        OfflineSittingDetailMachine.onShowSeekersSelection();
        OfflineSittingDetailMachine.onShowSelectedSeekers();
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'SELECTED_SEEKERS',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'seekersSelected',
        );
    });

    describe('#onShowSessionDetails', () => {
        it('Should show Add offline sitting details component', () => {
            initialize();
            OfflineSittingDetailMachine.onShowSelectedSeekers();
            OfflineSittingDetailMachine.onShowSessionDetails();
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'ADD_OFFLINE_SITTING_DETAILS',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'addingOfflineSittingDetails',
            );
        });
    });

    describe('#onAddingSeekers', () => {
        it('Should show Add offline sitting details component, when current state is Seeker barcode scanned result and seeker list has some values', () => {
            const seekerListMock = [{ name: 'nameMock', id: 1 }];
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSeekerBarcodeScannedResult();
            OfflineSittingDetailMachine.onAddingSeekers(seekerListMock);
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'ADD_OFFLINE_SITTING_DETAILS',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'addingOfflineSittingDetails',
            );
        });

        it('Should not show Add offline sitting details component, when current state is Seeker barcode scanned result and seeker list is empty', () => {
            const seekerListMock = [];
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSeekerSearchResult();
            OfflineSittingDetailMachine.onAddingSeekers(seekerListMock);
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'SEEKER_SEARCH_RESULT',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'displayingSeekerSearchResult',
            );
        });

        it('Should show Add offline sitting details component, when current state is Seeker search result and seeker list has some values', () => {
            const seekerListMock = [{ name: 'nameMock', id: 1 }];
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSeekerSearchResult();
            OfflineSittingDetailMachine.onAddingSeekers(seekerListMock);
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'ADD_OFFLINE_SITTING_DETAILS',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'addingOfflineSittingDetails',
            );
        });

        it('Should not show Add offline sitting details component, when current state is Seeker search result and seeker list is empty', () => {
            const seekerListMock = [];
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSeekerBarcodeScannedResult();
            OfflineSittingDetailMachine.onAddingSeekers(seekerListMock);
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'SEEKER_BARCODE_SCANNED_RESULT',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'displayingSeekerBarcodeScannedResult',
            );
        });
    });

    describe('#goBack', () => {
        it('Should show Add offline sitting details component when current state is Seeker selection component', () => {
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onGoBack();
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'ADD_OFFLINE_SITTING_DETAILS',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'addingOfflineSittingDetails',
            );
            expect(OfflineSittingDetailMachine.isDone()).toBeFalsy();
        });

        it('Should show Seeker selection component when current state is Selected seekers component', () => {
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSelectedSeekers();
            OfflineSittingDetailMachine.onGoBack();
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'SEEKER_SELECTION_COMPONENT',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'selectingSeekers',
            );
            expect(OfflineSittingDetailMachine.isDone()).toBeFalsy();
        });

        it('Should show Seeker selection component when current state is Seeker search result component', () => {
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSeekerSearchResult();
            OfflineSittingDetailMachine.onGoBack();
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'SEEKER_SELECTION_COMPONENT',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'selectingSeekers',
            );
            expect(OfflineSittingDetailMachine.isDone()).toBeFalsy();
        });

        it('Should show Seeker selection component when current state is Seeker barcode scanned result component', () => {
            initialize();
            OfflineSittingDetailMachine.onShowSessionDetails();
            OfflineSittingDetailMachine.onShowSeekersSelection();
            OfflineSittingDetailMachine.onShowSeekerBarcodeScannedResult();
            OfflineSittingDetailMachine.onGoBack();
            expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
                'SEEKER_SELECTION_COMPONENT',
            );
            expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
                'selectingSeekers',
            );
            expect(OfflineSittingDetailMachine.isDone()).toBeFalsy();
        });
    });
    it('Should able to navigate to previous screen on submitting Add offline sitting details form', () => {
        const seekerListMock = [{ name: 'nameMock', id: 1 }];
        initialize();
        OfflineSittingDetailMachine.onShowSessionDetails();
        OfflineSittingDetailMachine.onShowSeekersSelection();
        OfflineSittingDetailMachine.onShowSeekerSearchResult();
        OfflineSittingDetailMachine.onAddingSeekers(seekerListMock);
        OfflineSittingDetailMachine.onSubmit('sittingHistory', {
            shouldFetchSessionHistory: true,
        });
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'ADD_OFFLINE_SITTING_DETAILS',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'exited',
        );
        expect(OfflineSittingDetailMachine.isDone()).toBeTruthy();
        expect(actionsJumpMock).toBeCalledWith('sittingHistory', {
            shouldFetchSessionHistory: true,
        });
    });

    it('Should able to navigate to previous screen on go back from Add offline sitting details form', () => {
        initialize();
        OfflineSittingDetailMachine.onGoBack();
        expect(setOfflineSittingDetailUIStateMock).toHaveBeenCalledWith(
            'ADD_OFFLINE_SITTING_DETAILS',
        );
        expect(OfflineSittingDetailMachine.getCurrentState().value).toEqual(
            'exited',
        );
        expect(OfflineSittingDetailMachine.isDone()).toBeTruthy();
        expect(actionsJumpMock).toBeCalledWith(undefined, undefined);
    });
});
