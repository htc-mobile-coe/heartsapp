import React from 'react';
import { shallow } from 'enzyme';
import { SittingHistoryScreenContainer, mapStateToProps } from './index';
import SittingHistoryScreen from './SittingHistoryScreen';
import {
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
    Scenes,
    SITTING_APP_TYPES,
} from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
import PreceptorSession from '../../services/meditation/PreceptorSession';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { findByProp, runAllPromises } from '../../utils/TestUtils';
import * as RNLocalize from 'react-native-localize';
import * as SittingHistoryService from './index.service';
import moment from 'moment';
import OfflineSittingDetailService from '../../services/meditation/OfflineSittingDetailService';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';

describe('SittingHistoryScreenContainer', () => {
    const Component = (props, disableLifecycle = false) => {
        return shallow(
            <SittingHistoryScreenContainer selectedFilter={'ALL'} {...props} />,
            {
                disableLifecycleMethods: disableLifecycle,
            },
        );
    };
    const pushMock = jest.spyOn(Actions, 'push').mockImplementation(() => {});
    const refreshMock = jest
        .spyOn(Actions, 'refresh')
        .mockImplementation(() => {});

    Date.now = jest.fn(() => 1631709325000);
    let getSittingHistoryListMock;
    let getDiaryEntryMock;
    let determineNetworkConnectivityStatusMock;
    let sharePreceptorHistorySendMock;
    const startTimeMock = moment.unix(1631709325).format('hh:mm a');
    const sittingHistoryListResponseMock = {
        totalSessions: 25,
        totalSeekers: 18,
        nextPageToken: 2,
        meditationSessions: [
            {
                totalSeekers: 1,
                startTime: { seconds: 1631709325 },
                endTime: { seconds: 1631709344 },
                scheduledStartTime: {
                    seconds: moment().unix(),
                },
                sessionId: 'sessionIdMock',
                seekerNames: 'seekerNamesMock',
                comments: 'commentsMock',
                meansThroughWhichSittingGiven: SITTING_APP_TYPES.HEARTS_APP,
            },
        ],
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
    const getSittingHistoryListResponse = response => {
        getSittingHistoryListMock = jest
            .spyOn(SittingHistoryService, 'getSittingHistoryList')
            .mockImplementation(() => response);
    };
    const getDiaryEntryResponse = response => {
        getDiaryEntryMock = jest
            .spyOn(SittingHistoryService, 'getDiaryEntry')
            .mockImplementation(() => response);
    };

    const prepareSharePreceptorHistory = value => {
        sharePreceptorHistorySendMock = jest
            .spyOn(PreceptorSession, 'sendPreceptorHistory')
            .mockImplementation(() => {
                return value;
            });
    };
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    afterEach(() => {
        if (getSittingHistoryListMock) {
            getSittingHistoryListMock.mockClear();
            getSittingHistoryListMock = undefined;
        }
        if (getDiaryEntryMock) {
            getDiaryEntryMock.mockClear();
            getDiaryEntryMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (sharePreceptorHistorySendMock) {
            sharePreceptorHistorySendMock.mockClear();
            sharePreceptorHistorySendMock = undefined;
        }
        logEventMock.mockClear();
        refreshMock.mockClear();
        pushMock.mockClear();
    });

    it('Should SittingHistoryScreen in container', () => {
        const component = Component();
        expect(component.find(SittingHistoryScreen)).toHaveLength(1);
    });

    it('Should able to call onBackPress when back button is pressed', () => {
        const popMock = jest.spyOn(Actions, 'pop').mockImplementation(() => {});
        const component = Component();

        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('BackPress');

        expect(popMock).toHaveBeenCalled();
    });

    describe('#onFromDateChange', () => {
        it('Should able to call onFromDateChange when fromDate is same or before toDate and internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);

            const component = Component({}, true);
            component.setState({ toDate: '2021-08-18' });
            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('FromDateChange', '2021-08-11');
            await runAllPromises();

            expect(component.state().fromDate).toEqual('2021-08-11');
            expect(component.state().showToDatePickerModal).toEqual(false);
            expect(component.state().totalNoOfSessionsConducted).toEqual(25);
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
            expect(component.state().pageToken).toEqual(2);
            expect(component.state().hasMore).toEqual(false);
            expect(component.state().sittingList).toEqual([
                {
                    date: '15th Sep 2021 - Wed',
                    duration: '00:19',
                    peopleAttended: 1,
                    sessionId: 'sessionIdMock',
                    startTime: startTimeMock,
                    seekerNames: 'seekerNamesMock',
                    comments: 'commentsMock',
                    sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                },
            ]);
        });

        it('Should able to navigate sittingDetailsScreen and start offline sitting service, when user tap add button pressed', async () => {
            const setTrackOptionsMock = jest.fn();
            const component = Component({
                setTrackOptions: setTrackOptionsMock,
            });
            const offlineSittingDetailServiceStartMock = jest
                .spyOn(OfflineSittingDetailService, 'start')
                .mockImplementation(() => {});
            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('AddSittingHistoryButtonPress');
            expect(setTrackOptionsMock).toHaveBeenCalledWith(
                OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
            );
            expect(offlineSittingDetailServiceStartMock).toHaveBeenCalledWith(
                Scenes.sittingHistoryScreen,
            );
            expect(pushMock).toBeCalledWith(Scenes.sittingDetailsScreen);
            expect(logEventMock).toBeCalledWith(
                'preceptor_session_add',
                Scenes.sittingHistoryScreen,
            );
        });

        it('Should able to call onFromDateChange when fromDate is not same or before toDate and internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({}, true);
            component.setState({
                toDate: '2021-08-18',
                fromDate: '2021-08-20',
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('FromDateChange', '2021-08-19');
            await runAllPromises();

            expect(component.state().fromDate).toEqual('2021-08-20');
            expect(component.state().showToDatePickerModal).toEqual(false);
            expect(component.state().totalNoOfSessionsConducted).toEqual(25);
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
            expect(component.state().pageToken).toEqual(2);
            expect(component.state().hasMore).toEqual(false);
            expect(component.state().sittingList).toEqual([
                {
                    date: '15th Sep 2021 - Wed',
                    duration: '00:19',
                    peopleAttended: 1,
                    sessionId: 'sessionIdMock',
                    startTime: startTimeMock,
                    seekerNames: 'seekerNamesMock',
                    comments: 'commentsMock',
                    sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                },
            ]);
        });

        it('Should able to call onFromDateChange when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);

            const component = Component({}, true);
            component.setState({
                toDate: '2021-08-18',
                fromDate: '2021-08-20',
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('FromDateChange', '2021-08-19');
            await runAllPromises();

            expect(component.state().fromDate).toEqual('2021-08-20');
            expect(component.state().showToDatePickerModal).toEqual(false);
        });
    });

    describe('#onToDateChange', () => {
        it('Should able to call onToDateChange when toDate is same or after fromDate and internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({}, true);
            component.setState({ fromDate: '2021-08-18' });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ToDateChange', '2021-08-25');
            await runAllPromises();

            expect(component.state().toDate).toEqual('2021-08-25');
            expect(component.state().showToDatePickerModal).toEqual(false);
            expect(component.state().totalNoOfSessionsConducted).toEqual(25);
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
            expect(component.state().pageToken).toEqual(2);
            expect(component.state().hasMore).toEqual(false);
            expect(component.state().sittingList).toEqual([
                {
                    date: '15th Sep 2021 - Wed',
                    duration: '00:19',
                    peopleAttended: 1,
                    sessionId: 'sessionIdMock',
                    startTime: startTimeMock,
                    seekerNames: 'seekerNamesMock',
                    comments: 'commentsMock',
                    sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                },
            ]);
        });

        it('Should able to call onToDateChange when fromDate is not same or after toDate and internet is available', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({}, true);
            component.setState({
                fromDate: '2021-08-28',
                toDate: '2021-08-30',
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ToDateChange', '2021-08-25');
            await runAllPromises();

            expect(component.state().toDate).toEqual('2021-08-30');
            expect(component.state().showToDatePickerModal).toEqual(false);
            expect(component.state().totalNoOfSessionsConducted).toEqual(25);
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
            expect(component.state().pageToken).toEqual(2);
            expect(component.state().hasMore).toEqual(false);
            expect(component.state().sittingList).toEqual([
                {
                    date: '15th Sep 2021 - Wed',
                    duration: '00:19',
                    peopleAttended: 1,
                    sessionId: 'sessionIdMock',
                    startTime: startTimeMock,
                    seekerNames: 'seekerNamesMock',
                    comments: 'commentsMock',
                    sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                },
            ]);
        });

        it('Should able to call onToDateChange when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);

            const component = Component({}, true);
            component.setState({
                fromDate: '2021-08-28',
                toDate: '2021-08-30',
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ToDateChange', '2021-08-25');
            await runAllPromises();

            expect(component.state().toDate).toEqual('2021-08-30');
            expect(component.state().showToDatePickerModal).toEqual(false);
        });
    });

    it('Should able to call onFromDatePress when user press on from date view', () => {
        const component = Component();

        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('FromDatePress', true);

        expect(component.state().showFromDatePickerModal).toEqual(true);
    });

    it('Should able to call onToDatePress when user press on to date view', () => {
        const component = Component();

        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('ToDatePress', true);

        expect(component.state().showToDatePickerModal).toEqual(true);
    });

    describe('#onListItemSelected', () => {
        it('Should able to call onListItemSelected when sitting list item is selected & sittingAppType is HEARTS_APP and response has valid values', async () => {
            const response = {
                text: 'DiaryEntryTextMock',
            };
            updateDetermineNetworkConnectivityStatus(true);
            getDiaryEntryResponse(response);

            const component = Component();
            component.setState({
                sittingList: [
                    {
                        sessionId: 'sessionIdMock1',
                        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                    },
                    {
                        sessionId: 'sessionIdMock2',
                        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                    },
                ],
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ListItemSelected', 1);
            await runAllPromises();

            expect(getDiaryEntryMock).toBeCalledWith('sessionIdMock2');
            expect(component.state().selectedIndex).toEqual(1);
            expect(component.state().diaryEntry).toEqual('DiaryEntryTextMock');
        });

        it('Should able to call onListItemSelected when sitting list item is selected & sittingAppType is HEARTS_APP and response is undefined', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getDiaryEntryResponse(undefined);

            const component = Component();
            component.setState({
                sittingList: [
                    {
                        sessionId: 'sessionIdMock1',
                        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                    },
                    {
                        sessionId: 'sessionIdMock2',
                        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                    },
                ],
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ListItemSelected', 1);

            expect(getDiaryEntryMock).toBeCalledWith('sessionIdMock2');
            expect(component.state().selectedIndex).toEqual(1);
        });

        it('Should able to call onListItemSelected when sitting list item is selected & sittingAppType is EXTERNAL', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getDiaryEntryResponse(undefined);

            const component = Component();
            component.setState({
                sittingList: [
                    {
                        sessionId: 'sessionIdMock1',
                        sittingAppType: SITTING_APP_TYPES.WITHOUT_USING_APP,
                    },
                    {
                        sessionId: 'sessionIdMock2',
                        sittingAppType: SITTING_APP_TYPES.WITHOUT_USING_APP,
                    },
                ],
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ListItemSelected', 1);

            expect(getDiaryEntryMock).not.toBeCalled();
            expect(component.state().selectedIndex).toEqual(1);
        });

        it('Should able to call onListItemSelected when sitting list item is selected and selected index is null', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getDiaryEntryResponse();

            const component = Component();
            component.setState({
                sittingList: [
                    {
                        sessionId: 'sessionIdMock1',
                        sittingAppType: SITTING_APP_TYPES.WITHOUT_USING_APP,
                    },
                    {
                        sessionId: 'sessionIdMock2',
                        sittingAppType: SITTING_APP_TYPES.WITHOUT_USING_APP,
                    },
                ],
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ListItemSelected', null);

            expect(component.state().selectedIndex).toEqual(null);
            expect(getDiaryEntryMock).not.toBeCalled();
        });

        it('Should able to call onListItemSelected when internet is not available', async () => {
            updateDetermineNetworkConnectivityStatus(false);
            getDiaryEntryResponse();

            const component = Component();
            component.setState({
                sittingList: [
                    {
                        sessionId: 'sessionIdMock1',
                        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                    },
                    {
                        sessionId: 'sessionIdMock2',
                        sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                    },
                ],
            });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('ListItemSelected', 1);

            expect(component.state().selectedIndex).toEqual(1);
            expect(getDiaryEntryMock).not.toBeCalled();
        });
    });

    describe('#onLoadMore', () => {
        it('Should able to call onLoadMore when list has reached end and pageToken is 0', () => {
            const component = Component();

            component
                .find(SittingHistoryScreen)
                .first()
                .simulate('LoadMore');

            expect(component.state().hasMore).toEqual(false);
        });

        it('Should able to call onLoadMore when list has reached end and pageToken is other than 0, pageToken and previousPageToken should not equal and startTime & endTime values are present', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({}, true);
            component.setState({ pageToken: 1 });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('LoadMore');
            await runAllPromises();

            expect(component.state().totalNoOfSessionsConducted).toEqual(25);
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
            expect(component.state().pageToken).toEqual(2);
            expect(component.state().previousPageToken).toEqual(1);
            expect(component.state().pageToken).not.toEqual(
                component.state().previousPageToken,
            );
            expect(getSittingHistoryListMock).toHaveBeenCalled();
            expect(component.state().hasMore).toEqual(false);
            expect(component.state().sittingList).toEqual([
                {
                    date: '15th Sep 2021 - Wed',
                    duration: '00:19',
                    peopleAttended: 1,
                    sessionId: 'sessionIdMock',
                    startTime: startTimeMock,
                    seekerNames: 'seekerNamesMock',
                    comments: 'commentsMock',
                    sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                },
            ]);
        });

        it('Should able to call onLoadMore when list has reached end and pageToken is other than 0 and startTime & endTime values are not present', async () => {
            const responseMock = {
                totalSessions: 25,
                totalSeekers: 18,
                nextPageToken: 2,
                meditationSessions: [
                    {
                        totalSeekers: 1,
                        scheduledStartTime: { seconds: 1631709325 },
                        sessionId: 'sessionIdMock',
                        seekerNames: 'seekerNamesMock',
                        comments: 'commentsMock',
                        meansThroughWhichSittingGiven:
                            SITTING_APP_TYPES.HEARTS_APP,
                    },
                ],
            };
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(responseMock);
            const component = Component({}, true);
            component.setState({ pageToken: 1 });

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('LoadMore');
            await runAllPromises();

            expect(component.state().totalNoOfSessionsConducted).toEqual(25);
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
            expect(component.state().pageToken).toEqual(2);
            expect(component.state().previousPageToken).toEqual(1);
            expect(component.state().hasMore).toEqual(false);
            expect(getSittingHistoryListMock).toHaveBeenCalled();
            expect(component.state().sittingList).toEqual([
                {
                    date: '15th Sep 2021 - Wed',
                    duration: '00:00',
                    peopleAttended: 1,
                    sessionId: 'sessionIdMock',
                    startTime: startTimeMock,
                    seekerNames: 'seekerNamesMock',
                    comments: 'commentsMock',
                    sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
                },
            ]);
        });
        it('Should not call getSittingHistoryList service when list has reached end, pageToken and previousPageToken is same', async () => {
            const responseMock = {
                totalSessions: 25,
                totalSeekers: 18,
                nextPageToken: 1,
                meditationSessions: [
                    {
                        totalSeekers: 1,
                        scheduledStartTime: { seconds: 1631709325 },
                        sessionId: 'sessionIdMock',
                    },
                ],
            };
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(responseMock);
            const component = Component({}, true);

            await component
                .find(SittingHistoryScreen)
                .first()
                .simulate('LoadMore');
            await runAllPromises();

            expect(component.state().pageToken).toEqual(
                component.state().previousPageToken,
            );
            expect(component.state().hasMore).toEqual(false);
            expect(getSittingHistoryListMock).not.toHaveBeenCalled();
        });
    });

    it('Should able to map redux state to props', async () => {
        expect(
            mapStateToProps({
                user: {
                    hfnProfile: {
                        stage: 3,
                        email: 'preceptor.55@mailinator.com',
                    },
                },
                deviceState: {
                    isApplicationServerReachable: true,
                },
            }),
        ).toEqual({
            isUserPreceptor: true,
            isApplicationServerReachable: true,
            userEmail: 'preceptor.55@mailinator.com',
        });
    });
    it('Should handle share button press event when user press submit button in onShareButtonPress', () => {
        const component = Component({});
        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('ShareButtonPress');
        expect(
            findByProp(component, 'showShareHistoryPopup', true),
        ).toBeDefined();
        expect(component.state().showShareHistoryPopup).toEqual(true);
        expect(logEventMock).toBeCalledWith(
            'preceptor_session_share_history',
            Scenes.sittingHistoryScreen,
        );
    });
    it('Should handle skip button press event when user press submit button in onSharePreceptorHistorySkipPress', () => {
        const component = Component({});
        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('SharePreceptorHistorySkipPress');
        expect(
            findByProp(component, 'showShareHistoryPopup', false),
        ).toBeDefined();
        expect(
            findByProp(component, 'showShareHistoryPopup', false),
        ).toBeDefined();
        expect(component.state().showShareHistoryPopup).toEqual(false);
        expect(component.state().showSuccessMessage).toEqual(false);
    });

    it('Should handle submit button press event when user press submit button in onSharePreceptorHistorySendPress when internet is available and both Through HeartsApp and outside heartsApp are selected', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        prepareSharePreceptorHistory({ email: 'mock@gmail.com' });

        const component = Component({});
        component.setState({ fromDate: '2021-08-28', toDate: '2021-08-30' });
        const fromMock = moment('2021-08-28').unix();
        const toMock = moment('2021-08-30')
            .endOf('day')
            .unix();
        const timeZoneMock = RNLocalize.getTimeZone();
        await component
            .find(SittingHistoryScreen)
            .first()
            .simulate('SharePreceptorHistorySendPress', {
                email: 'test@gmail.com',
            });
        await runAllPromises();
        expect(sharePreceptorHistorySendMock).toBeCalledWith(
            fromMock,
            toMock,
            'test@gmail.com',
            timeZoneMock,
            [SITTING_APP_TYPES.HEARTS_APP, SITTING_APP_TYPES.WITHOUT_USING_APP],
        );
        expect(findByProp(component, 'showSuccessMessage', true)).toBeDefined();
        expect(component.state().showSuccessMessage).toEqual(true);
        expect(component.state().choosenEmail).toEqual('test@gmail.com');
        expect(component.state().showShareHisoryLoader).toEqual(false);
    });
    it('Should handle submit button press event when user press submit button in onSharePreceptorHistorySendPress when internet is not available', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        prepareSharePreceptorHistory({ email: 'mock@gmail.com' });

        const component = Component({});
        await component
            .find(SittingHistoryScreen)
            .first()
            .simulate('SharePreceptorHistorySendPress');
        expect(sharePreceptorHistorySendMock).not.toBeCalled();
        expect(component.state().showShareHisoryLoader).toEqual(false);
    });
    it('Should handle submit button press event when user press submit button in onSharePreceptorHistorySendPress when internet is available and both Through HeartsApp and outside heartsApp are selected and result is undefined', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        prepareSharePreceptorHistory(undefined);

        const component = Component({});
        component.setState({ fromDate: '2021-08-28', toDate: '2021-08-30' });
        const fromMock = moment('2021-08-28').unix();
        const toMock = moment('2021-08-30')
            .endOf('day')
            .unix();
        const timeZoneMock = RNLocalize.getTimeZone();
        await component
            .find(SittingHistoryScreen)
            .first()
            .simulate('SharePreceptorHistorySendPress', {
                email: 'test@gmail.com',
            });
        await runAllPromises();
        expect(sharePreceptorHistorySendMock).toBeCalledWith(
            fromMock,
            toMock,
            'test@gmail.com',
            timeZoneMock,
            [SITTING_APP_TYPES.HEARTS_APP, SITTING_APP_TYPES.WITHOUT_USING_APP],
        );
        expect(component.state().showShareHisoryLoader).toEqual(false);
    });
    it('Should handle submit button press event when user press submit button in onSharePreceptorHistorySendPress when both Through HeartsApp and outside heartsApp are not selected', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        prepareSharePreceptorHistory({ email: 'mock@gmail.com' });

        const component = Component({});
        component.setState({
            isThroughHeartsAppSelected: false,
            isOutsideHeartsAppSelected: false,
        });

        await component
            .find(SittingHistoryScreen)
            .first()
            .simulate('SharePreceptorHistorySendPress');

        expect(sharePreceptorHistorySendMock).not.toBeCalled();
        expect(component.state().showShareHisoryLoader).toEqual(false);
    });

    it('Should able to call onThroughHeartsAppPress when Through HeartsApp option is press', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        getSittingHistoryListResponse(sittingHistoryListResponseMock);
        const component = Component({}, true);
        component.setState({
            fromDate: '2021-08-12',
            toDate: '2021-08-18',
            isThroughHeartsAppSelected: false,
            isOutsideHeartsAppSelected: true,
        });

        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('ThroughHeartsAppPress', true);

        await runAllPromises();

        expect(component.state().isThroughHeartsAppSelected).toEqual(true);
        expect(getSittingHistoryListMock).toBeCalledWith(
            0,
            moment('2021-08-12').unix(),
            moment('2021-08-18')
                .endOf('day')
                .unix(),
            10,
            [SITTING_APP_TYPES.HEARTS_APP, SITTING_APP_TYPES.WITHOUT_USING_APP],
        );
        expect(component.state().totalNoOfSessionsConducted).toEqual(25);
        expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
        expect(component.state().pageToken).toEqual(2);
        expect(component.state().hasMore).toEqual(false);
        expect(component.state().sittingList).toEqual([
            {
                date: '15th Sep 2021 - Wed',
                duration: '00:19',
                peopleAttended: 1,
                sessionId: 'sessionIdMock',
                startTime: startTimeMock,
                seekerNames: 'seekerNamesMock',
                comments: 'commentsMock',
                sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
            },
        ]);
        expect(logEventMock).toBeCalledWith(
            'preceptor_session_with_heartsAppOn',
            Scenes.sittingHistoryScreen,
        );
    });

    it('Should able to call onOutsideHeartsAppPress when Offline HeartsApp option is press', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        getSittingHistoryListResponse(sittingHistoryListResponseMock);
        const component = Component({}, true);
        component.setState({
            fromDate: '2021-08-12',
            toDate: '2021-08-18',
            isThroughHeartsAppSelected: true,
            isOutsideHeartsAppSelected: false,
        });

        component
            .find(SittingHistoryScreen)
            .first()
            .simulate('OutsideHeartsAppPress', true);

        await runAllPromises();

        expect(component.state().isOutsideHeartsAppSelected).toEqual(true);
        expect(getSittingHistoryListMock).toBeCalledWith(
            0,
            moment('2021-08-12').unix(),
            moment('2021-08-18')
                .endOf('day')
                .unix(),
            10,
            [SITTING_APP_TYPES.HEARTS_APP, SITTING_APP_TYPES.WITHOUT_USING_APP],
        );
        expect(component.state().totalNoOfSessionsConducted).toEqual(25);
        expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
        expect(component.state().pageToken).toEqual(2);
        expect(component.state().hasMore).toEqual(false);
        expect(component.state().sittingList).toEqual([
            {
                date: '15th Sep 2021 - Wed',
                duration: '00:19',
                peopleAttended: 1,
                sessionId: 'sessionIdMock',
                startTime: startTimeMock,
                seekerNames: 'seekerNamesMock',
                comments: 'commentsMock',
                sittingAppType: SITTING_APP_TYPES.HEARTS_APP,
            },
        ]);
        expect(logEventMock).toBeCalledWith(
            'preceptor_session_with_notHeartsAppOn',
            Scenes.sittingHistoryScreen,
        );
    });

    describe('#componentDidMount', () => {
        it('Should able to call getSittingHistoryList when Through HeartsApp is selected and outside heartsApp is not selected', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({});
            component.setState({
                fromDate: '2021-09-08',
                toDate: '2021-09-15',
                isThroughHeartsAppSelected: true,
                isOutsideHeartsAppSelected: false,
            });

            await runAllPromises();

            expect(getSittingHistoryListMock).toBeCalledWith(
                0,
                moment('2021-09-08').unix(),
                moment('2021-09-15')
                    .endOf('day')
                    .unix(),
                10,
                [SITTING_APP_TYPES.HEARTS_APP],
            );
        });

        it('Should able to call getSittingHistoryList when Through HeartsApp is not selected and outside heartsApp is selected', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({});
            component.setState({
                fromDate: '2021-09-08',
                toDate: '2021-09-15',
                isThroughHeartsAppSelected: false,
                isOutsideHeartsAppSelected: true,
            });

            await runAllPromises();

            expect(getSittingHistoryListMock).toBeCalledWith(
                0,
                moment('2021-09-08').unix(),
                moment('2021-09-15')
                    .endOf('day')
                    .unix(),
                10,
                [SITTING_APP_TYPES.WITHOUT_USING_APP],
            );
        });

        it('Should able to call getSittingHistoryList when both Through HeartsApp and outside heartsApp are not selected', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({});
            component.setState({
                fromDate: '2021-08-12',
                toDate: '2021-08-18',
                isThroughHeartsAppSelected: false,
                isOutsideHeartsAppSelected: false,
            });

            await runAllPromises();

            expect(getSittingHistoryListMock).not.toBeCalled();
        });
    });

    describe('#componentDidUpdate', () => {
        it('Should able call get Sitting history,  when shouldFetchSessionHistory is true', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({}, false);
            component.setState({
                fromDate: '2021-08-12',
                toDate: '2021-08-18',
                isThroughHeartsAppSelected: false,
                isOutsideHeartsAppSelected: true,
            });
            component.setProps({
                shouldFetchSessionHistory: true,
            });
            await runAllPromises();
            expect(refreshMock).toBeCalled();
            expect(component.state().totalNoOfPeopleWhoTookSitting).toEqual(18);
        });
        it('Should not able  call get Sitting history, when shouldFetchSessionHistory is null', async () => {
            updateDetermineNetworkConnectivityStatus(true);
            getSittingHistoryListResponse(sittingHistoryListResponseMock);
            const component = Component({}, false);
            component.setState({
                fromDate: '2021-08-12',
                toDate: '2021-08-18',
                isThroughHeartsAppSelected: false,
                isOutsideHeartsAppSelected: true,
            });
            component.setProps({
                shouldFetchSessionHistory: null,
            });
            await runAllPromises();
            expect(refreshMock).not.toBeCalled();
        });
    });
    describe('#getDerivedStateFromProps', () => {
        it('Should be able to update selected filter options when selectedFilter is "THROUGH_HEARTSAPP"', () => {
            const component = Component({
                selectedFilter: 'THROUGH_HEARTSAPP',
            });
            component.setState({
                isThroughHeartsAppSelected: null,
                isOutsideHeartsAppSelected: null,
            });
            expect(component.props().isThroughHeartsAppSelected).toEqual(true);
            expect(component.props().isOutsideHeartsAppSelected).toEqual(false);
        });
        it('Should be able to update selected filter options  when selectedFilter is "OUT_SIDE_HEARTSAPP"', () => {
            const component = Component({
                selectedFilter: 'OUT_SIDE_HEARTSAPP',
            });
            component.setState({
                isThroughHeartsAppSelected: null,
                isOutsideHeartsAppSelected: null,
            });
            expect(component.props().isThroughHeartsAppSelected).toEqual(false);
            expect(component.props().isOutsideHeartsAppSelected).toEqual(true);
        });
        it('Should be able to update selected filter options  when selectedFilter is "ALL"', () => {
            const component = Component({
                selectedFilter: 'ALL',
            });
            component.setState({
                isThroughHeartsAppSelected: null,
                isOutsideHeartsAppSelected: null,
            });
            expect(component.props().isThroughHeartsAppSelected).toEqual(true);
            expect(component.props().isOutsideHeartsAppSelected).toEqual(true);
        });
        it('Should be able to update selected filter options  when isThroughHeartsAppSelected and isOutsideHeartsAppSelected states are not null', () => {
            const component = Component();
            component.setState({
                isThroughHeartsAppSelected: true,
                isOutsideHeartsAppSelected: false,
            });
            expect(component.props().isThroughHeartsAppSelected).toEqual(true);
            expect(component.props().isOutsideHeartsAppSelected).toEqual(false);
        });
    });
});
