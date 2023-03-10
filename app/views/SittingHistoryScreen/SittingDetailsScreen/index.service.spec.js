import moment from 'moment';
import {
    getRecentSeekersList,
    searchSeeker,
    searchSeekerUsingID,
    submitAddOfflineSittingDetailsForm,
    setSeekerListInSessionDetails,
    shouldAllowPreceptorToSearchSeeker,
} from './index.service';
import ServerReachabilityCheck from '../../../services/ServerReachabilityCheckService';
import * as MeditationService from '../../../services/grpc/MeditationService';
import * as MySRCMService from '../../../services/MySRCMService';
import StorageService from '../../../services/native/AppStorageService';
import { spyOnProperty } from 'app/utils/TestUtils';
import OfflineSittingDetailService from '../../../services/meditation/OfflineSittingDetailService';

import * as RemoteConfigService from '../../../services/firebase/RemoteConfigService';
import MeditationSessionCountService from '../../../services/meditation/MeditationSessionCountService';
import PreceptorStatusUpdateService from '../../../services/meditation/PreceptorStatusUpdateService';
import { OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS } from '../../../shared/Constants';

describe('SittingDetailsScreenService', () => {
    let determineNetworkConnectivityStatusMock;
    let getSeekersToWhomSittingIsGivenWithoutUsingAppMock;
    let saveSittingsGivenWithoutUsingAppMock;
    let searchAbhyasisMock;
    let preceptorSearchedSeekerDatesGetMock;
    const preceptorSearchedSeekerDatesSetMock = jest.fn();
    const setBusyMock = jest.fn();

    const pageTokenMock = 0;
    const pageSizeMock = 10;
    const searchSeekerParamsMock = {
        name: {
            searchText: 'Abhyasi',
        },
        abhyasiId: {
            searchText: 'abhyasiIdMock',
        },
        phoneNo: {
            searchText: '+919876541230',
        },
        email: {
            searchText: 'abhyasi.55@mailinator.com',
        },
        city: {
            searchText: { id: 876, name: 'CityNameMock' },
        },
    };
    const submitOfflineSittingFormParamsMock = {
        date: '2022-02-23T15:39:06.333Z',
        startTime: '2022-02-23T15:39:06.333Z',
        endTime: '2022-02-23T16:10:06.333Z',
        numberOfPeople: 1,
        seekerList: [
            {
                isSelected: true,
                firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                name: 'Abhyasi 1',
            },
        ],
        comments: 'commentsMock',
    };

    const seekerInfoMock = [
        { seekerId: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1', seekerName: 'Abhyasi 1' },
    ];
    const updateCountOfSittingsGivenOutsideHeartsAppMock = jest
        .spyOn(
            MeditationSessionCountService,
            'updateCountOfSittingsGivenOutsideHeartsApp',
        )
        .mockImplementation(() => {});

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
    const getSeekersToWhomSittingIsGivenWithoutUsingAppResponse = response => {
        getSeekersToWhomSittingIsGivenWithoutUsingAppMock = jest
            .spyOn(
                MeditationService,
                'getSeekersToWhomSittingIsGivenWithoutUsingApp',
            )
            .mockImplementation(() => {
                return response;
            });
    };
    const saveSittingsGivenWithoutUsingAppResponse = response => {
        saveSittingsGivenWithoutUsingAppMock = jest
            .spyOn(MeditationService, 'saveSittingsGivenWithoutUsingApp')
            .mockImplementation(() => {
                return response;
            });
    };
    const preceptorStatusUpdateServiceOnlineStatusChangeMock = jest
        .spyOn(PreceptorStatusUpdateService, 'onlineStatusChange')
        .mockImplementation(() => {});

    const updatePreceptorSearchedSeekerDates = value => {
        preceptorSearchedSeekerDatesGetMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(StorageService, 'preceptorSearchedSeekerDates', {
            getValue: preceptorSearchedSeekerDatesGetMock,
            setValue: preceptorSearchedSeekerDatesSetMock,
        });
    };
    const getOfflineSeekerSearchLimitMock = jest
        .spyOn(RemoteConfigService, 'getOfflineSeekerSearchLimit')
        .mockImplementation(() => 5);

    const dateMock = moment.unix(1645784314);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (getSeekersToWhomSittingIsGivenWithoutUsingAppMock) {
            getSeekersToWhomSittingIsGivenWithoutUsingAppMock.mockClear();
            getSeekersToWhomSittingIsGivenWithoutUsingAppMock = undefined;
        }
        if (saveSittingsGivenWithoutUsingAppMock) {
            saveSittingsGivenWithoutUsingAppMock.mockClear();
            saveSittingsGivenWithoutUsingAppMock = undefined;
        }
        if (searchAbhyasisMock) {
            searchAbhyasisMock.mockClear();
            searchAbhyasisMock = undefined;
        }
        if (preceptorSearchedSeekerDatesGetMock) {
            preceptorSearchedSeekerDatesGetMock.mockClear();
            preceptorSearchedSeekerDatesGetMock = undefined;
        }
        if (dateNowSpy) {
            dateNowSpy.mockClear();
            dateNowSpy = undefined;
        }
        if (setBusyMock) setBusyMock.mockClear();
        preceptorStatusUpdateServiceOnlineStatusChangeMock.mockClear();
        updateCountOfSittingsGivenOutsideHeartsAppMock.mockClear();
        getOfflineSeekerSearchLimitMock.mockClear();
        preceptorSearchedSeekerDatesSetMock.mockClear();
    });

    describe('#getRecentSeekersList ', () => {
        it('should call getSeekersToWhomSittingIsGivenWithoutUsingApp when internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);

            const responseMock = {
                seekerInfo: [
                    {
                        seekerId: 'seekerIdMock',
                        seekerName: 'seekerNameMock',
                        email: 'seeker.55@mailinator.com',
                    },
                ],
                previousPageToken: 0,
                nextPageToken: 0,
            };
            getSeekersToWhomSittingIsGivenWithoutUsingAppResponse(responseMock);

            const returnValue = await getRecentSeekersList();

            expect(
                getSeekersToWhomSittingIsGivenWithoutUsingAppMock,
            ).toBeCalledWith(pageTokenMock, pageSizeMock);
            expect(returnValue).toEqual([
                {
                    firebase_uid: 'seekerIdMock',
                    name: 'seekerNameMock',
                    email: 'seeker.55@mailinator.com',
                    isSelected: false,
                },
            ]);
        });

        it('should not call getSeekersToWhomSittingIsGivenWithoutUsingApp when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            getSeekersToWhomSittingIsGivenWithoutUsingAppResponse();

            await getRecentSeekersList();

            expect(
                getSeekersToWhomSittingIsGivenWithoutUsingAppMock,
            ).not.toBeCalled();
        });

        it('should call getSeekersToWhomSittingIsGivenWithoutUsingApp and some error is thrown by meditation service call', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSeekersToWhomSittingIsGivenWithoutUsingAppResponse(
                Promise.reject({ message: 'mockError' }),
            );

            const returnValue = await getRecentSeekersList();
            expect(
                getSeekersToWhomSittingIsGivenWithoutUsingAppMock,
            ).toBeCalledWith(pageTokenMock, pageSizeMock);
            expect(returnValue).toEqual('mockError');
        });
    });

    describe('#submitAddOfflineSittingDetailsForm ', () => {
        const clearOfflinePreceptorMeditationDetailsMock = jest.fn();
        const clearOfflineSittingDetailsMock = jest.fn();
        it('Should call saveSittingsGivenWithoutUsingApp when internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            saveSittingsGivenWithoutUsingAppResponse(true);

            const onSubmitMock = jest
                .spyOn(OfflineSittingDetailService, 'onSubmit')
                .mockImplementation(() => {});
            const returnValue = await submitAddOfflineSittingDetailsForm(
                submitOfflineSittingFormParamsMock,
                {
                    setBusy: setBusyMock,
                    clearOfflinePreceptorMeditationDetails: clearOfflinePreceptorMeditationDetailsMock,
                    clearOfflineSittingDetails: clearOfflineSittingDetailsMock,
                    trackOptions:
                        OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
                },
            );

            expect(saveSittingsGivenWithoutUsingAppMock).toBeCalledWith(
                1645630746,
                1645632606,
                submitOfflineSittingFormParamsMock.numberOfPeople,
                seekerInfoMock,
                submitOfflineSittingFormParamsMock.comments,
            );
            expect(
                updateCountOfSittingsGivenOutsideHeartsAppMock,
            ).toHaveBeenCalled();

            expect(clearOfflineSittingDetailsMock).toBeCalled();
            expect(clearOfflinePreceptorMeditationDetailsMock).toBeCalled();
            expect(onSubmitMock).toHaveBeenCalledWith({
                shouldFetchSessionHistory: true,
            });
            expect(returnValue).toEqual(null);
        });
        it('Should call saveSittingsGivenWithoutUsingApp when track option is "TRACK_NOW_COMPLETED"', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            saveSittingsGivenWithoutUsingAppResponse(true);
            const onSubmitMock = jest
                .spyOn(OfflineSittingDetailService, 'onSubmit')
                .mockImplementation(() => {});
            const returnValue = await submitAddOfflineSittingDetailsForm(
                submitOfflineSittingFormParamsMock,
                {
                    setBusy: setBusyMock,
                    trackOptions: 'TRACK_NOW_COMPLETED',
                    preceptorAvailability: true,
                    clearOfflinePreceptorMeditationDetails: clearOfflinePreceptorMeditationDetailsMock,
                    clearOfflineSittingDetails: clearOfflineSittingDetailsMock,
                },
            );

            expect(saveSittingsGivenWithoutUsingAppMock).toBeCalledWith(
                1645630746,
                1645632606,
                1,
                seekerInfoMock,
                'commentsMock',
            );
            expect(
                updateCountOfSittingsGivenOutsideHeartsAppMock,
            ).toHaveBeenCalled();
            expect(
                preceptorStatusUpdateServiceOnlineStatusChangeMock,
            ).toHaveBeenCalledWith(true);
            expect(clearOfflineSittingDetailsMock).toBeCalled();
            expect(clearOfflinePreceptorMeditationDetailsMock).toBeCalled();
            expect(onSubmitMock).toHaveBeenCalledWith({
                shouldFetchSessionHistory: false,
            });
            expect(returnValue).toEqual(null);
        });
        it('Should not call saveSittingsGivenWithoutUsingApp when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            saveSittingsGivenWithoutUsingAppResponse();

            const returnValue = await submitAddOfflineSittingDetailsForm(
                submitOfflineSittingFormParamsMock,
                { setBusy: setBusyMock },
            );

            expect(saveSittingsGivenWithoutUsingAppMock).not.toBeCalled();
            expect(returnValue).toEqual(null);
        });

        it('Should call saveSittingsGivenWithoutUsingApp and some error is thrown by meditation service call', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            saveSittingsGivenWithoutUsingAppResponse(
                Promise.reject({ message: 'mockError' }),
            );

            const returnValue = await submitAddOfflineSittingDetailsForm(
                submitOfflineSittingFormParamsMock,
                { setBusy: setBusyMock },
            );

            expect(saveSittingsGivenWithoutUsingAppMock).toBeCalledWith(
                1645630746,
                1645632606,
                1,
                seekerInfoMock,
                'commentsMock',
            );
            expect(returnValue).toEqual('mockError');
        });

        it('should call saveSittingsGivenWithoutUsingApp and some error is thrown by meditation service call does not have error message', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            saveSittingsGivenWithoutUsingAppResponse(
                Promise.reject({ message: null }),
            );

            const returnValue = await submitAddOfflineSittingDetailsForm(
                submitOfflineSittingFormParamsMock,
                { setBusy: setBusyMock },
            );

            expect(saveSittingsGivenWithoutUsingAppMock).toBeCalledWith(
                1645630746,
                1645632606,
                1,
                seekerInfoMock,
                'commentsMock',
            );
            expect(returnValue).toEqual(undefined);
        });
    });

    describe('#searchSeeker ', () => {
        const prepare = (internet, response) => {
            searchAbhyasisMock = jest
                .spyOn(MySRCMService, 'searchAbhyasis')
                .mockImplementation(() => response);
            updateDetermineNetworkConnectivityStatus(internet);
        };

        it('Should be able to make api call when internet is available', async () => {
            prepare(
                true,
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            results: [
                                {
                                    email: 'a*******2@mailinator.com',
                                    mobile: '9********2',
                                    name: 'A*****i',
                                    ref: 'I*****9',
                                    firebase_uid:
                                        'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                                },
                            ],
                        }),
                }),
            );
            updatePreceptorSearchedSeekerDates([1640421752]);

            const returnValue = await searchSeeker(searchSeekerParamsMock, {
                setBusy: setBusyMock,
            });

            expect(searchAbhyasisMock).toBeCalledWith(
                {
                    city_id: 876,
                    email: 'abhyasi.55@mailinator.com',
                    name: 'Abhyasi',
                    ref: 'ABHYASIIDMOCK',
                },
                '+919876541230',
            );
            expect(returnValue).toEqual([
                {
                    email: 'a*******2@mailinator.com',
                    name: 'A*****i',
                    phoneNo: '9********2',
                    seekerId: 'I*****9',
                    firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    isSelected: false,
                },
            ]);
        });

        it('Should able to update preceptor search date', async () => {
            prepare(
                true,
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            results: [
                                {
                                    email: 'a*******2@mailinator.com',
                                    mobile: '9********2',
                                    name: 'A*****i',
                                    ref: 'I*****9',
                                    firebase_uid:
                                        'mysrcm-Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                                },
                            ],
                        }),
                }),
            );
            updatePreceptorSearchedSeekerDates();

            const returnValue = await searchSeeker(searchSeekerParamsMock, {
                setBusy: setBusyMock,
            });
            expect(preceptorSearchedSeekerDatesSetMock).toBeCalled();
            expect(returnValue).toEqual([
                {
                    email: 'a*******2@mailinator.com',
                    name: 'A*****i',
                    phoneNo: '9********2',
                    seekerId: 'I*****9',
                    firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                    isSelected: false,
                },
            ]);
        });

        it('Should not be able to make api call when internet is not available', async () => {
            prepare(false);

            const returnValue = await searchSeeker(searchSeekerParamsMock, {
                setBusy: setBusyMock,
            });

            expect(searchAbhyasisMock).not.toBeCalled();
            expect(returnValue).toEqual(undefined);
        });

        it('Should be able to make api call and some error is thrown', async () => {
            prepare(true, Promise.reject({ message: 'mockError' }));
            const returnValue = await searchSeeker(searchSeekerParamsMock, {
                setBusy: setBusyMock,
            });

            expect(searchAbhyasisMock).toBeCalledWith(
                {
                    city_id: 876,
                    email: 'abhyasi.55@mailinator.com',
                    name: 'Abhyasi',
                    ref: 'ABHYASIIDMOCK',
                },
                '+919876541230',
            );
            expect(returnValue).toEqual(null);
        });
    });

    describe('#searchSeekerUsingID ', () => {
        const prepare = (internet, response) => {
            searchAbhyasisMock = jest
                .spyOn(MySRCMService, 'searchAbhyasis')
                .mockImplementation(() => response);
            updateDetermineNetworkConnectivityStatus(internet);
        };

        it('Should be able to make api call when internet is available', async () => {
            prepare(
                true,
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            results: [
                                {
                                    email: 'a*******2@mailinator.com',
                                    mobile: '9********2',
                                    name: 'A*****i',
                                    ref: 'I*****9',
                                    firebase_uid:
                                        'mysrcm-Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                                },
                            ],
                        }),
                }),
            );

            const returnValue = await searchSeekerUsingID('abhyasiIdMock', {
                setBusy: setBusyMock,
            });

            expect(searchAbhyasisMock).toBeCalledWith(
                {
                    ref: 'abhyasiIdMock',
                },
                '',
            );
            expect(returnValue).toEqual([
                {
                    email: 'a*******2@mailinator.com',
                    name: 'A*****i',
                    phoneNo: '9********2',
                    seekerId: 'I*****9',
                    isSelected: false,
                    abhyasiId: 'abhyasiIdMock',
                    firebase_uid: 'Fu33J2zJpFZQFtD3WgIAaAj9q5x1',
                },
            ]);
        });

        it('Should not be able to make api call when internet is not available', async () => {
            prepare(false);

            const returnValue = await searchSeekerUsingID('abhyasiIdMock', {
                setBusy: setBusyMock,
            });

            expect(searchAbhyasisMock).not.toBeCalled();
            expect(returnValue).toEqual(undefined);
        });

        it('Should be able to make api call and some error is thrown', async () => {
            prepare(true, Promise.reject({ message: 'mockError' }));

            const returnValue = await searchSeekerUsingID('abhyasiIdMock', {
                setBusy: setBusyMock,
            });

            expect(searchAbhyasisMock).toBeCalledWith(
                {
                    ref: 'abhyasiIdMock',
                },
                '',
            );
            expect(returnValue).toEqual(null);
        });
    });

    describe('#setSeekerListInSessionDetails', () => {
        it('Should be able to make api call and some error is thrown', async () => {
            const valuesMock = {
                date: '21/01/2022',
                startTime: '11:00 AM',
                endTime: '11:23 AM',
                duration: '23:00',
                numberOfPeople: 2,
                seekerList: [],
                comments: 'commentsMock',
            };
            const setSessionDetailsMock = jest.fn();
            setSeekerListInSessionDetails(
                [
                    {
                        city_id: 876,
                        email: 'abhyasi.55@mailinator.com',
                        mobile: '+919876541230',
                        name: 'Abhyasi',
                        ref: 'ABHYASIIDMOCK',
                    },
                ],
                {
                    offlineSessionDetails: valuesMock,
                    setSessionDetails: setSessionDetailsMock,
                },
            );
            expect(setSessionDetailsMock).toBeCalledWith({
                date: '21/01/2022',
                startTime: '11:00 AM',
                endTime: '11:23 AM',
                duration: '23:00',
                numberOfPeople: 2,
                seekerList: [
                    {
                        city_id: 876,
                        email: 'abhyasi.55@mailinator.com',
                        mobile: '+919876541230',
                        name: 'Abhyasi',
                        ref: 'ABHYASIIDMOCK',
                    },
                ],
                comments: 'commentsMock',
            });
        });
    });
    describe('#shouldAllowPreceptorToSearchSeeker', () => {
        it('Should be true, when initial search', async () => {
            updatePreceptorSearchedSeekerDates();
            const returnValue = await shouldAllowPreceptorToSearchSeeker();

            expect(returnValue).toEqual(true);
        });
        it('Should be true, when searched only less than 5 times', async () => {
            updatePreceptorSearchedSeekerDates([
                1640421622,
                1640421742,
                1640421752,
            ]);
            const returnValue = await shouldAllowPreceptorToSearchSeeker();

            expect(returnValue).toEqual(true);
        });
        it('Should be false, when last search happenned with-in 15 min time limit', async () => {
            updatePreceptorSearchedSeekerDates([
                1645776997,
                1645777012,
                1645779613,
                1645779626,
                1645784134,
            ]);
            const returnValue = await shouldAllowPreceptorToSearchSeeker();
            expect(preceptorSearchedSeekerDatesSetMock).not.toBeCalled();
            expect(returnValue).toEqual(false);
        });

        it('Should be true, when last search happenned 15 mins before', async () => {
            updatePreceptorSearchedSeekerDates([
                1645776997,
                1645777012,
                1645779613,
                1645779626,
                1645779626,
            ]);
            const returnValue = await shouldAllowPreceptorToSearchSeeker();
            expect(preceptorSearchedSeekerDatesSetMock).toBeCalledWith([]);

            expect(returnValue).toEqual(true);
        });
    });
});
