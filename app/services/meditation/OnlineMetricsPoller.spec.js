import OnlineMetricsPoller from './OnlineMetricsPoller';
import * as PreceptorDashboardOperation from '../../state/preceptorDashboard/operations';
import { runAllPromises } from '../../utils/TestUtils';
import * as MeditationService from '../grpc/MeditationService';
import moment from 'moment';

describe('OnlineMetricsPoller', () => {
    const onlineMetricsMock = {
        noOfPendingSeekerRequests: 0,
        noOfPreceptorsFree: 0,
        noOfPreceptorsOnline: 0,
        noOfSeekersTakingSitting: 0,
        noOfSeekersWaitingForSitting: 0,
        noOfSittingsCompleted: 4135,
        noOfSittingsInProgress: 0,
    };

    const dispatchMock = jest.fn();
    let getOnlineMetricsMock;

    const getOnlineMetricsResponse = response => {
        getOnlineMetricsMock = jest
            .spyOn(MeditationService, 'getOnlineMetrics')
            .mockImplementation(() => response);
    };
    const setOnlineMetricsMock = jest.spyOn(
        PreceptorDashboardOperation,
        'setOnlineMetrics',
    );
    const setOnlineMetricsLastUpdatedDateAndTimeMock = jest.spyOn(
        PreceptorDashboardOperation,
        'setOnlineMetricsLastUpdatedDateAndTime',
    );

    afterEach(() => {
        dispatchMock.mockClear();
        setOnlineMetricsMock.mockClear();
        setOnlineMetricsLastUpdatedDateAndTimeMock.mockClear();
        if (getOnlineMetricsMock) {
            getOnlineMetricsMock.mockClear();
            getOnlineMetricsMock = undefined;
        }
    });

    it('Should call doGetOnlineMetrics when internet is available', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: true,
            },
        }));
        const onlineMetricsLastUpdatedDateAndTimeMock = moment().format(
            'MMM Do, h:mm A',
        );

        getOnlineMetricsResponse(onlineMetricsMock);
        OnlineMetricsPoller.initialize(dispatchMock, getStateMock);
        await runAllPromises();
        await OnlineMetricsPoller.doGetOnlineMetrics();

        expect(getOnlineMetricsMock).toHaveBeenCalled();

        expect(setOnlineMetricsMock).toBeCalledWith(onlineMetricsMock);
        expect(setOnlineMetricsLastUpdatedDateAndTimeMock).toBeCalledWith(
            onlineMetricsLastUpdatedDateAndTimeMock,
        );
    });

    it('Should not call getOnlineMetrics when internet is not available', async () => {
        const getStateMock = jest.fn().mockImplementation(() => ({
            deviceState: {
                isApplicationServerReachable: false,
            },
            user: {
                authenticated: true,
            },
        }));
        OnlineMetricsPoller.initialize(dispatchMock, getStateMock);
        await runAllPromises();

        await OnlineMetricsPoller.doGetOnlineMetrics();
        expect(
            setOnlineMetricsLastUpdatedDateAndTimeMock,
        ).not.toHaveBeenCalled();
        expect(setOnlineMetricsMock).not.toHaveBeenCalled();
    });
});
