import React from 'react';
import { SittingDetailsScreenContainer, mapStateToProps } from './index';
import SittingDetailsScreen from './SittingDetailsScreen';
import * as SittingDetailsService from './index.service';
import { render, fireEvent, runAllPromises, findByProps } from 'app/utils/TestUtils';
import { OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS } from 'app/shared/Constants';
import OfflineSittingDetailService from '../../../services/meditation/OfflineSittingDetailService';
import * as ErrorHandlingUtils from '../../../utils/ErrorHandlingUtils';
import moment from 'moment';
import { Toast } from 'native-base';
import { Actions } from 'react-native-router-flux';
import { REGISTER } from '../../TrainersSectionScreen/TrainersSectionData';
import ServerReachabilityCheck from 'app/services/ServerReachabilityCheckService';
import { Alert } from 'react-native';

describe('SittingDetailsScreenContainer', () => {
    jest.useFakeTimers();
    const Component = props => {
        return render(<SittingDetailsScreenContainer {...props} />);
    };

    let getRecentSeekersListMock;
    let shouldAllowPreceptorToSearchSeekerMock;
    let searchSeekerMock;
    let searchSeekerUsingIDMock;
    let submitAddOfflineSittingDetailsFormMock;
    let determineNetworkConnectivityStatusMock;
    const resetFormMock = jest.fn();

    const setSessionDetailsMock = jest.fn();

    const tMock = jest.fn();
    const valueMock = {
        startTime: '10:00 AM',
        endTime: '10:30 AM',
        numberOfPeople: 1,
        comments: 'commentsMock',
        seekerList: [
            {
                isSelected: true,
                firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 1',
            },
        ],
        resetForm: resetFormMock,
    };

    const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => { });

    const updateAllowPreceptorToSearchSeekerMock = response => {
        shouldAllowPreceptorToSearchSeekerMock = jest
            .spyOn(SittingDetailsService, 'shouldAllowPreceptorToSearchSeeker')
            .mockImplementation(() => response);
    };

    const onShowSeekersSelectionMock = jest
        .spyOn(OfflineSittingDetailService, 'onShowSeekersSelection')
        .mockImplementation(() => { });

    const getRecentSeekersListResponse = response => {
        getRecentSeekersListMock = jest
            .spyOn(SittingDetailsService, 'getRecentSeekersList')
            .mockImplementation(() => response);
    };
    const searchSeekerResponse = response => {
        searchSeekerMock = jest
            .spyOn(SittingDetailsService, 'searchSeeker')
            .mockImplementation(() => response);
    };
    const searchSeekerUsingIDResponse = response => {
        searchSeekerUsingIDMock = jest
            .spyOn(SittingDetailsService, 'searchSeekerUsingID')
            .mockImplementation(() => response);
    };
    const submitAddOfflineSittingDetailsFormResponse = response => {
        submitAddOfflineSittingDetailsFormMock = jest
            .spyOn(SittingDetailsService, 'submitAddOfflineSittingDetailsForm')
            .mockImplementation(() => {
                return response;
            });
    };
    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const onAddingSeekersMock = jest
        .spyOn(OfflineSittingDetailService, 'onAddingSeekers')
        .mockImplementation(() => { });
    const onGoBackMock = jest
        .spyOn(OfflineSittingDetailService, 'onGoBack')
        .mockImplementation(() => { });
    const popMock = jest.spyOn(Actions, 'pop').mockImplementation(() => { });
    const dateMock = moment(1572393600000);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterAll(() => {
        dateNowSpy.mockRestore();
        onAddingSeekersMock.mockClear();
    });

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (shouldAllowPreceptorToSearchSeekerMock) {
            shouldAllowPreceptorToSearchSeekerMock.mockClear();
            shouldAllowPreceptorToSearchSeekerMock = undefined;
        }
        if (getRecentSeekersListMock) {
            getRecentSeekersListMock.mockClear();
            getRecentSeekersListMock = undefined;
        }
        if (searchSeekerMock) {
            searchSeekerMock.mockClear();
            searchSeekerMock = undefined;
        }
        if (searchSeekerUsingIDMock) {
            searchSeekerUsingIDMock.mockClear();
            searchSeekerUsingIDMock = undefined;
        }
        if (submitAddOfflineSittingDetailsFormMock) {
            submitAddOfflineSittingDetailsFormMock.mockClear();
            submitAddOfflineSittingDetailsFormMock = undefined;
        }
        if (resetFormMock) resetFormMock.mockClear();
        onShowSeekersSelectionMock.mockClear();
        toastMock.mockClear();
        onGoBackMock.mockClear();
        setSessionDetailsMock.mockClear();
        popMock.mockClear();
    });

    it('Should render a SittingDetailsScreen component', () => {
        const { container } = Component({ offlineSessionDetails: valueMock });
        expect(container.findByType(SittingDetailsScreen)).toBeDefined();
    });

    it('Should call onGoBack event, when back button is pressed', () => {
        const { container } = Component({ offlineSessionDetails: valueMock });
        fireEvent(container.findByType(SittingDetailsScreen), 'BackPress');
        expect(onGoBackMock).toHaveBeenCalled();
    });

    it('Should call onGoBack event, when Add Offline sitting detail back button is pressed', () => {
        const { container } = Component({ offlineSessionDetails: valueMock });
        fireEvent(container.findByType(SittingDetailsScreen), 'AddOfflineSittingDetailsBackPress');
        expect(onGoBackMock).toHaveBeenCalled();
    });

    it('Should not call onGoBack event, when Add offline sitting detail back button is pressed & track option is TRACK_NOW_COMPLETED', () => {
        const { container } = Component({
            offlineSessionDetails: valueMock,
            trackOptions:
                OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW_COMPLETED,
        });
        fireEvent(container.findByType(SittingDetailsScreen), 'AddOfflineSittingDetailsBackPress');
        expect(onGoBackMock).not.toHaveBeenCalled();
    });

    describe('#onShowSeekersSelectionMock', () => {
        it('Should able to navigate to Seekers Selection component, when add button from multi selection dropDown is pressed and preceptor can allow to search', () => {
            updateAllowPreceptorToSearchSeekerMock(true);
            const { container } = Component();
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownSeekerSelection');
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(onShowSeekersSelectionMock).toHaveBeenCalled();
        });

        it('Should not able to navigate to Seekers Selection component, when add button from multi selection dropDown is pressed and preceptor restricted to search', () => {
            updateAllowPreceptorToSearchSeekerMock(false);
            const { container } = Component({ t: tMock });
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownSeekerSelection');
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(onShowSeekersSelectionMock).not.toHaveBeenCalled();
            expect(toastMock).toHaveBeenCalled();
        });
    });
    it('Should able to display Seeker Barcode Scanned Result component, when barcode scanner is pressed', () => {
        const onShowSeekerBarcodeScannedResultMock = jest
            .spyOn(
                OfflineSittingDetailService,
                'onShowSeekerBarcodeScannedResult',
            )
            .mockImplementation(() => { });
        const { container } = Component({ offlineSessionDetails: valueMock });
        fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScannerPress');
        expect(onShowSeekerBarcodeScannedResultMock).toHaveBeenCalled();
    });
    it('Should able to go to Add offline sitting details when onSeekerSearchResultAddSeekerButtonPress is called', () => {
        const { container } = Component({
            setSessionDetails: setSessionDetailsMock,
        });
        fireEvent(container.findByType(SittingDetailsScreen), 'SeekerSearchResultAddSeekerButtonPress', [
            {
                name: 'A*****i',
                email: 'a*******2@mailinator.com',
                firebase_uid: 'I*****9',
                phoneNo: '9********2',
            },
        ]);

        expect(onAddingSeekersMock).toHaveBeenCalled();
        expect(findByProps(container, 'offlineSessionDetails', {
            seekerList: [
                {
                    email: 'a*******2@mailinator.com',
                    name: 'A*****i',
                    phoneNo: '9********2',
                    firebase_uid: 'I*****9',
                },
            ],
        })).toBeDefined();
        expect(onAddingSeekersMock).toHaveBeenCalledWith([
            {
                email: 'a*******2@mailinator.com',
                name: 'A*****i',
                phoneNo: '9********2',
                firebase_uid: 'I*****9',
            },
        ]);
    });

    it('Should able to go to trainers section webView screen when onSeekerSearchResultRegisterNewSeekerPress is called', () => {
        const trainersSectionWebViewScreenMock = jest.fn();
        Actions.trainersSectionWebViewScreen = trainersSectionWebViewScreenMock;
        const { container } = Component();
        fireEvent(container.findByType(SittingDetailsScreen), 'SeekerSearchResultRegisterNewSeekerPress');
        expect(trainersSectionWebViewScreenMock).toHaveBeenCalledWith({
            trainersSectionSelectedOption: REGISTER,
        });
    });

    describe('onSearchButtonPress', () => {
        const searchValuesMock = {
            name: {
                id: 'NAME',
                label: 'Name',
                searchText: 'Abhyasi',
            },
            abhyasiId: {
                id: 'ABHYASI_ID',
                label: 'Abhyasi ID',
                searchText: 'abhyasiIdMock',
            },
            phoneNo: {
                id: 'PHONE_NO',
                label: 'Phone No',
                searchText: '9876541230',
            },
            email: {
                id: 'EMAIL',
                label: 'Email',
                searchText: 'abhyasi.55@mailinator.com',
            },
            city: {
                id: 'CITY',
                label: 'City',
                searchText: 'Chennai',
            },
        };

        it('Should call searchSeeker when search button is pressed and set response to searchResult when response is valid and containerType to SEEKER_SEARCH_RESULT', () => {
            const onShowSeekerSearchResultMock = jest
                .spyOn(OfflineSittingDetailService, 'onShowSeekerSearchResult')
                .mockImplementation(() => { });
            const seekerSearchResultMock = [
                {
                    name: 'A*****i',
                    email: 'a*******2@mailinator.com',
                    firebase_uid: 'I*****9',
                    phoneNo: '9********2',
                },
            ];
            searchSeekerResponse(seekerSearchResultMock);
            updateAllowPreceptorToSearchSeekerMock(true);
            const { container } = Component({ offlineSessionDetails: valueMock });
            fireEvent(container.findByType(SittingDetailsScreen), 'SearchButtonPress', searchValuesMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(searchSeekerMock).toBeCalledWith(searchValuesMock, {
                offlineSessionDetails: valueMock,
            });
            expect(findByProps(container, 'searchResult', seekerSearchResultMock)).toBeDefined();
            expect(onShowSeekerSearchResultMock).toHaveBeenCalled();
        });

        it('Should call searchSeeker when search button is pressed and response is null and set containerType to SEEKER_SEARCH_RESULT',  () => {
            const onShowSeekerSearchResultMock = jest
                .spyOn(OfflineSittingDetailService, 'onShowSeekerSearchResult')
                .mockImplementation(() => { });
            searchSeekerResponse(null);
            updateAllowPreceptorToSearchSeekerMock(true);
            const { container } = Component({ offlineSessionDetails: valueMock });
            fireEvent(container.findByType(SittingDetailsScreen), 'SearchButtonPress', searchValuesMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(searchSeekerMock).toBeCalledWith(searchValuesMock, {
                offlineSessionDetails: valueMock,
            });
            expect(findByProps(container, 'searchResult', [])).toBeDefined();
            expect(onShowSeekerSearchResultMock).toHaveBeenCalled();
        });

        it('Should not call searchSeeker when precpetor is exceeded the search limit', () => {
            searchSeekerResponse(null);
            updateAllowPreceptorToSearchSeekerMock(false);
            const { container } = Component({ t: tMock });
            fireEvent(container.findByType(SittingDetailsScreen), 'SearchButtonPress', searchValuesMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(toastMock).toHaveBeenCalled();
        });
    });

    it('Should able to display Add offline sitting details, when onBarcodeScannedResultAddSeekerPress is called', () => {
        const { container } = Component({
            offlineSessionDetails: {
                seekerList: [
                    {
                        name: 'A*****j',
                        email: 'a*******1@mailinator.com',
                        firebase_uid: 'I*****8',
                        phoneNo: '9********1',
                    },
                ],
            },
        });
        const barcodeSearchedResultMock = {
                name: 'A*****i',
                email: 'a*******2@mailinator.com',
                firebase_uid: 'Fu33J2zJsdpFZQFtDFF3WgIAaAj9q5x1',
                phoneNo: '9********2',
                abhyasiId: 'INSABC689',
            };
        const abhyasiIdMock = 'INSABC689';
        searchSeekerUsingIDResponse(barcodeSearchedResultMock);
        updateAllowPreceptorToSearchSeekerMock(true);
        fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScanned', abhyasiIdMock);
        fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScannedResultAddSeekerPress');
        expect(onAddingSeekersMock).toHaveBeenCalledWith([{
            email: 'a*******1@mailinator.com',
            name: 'A*****j',
            phoneNo: '9********1',
            firebase_uid: 'I*****8',
        }]);
    });

    it('Should able to display Add offline sitting details, when onGoToSessionDetailsPress is called', () => {
        const onShowSessionDetailsMock = jest
            .spyOn(OfflineSittingDetailService, 'onShowSessionDetails')
            .mockImplementation(() => {});

        const { container } = Component({
            offlineSessionDetails: {
                seekerList: [
                    {
                        name: 'A*****j',
                        email: 'a*******1@mailinator.com',
                        firebase_uid: 'I*****8',
                        phoneNo: '9********1',
                    },
                ],
            },
        });
        fireEvent(container.findByType(SittingDetailsScreen), 'GoToSessionDetailsPress');
        expect(onShowSessionDetailsMock).toHaveBeenCalledWith([
            {
                name: 'A*****j',
                email: 'a*******1@mailinator.com',
                firebase_uid: 'I*****8',
                phoneNo: '9********1',
            },
        ]);
    });
    it('Should able to display Selected Seekers component when onSelectedSeekersPress is called', () => {
        const onShowSelectedSeekersMock = jest
            .spyOn(OfflineSittingDetailService, 'onShowSelectedSeekers')
            .mockImplementation(() => {});
        const { container } = Component({ offlineSessionDetails: valueMock });
        fireEvent(container.findByType(SittingDetailsScreen), 'SelectedSeekersPress');
        expect(onShowSelectedSeekersMock).toHaveBeenCalled();
    });
    it('Should able to show alert when onBarcodeScannerInfoPress is called', () => {
        const alertMock = jest
            .spyOn(Alert, 'alert')
            .mockImplementation(() => {});
        const { container } = Component({
            offlineSessionDetails: valueMock,
            t: jest.fn(),
        });
        fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScannerInfoPress');
        runAllPromises();
        jest.runOnlyPendingTimers();
        expect(alertMock).toHaveBeenCalled();
    });

    describe('#onMultiSelectionDropDownRecentSeekerSelected', () => {
        it('Should set selectedSeekers when recentSelectedSeekers and recentSeekersList are same', () => {
            const offlineSessionDetailsValuesMock = {
                startTime: '10:00 AM',
                endTime: '10:30 AM',
                numberOfPeople: 1,
                comments: 'commentsMock',
                seekerList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                    },
                ],
                resetForm: resetFormMock,
            };
            const { container } = Component({
                trackOptions:
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
                setSessionDetails: setSessionDetailsMock,
                recentSeekersList: [
                    {
                        isSelected: false,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
                offlineSessionDetails: offlineSessionDetailsValuesMock,
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownRecentSeekerSelected', {
                isSelected: false,
                firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 2',
                email: 'abhyasi.60@mailinator.com',
            });
            expect(findByProps(container, 'recentSeekersList', [
                {
                    isSelected: true,
                    firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ])).toBeDefined();
            expect(findByProps(container, 'offlineSessionDetails', {
                ...valueMock,
                seekerList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                    },
                    {
                        isSelected: false,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
            })).toBeDefined();
        });
        it('Should set selectedSeekers when recentSelectedSeekers and recentSeekersList are different', () => {
            const { container } = Component({
                trackOptions:
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
                setSessionDetails: setSessionDetailsMock,
                t: tMock,
                recentSeekersList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            isSelected: true,
                            firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                            name: 'Abhyasi 1',
                            email: 'abhyasi.55@mailinator.com',
                        },
                        {
                            isSelected: true,
                            firebase_uid: 'au44K2zJpFZ8INM92D3WgIAaAj9hau8',
                            name: 'Abhyasi 3',
                            email: 'abhyasi.70@mailinator.com',
                        },
                        {
                            isSelected: true,
                            firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                            name: 'Abhyasi 2',
                            email: 'abhyasi.60@mailinator.com',
                        },
                    ],
                    resetForm: resetFormMock,
                },
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownRecentSeekerSelected', {
                isSelected: false,
                firebase_uid: 'Fu33J2zJpFZQFtD3WjjgIAaAj9q5x1',
                name: 'Abhyasi 10',
                email: 'abhyasi.55@mailinator.com',
            });

            expect(findByProps(container, 'recentSeekersList', [
                {
                    isSelected: true,
                    firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ])).toBeDefined();
        });
        it('Should set selectedSeekers when selected item from recent seekers is already present in selectedSeekers list', () => {
            const { container } = Component({
                trackOptions:
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
                setSessionDetails: setSessionDetailsMock,
                t: tMock,
                selectedSeekers: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu44KGG2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 4',
                        email: 'abhyasi.64@mailinator.com',
                    },
                ],
                recentSeekersList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            isSelected: true,
                            firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                            name: 'Abhyasi 1',
                            email: 'abhyasi.55@mailinator.com',
                        },
                        {
                            isSelected: true,
                            firebase_uid: 'au44K2zJpFZ8INM92D3WgIAaAj9hau8',
                            name: 'Abhyasi 3',
                            email: 'abhyasi.70@mailinator.com',
                        },
                        {
                            isSelected: true,
                            firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                            name: 'Abhyasi 2',
                            email: 'abhyasi.60@mailinator.com',
                        },
                    ],
                    resetForm: resetFormMock,
                },
            });
            fireEvent(container.findByType(SittingDetailsScreen),'MultiSelectionDropDownRecentSeekerSelected', {
                isSelected: true,
                firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 2',
                email: 'abhyasi.60@mailinator.com',
            });
            expect(findByProps(container, 'recentSeekersList', [
                {
                    isSelected: false,
                    firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ])).toBeDefined();
            expect(findByProps(container, 'offlineSessionDetails', {
                ...valueMock,
                seekerList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                        email: 'abhyasi.55@mailinator.com',
                    },
                    {
                        isSelected: true,
                        firebase_uid: 'au44K2zJpFZ8INM92D3WgIAaAj9hau8',
                        name: 'Abhyasi 3',
                        email: 'abhyasi.70@mailinator.com',
                    },
                ],
            })).toBeDefined();
        });

        it('Should not set selected seekers when seeker is already present in selected seekers list and is not selected before from dropdown', () => {
            const { container } = Component({
                trackOptions:
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
                setSessionDetails: setSessionDetailsMock,
                t: tMock,
                selectedSeekers: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
                recentSeekersList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            isSelected: true,
                            firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                            name: 'Abhyasi 1',
                            email: 'abhyasi.55@mailinator.com',
                        },
                        {
                            isSelected: true,
                            firebase_uid: 'au44K2zJpFZ8INM92D3WgIAaAj9hau8',
                            name: 'Abhyasi 3',
                            email: 'abhyasi.70@mailinator.com',
                        },
                        {
                            isSelected: true,
                            firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                            name: 'Abhyasi 2',
                            email: 'abhyasi.60@mailinator.com',
                        },
                    ],
                    resetForm: resetFormMock,
                },
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownRecentSeekerSelected', {
                isSelected: false,
                firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 2',
                email: 'abhyasi.60@mailinator.com',
            });
            expect(findByProps(container, 'recentSeekersList', [
                {
                    isSelected: true,
                    firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ])).toBeDefined();
            expect(findByProps(container, 'offlineSessionDetails', {
                ...valueMock,
                seekerList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                        email: 'abhyasi.55@mailinator.com',
                    },
                    {
                        isSelected: true,
                        firebase_uid: 'au44K2zJpFZ8INM92D3WgIAaAj9hau8',
                        name: 'Abhyasi 3',
                        email: 'abhyasi.70@mailinator.com',
                    },
                    {
                        isSelected: true,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
            })).toBeDefined();
        });
    });

    describe('#onMultiSelectionDropDownRecentSeekerRemoved', () => {
        it('Should set selectedSeekers and recentSeekersList when onMultiSelectionDropDownRecentSeekerRemoved is called', () => {
            const offlineSessionDetailsValuesMock = {
                startTime: '10:00 AM',
                endTime: '10:30 AM',
                numberOfPeople: 1,
                comments: 'commentsMock',
                seekerList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                    },
                ],
                resetForm: resetFormMock,
            };
            const recentSeekersListMock = [
                {
                    isSelected: false,
                    firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 1',
                    email: 'abhyasi.55@mailinator.com',
                },
                {
                    isSelected: false,
                    firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ];
            
            getRecentSeekersListResponse(recentSeekersListMock);
    
            const { container } = Component({
                trackOptions:
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
                setSessionDetails: setSessionDetailsMock,
                recentSeekersList: [
                    {
                        isSelected: false,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                    {
                        isSelected: false,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                        email: 'abhyasi.55@mailinator.com',
                    },
                ],
                offlineSessionDetails: offlineSessionDetailsValuesMock,
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownRecentSeekerSelected', {
                isSelected: false,
                firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 2',
                email: 'abhyasi.60@mailinator.com',
            });
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(findByProps(container, 'recentSeekersList', [
                {
                    isSelected: true,
                    firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ])).toBeDefined();
            expect(findByProps(container, 'offlineSessionDetails', {
                ...valueMock,
                seekerList: [
                    {
                        isSelected: true,
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 1',
                    },
                    {
                        isSelected: false,
                        firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                        name: 'Abhyasi 2',
                        email: 'abhyasi.60@mailinator.com',
                    },
                ],
            })).toBeDefined();
            fireEvent(container.findByType(SittingDetailsScreen), 'MultiSelectionDropDownRecentSeekerRemoved',
            {
                isSelected: false,
                firebase_uid: 'Fu44K2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 2',
                email: 'abhyasi.60@mailinator.com',
            },
                0,
            );
    
            expect(findByProps(container, 'recentSeekersList', [
                {
                    isSelected: false,
                    firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 1',
                    email: 'abhyasi.55@mailinator.com',
                },
                {
                    isSelected: false,
                    firebase_uid: 'YAUX3OIA79FZQFtD3WgIAaAJ90AN7',
                    name: 'Abhyasi 2',
                    email: 'abhyasi.60@mailinator.com',
                },
            ])).toBeDefined();
        });
    });
    

    it('Should set offlineSessionDetails when onChangeAddOfflineFormValues is called', () => {
        const formValuesMock = {
            startTime: '10:00 AM',
            endTime: '10:30 AM',
            numberOfPeople: 1,
            comments: 'commentsMock',
            seekerList: [
                {
                    isSelected: true,
                    firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    name: 'Abhyasi 1',
                },
            ],
        };
        const { container } = Component({
            offlineSessionDetails: formValuesMock,
        });
        fireEvent(container.findByType(SittingDetailsScreen), 'ChangeAddOfflineFormValues', formValuesMock);
        expect(findByProps(container, 'offlineSessionDetails', formValuesMock)).toBeDefined();
    });

    it('Should check trackOptions value  and set the initial value of isTrackNowSession prop based on that', () => {
        const { container } = Component({
            trackOptions: OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
            offlineSessionDetails: valueMock,
        });
        expect(container.findByType(SittingDetailsScreen)).toHaveProp('isTrackNowSession', true);
    });

    it('Should able to set the initial value of isDatePickerDisable prop when trackOptions is TRACK_PAST', () => {
        const { container } = Component({
            trackOptions: OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
            offlineSessionDetails: valueMock,
        });
        expect(container.findByType(SittingDetailsScreen)).toHaveProp('isDatePickerDisable', false);
    });
    it('Should able to set the initial value of isDatePickerDisable prop when trackOptions is TRACK_NOW_COMPLETED or TRACK_NOW', () => {
        const { container } = Component({
            trackOptions: OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
            offlineSessionDetails: valueMock,
        });

        expect(container.findByType(SittingDetailsScreen)).toHaveProp('isDatePickerDisable', true);
    });
    describe('#componentDidMount', () => {
        it('Should able to call getRecentSeekersList' , () => {
            const recentSeekersListMock = [
                {
                    firebase_uid: 'firebaseIdMock',
                    name: 'Abhyasi 1',
                    isSelected: false,
                },
            ];
            getRecentSeekersListResponse(recentSeekersListMock);

            const { container } = Component({ offlineSessionDetails: valueMock });

            expect(getRecentSeekersListMock).toBeCalled();
            expect(findByProps(container, 'recentSeekersList', recentSeekersListMock)).toBeDefined();
        });
    });
    describe('#getDerivedStateFromProps', () => {
        it('Should able to get offlineSessionDetails and set to offlineSessionDetails', () => {
            const offlineSessionDetailsMock = {
                startTime: '10:00 AM',
                endTime: '10:30 AM',
                numberOfPeople: 1,
                comments: 'commentsMock',
            };

            const { container } = Component({
                offlineSessionDetails: offlineSessionDetailsMock,
            });

            expect(findByProps(container, 'offlineSessionDetails', offlineSessionDetailsMock)).toBeDefined();
        });
    });

    it('Should able be to set isStartTimeAndEndTimeDisabled prop  when trackOptions is TRACK_NOW and offlinePreceptorMeditationUiState is MEDITATION_YET_TO_START', () => {
        const { container } = Component({
            offlinePreceptorMeditationUiState: 'MEDITATION_YET_TO_START',
            trackOptions: OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
        });
        expect(container.findByType(SittingDetailsScreen)).toHaveProp('isStartTimeAndEndTimeDisabled', true);
    });
    describe('onBarcodeScanned', () => {
        const abhyasiIdMock = 'abhyasiIdMock';

        it('Should call searchSeekerUsingID when seeker id is scanned and set response to barcodeSearchedResult when barcodeSearchedResult is empty', () => {
            const barcodeSearchedResultMock = [
                {
                    name: 'A*****i',
                    email: 'a*******2@mailinator.com',
                    firebase_uid: 'Fu33J2zJsdpFZQFtDFF3WgIAaAj9q5x1',
                    phoneNo: '9********2',
                    abhyasiId: 'INSABC689',
                },
            ];
            searchSeekerUsingIDResponse(barcodeSearchedResultMock);
            updateAllowPreceptorToSearchSeekerMock(true);
            const { container } = Component({
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            name: 'A*****i',
                            email: 'a*******7@mailinator.com',
                            firebase_uid: 'Fu33J2zJpFZQFtDFF3WgIAaAj9q5x1',
                            phoneNo: '9********2',
                            abhyasiId: 'INSABN689',
                        },
                    ],
                    resetForm: resetFormMock,
                },
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScanned', abhyasiIdMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(searchSeekerUsingIDMock).toBeCalledWith(abhyasiIdMock, {
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            name: 'A*****i',
                            email: 'a*******7@mailinator.com',
                            firebase_uid: 'Fu33J2zJpFZQFtDFF3WgIAaAj9q5x1',
                            phoneNo: '9********2',
                            abhyasiId: 'INSABN689',
                        },
                    ],
                    resetForm: resetFormMock,
                },
            });
            expect(findByProps(container, 'barcodeSearchedResult', barcodeSearchedResultMock)).toBeDefined();
        });
        it('Should call searchSeekerUsingID when seeker id is scanned and set response to barcodeSearchedResult when scanned seeker is already selected', () => {
            const barcodeSearchedResultMock = [
                {
                    name: 'A*****i',
                    email: 'a*******2@mailinator.com',
                    firebase_uid: 'Fu33J2zJsdpFZQFtDFF3WgIAaAj9q5x1',
                    phoneNo: '9********2',
                    abhyasiId: 'INSABC689',
                },
            ];
            searchSeekerUsingIDResponse(barcodeSearchedResultMock);
            updateAllowPreceptorToSearchSeekerMock(true);
            const { container } = Component({
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            name: 'A*****i',
                            email: 'a*******2@mailinator.com',
                            firebase_uid: 'Fu33J2zJsdpFZQFtDFF3WgIAaAj9q5x1',
                            phoneNo: '9********2',
                            abhyasiId: 'INSABC689',
                        },
                    ],
                    resetForm: resetFormMock,
                },
                t: tMock,
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScanned', abhyasiIdMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(searchSeekerUsingIDMock).toBeCalledWith(abhyasiIdMock, {
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            name: 'A*****i',
                            email: 'a*******2@mailinator.com',
                            firebase_uid: 'Fu33J2zJsdpFZQFtDFF3WgIAaAj9q5x1',
                            phoneNo: '9********2',
                            abhyasiId: 'INSABC689',
                        },
                    ],
                    resetForm: resetFormMock,
                },
                t: tMock,
            });
            expect(tMock).toBeCalledWith(
                'seekerSearchResult:seekerAlreadySelected',
            );
            expect(toastMock).toBeCalled();
        });
        it('Should not able to search, when preceptor exceeded the search limit', () => {
            updateAllowPreceptorToSearchSeekerMock(false);
            const { container } = Component({
                offlineSessionDetails: {
                    startTime: '10:00 AM',
                    endTime: '10:30 AM',
                    numberOfPeople: 1,
                    comments: 'commentsMock',
                    seekerList: [
                        {
                            name: 'A*****i',
                            email: 'a*******7@mailinator.com',
                            firebase_uid: 'Fu33J2zJpFZQFtDFF3WgIAaAj9q5x1',
                            phoneNo: '9********2',
                            abhyasiId: 'INSABN689',
                        },
                    ],
                    resetForm: resetFormMock,
                }, t: tMock
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScanned', '1111');
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(tMock).toBeCalledWith(
                'seekerBarcodeScannedResult:preceptorAbnormalSearchBlockMessage',
            );
            expect(toastMock).toBeCalled();
        });

        it('Should call searchSeekerUsingID when seeker id is scanned and set response to barcodeSearchedResult when barcodeSearchedResult already has same abhyasiId',  () => {
            const barcodeSearchedResultMock = [
                {
                    name: 'A*****i',
                    email: 'a*******2@mailinator.com',
                    firebase_uid: 'I*****9',
                    phoneNo: '9********2',
                    abhyasiId: 'INSABC689',
                },
            ];
            searchSeekerUsingIDResponse(barcodeSearchedResultMock);
            updateAllowPreceptorToSearchSeekerMock(true);

            const { container } = Component({
                t: tMock,
                offlineSessionDetails: valueMock,
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScanned', 'INSABC689');
            fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScannedResultAddSeekerPress');
            fireEvent(container.findByType(SittingDetailsScreen), 'BarcodeScanned', 'INSABC689');
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(searchSeekerUsingIDMock).toBeCalledWith('INSABC689', {
                t: tMock,
                offlineSessionDetails: valueMock,
            });
            expect(toastMock).toBeCalled();
        });
    });

    describe('onSubmitOfflineSittingForm', () => {
        it('Should call submitAddOfflineSittingDetailsForm when trackOptions is "TRACK_PAST" and response is null,', () => {
            submitAddOfflineSittingDetailsFormResponse(null);
            const props = {
                setSessionDetails: setSessionDetailsMock,
                trackOptions: 'TRACK_PAST',
                t: tMock,
                offlineSessionDetails: valueMock
            };
            const { container } = Component(props);
            fireEvent(container.findByType(SittingDetailsScreen), 'SubmitOfflineSittingForm', valueMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(submitAddOfflineSittingDetailsFormMock).toBeCalledWith(
                valueMock,
                props,
            );
            expect(resetFormMock).toBeCalled();
        });

        it('Should call submitAddOfflineSittingDetailsForm and show toast, when trackOptions is "TRACK_PAST" and response has some error,', () => {
            const props = {
                trackOptions: 'TRACK_PAST',
                t: tMock,
                offlineSessionDetails: valueMock
            };
            const errorHandlingUtilsOnErrorMock = jest
                .spyOn(ErrorHandlingUtils, 'onError')
                .mockImplementation(() => { });
            updateDetermineNetworkConnectivityStatus(true);
            submitAddOfflineSittingDetailsFormResponse('errorMock');

            const { container } = Component(props);
            fireEvent(container.findByType(SittingDetailsScreen), 'SubmitOfflineSittingForm', valueMock);
            runAllPromises();
            jest.runOnlyPendingTimers();
            expect(submitAddOfflineSittingDetailsFormMock).toBeCalledWith(
                valueMock,
                props,
            );
            expect(resetFormMock).not.toBeCalled();
            expect(errorHandlingUtilsOnErrorMock).toBeCalledWith(
                'errorMock',
                'SDS-SAOSDF',
            );
        });
        it('Should able to save session details, navigate to previous screen and should not call resetForm, when save button is pressed and trackOptions is "TRACK_NOW",', () => {
            const valuesMock = {
                date: '21/01/2022',
                startTime: '11:00 AM',
                endTime: '11:23 AM',
                duration: '23:00',
                numberOfPeople: 2,
                seekerList: [
                    {
                        isSelected: true,
                        name: 'Abhyasi 1',
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    },
                ],
                comments: 'commentsMock',
            };
            const { container } = Component({
                offlineSessionDetails: valuesMock,
                trackOptions:
                    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
                setSessionDetails: setSessionDetailsMock,
            });
            fireEvent(container.findByType(SittingDetailsScreen), 'SubmitOfflineSittingForm', valuesMock);
            expect(resetFormMock).not.toBeCalled();
            expect(popMock).toBeCalled();
        });
    });
    it('Should able to map redux state to props', () => {
        expect(
            mapStateToProps({
                offlineSittingDetail: {
                    uiState: 'ADD_OFFLINE_SITTING_DETAILS',
                    offlineSessionDetails: {
                        date: '21/01/2022',
                        startTime: '11:00 AM',
                        endTime: '11:23 AM',
                        duration: '23:00',
                        numberOfPeople: 2,
                        seekerList: [
                            {
                                isSelected: true,
                                name: 'Abhyasi 1',
                                firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                            },
                        ],
                        comments: 'commentsMock',
                    },
                },
                offlinePreceptorMeditationSession: {
                    uiState: 'MEDITATION_YET_TO_START',
                    trackOptions: 'TRACK_NOW',
                },
            }),
        ).toEqual({
            uiState: 'ADD_OFFLINE_SITTING_DETAILS',
            trackOptions: 'TRACK_NOW',
            offlinePreceptorMeditationUiState: 'MEDITATION_YET_TO_START',
            offlineSessionDetails: {
                date: '21/01/2022',
                startTime: '11:00 AM',
                endTime: '11:23 AM',
                duration: '23:00',
                numberOfPeople: 2,
                seekerList: [
                    {
                        isSelected: true,
                        name: 'Abhyasi 1',
                        firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    },
                ],
                comments: 'commentsMock',
            },
        });
    });
});
