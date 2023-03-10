import PreceptorStatusUpdateService from './PreceptorStatusUpdateService';
import * as PreceptorDashboardOperation from '../../state/preceptorDashboard/operations';
import * as AppBusyStatusOperation from '../../state/appBusyStatus/operations';

import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import OnlineMetricsPoller from './OnlineMetricsPoller';

import { runAllPromises } from '../../utils/TestUtils';
import PreceptorSession from './PreceptorSession';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';

describe('PreceptorStatusUpdateService', () => {
    let determineNetworkConnectivityStatusMock;
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
    const getStateMock = jest.fn();

    let getOnlineMetricsMock;
    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheckService,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };
    const getOnlineMetricsResponse = response => {
        getOnlineMetricsMock = jest
            .spyOn(OnlineMetricsPoller, 'doGetOnlineMetrics')
            .mockImplementation(() => response);
    };
    const zeroPreceptorNotificationSubscriptionMachineSendMock = jest
        .spyOn(ZeroPreceptorNotificationSubscriptionMachine, 'send')
        .mockImplementation(() => {});

    const preceptorSessionSetReadyMock = jest
        .spyOn(PreceptorSession, 'setReady')
        .mockImplementation(() => {});

    const setAvailableMock = jest.spyOn(
        PreceptorDashboardOperation,
        'setAvailable',
    );
    const setBusyMock = jest.spyOn(AppBusyStatusOperation, 'setBusy');

    afterEach(() => {
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        dispatchMock.mockClear();

        setBusyMock.mockClear();

        setAvailableMock.mockClear();
        zeroPreceptorNotificationSubscriptionMachineSendMock.mockClear();
        if (getOnlineMetricsMock) {
            getOnlineMetricsMock.mockClear();
            getOnlineMetricsMock = undefined;
        }
    });

    it('Should able to change  onlineStatus, when internet is available and preceptor available status is false', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        getOnlineMetricsResponse(onlineMetricsMock);
        PreceptorStatusUpdateService.initialize(dispatchMock, getStateMock);
        await runAllPromises();
        await PreceptorStatusUpdateService.onlineStatusChange(false);

        expect(setBusyMock).toHaveBeenCalledWith(true);
        expect(
            zeroPreceptorNotificationSubscriptionMachineSendMock,
        ).toHaveBeenCalledWith(Events.UNAVAILABLE_FOR_SITTINGS);
    });

    it('Should able to change  onlineStatus, when preceptor available status is true', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        getOnlineMetricsResponse(onlineMetricsMock);
        PreceptorStatusUpdateService.initialize(dispatchMock, getStateMock);
        await runAllPromises();
        await PreceptorStatusUpdateService.onlineStatusChange(true);

        expect(
            zeroPreceptorNotificationSubscriptionMachineSendMock,
        ).toHaveBeenCalledWith(Events.AVAILABLE_FOR_SITTINGS);
        expect(preceptorSessionSetReadyMock).toHaveBeenCalledWith(true, true);
    });
    it('Should able not to change  onlineStatus, when internet is not available', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        PreceptorStatusUpdateService.initialize(dispatchMock, getStateMock);
        await runAllPromises();
        await PreceptorStatusUpdateService.onlineStatusChange(true);
        expect(
            zeroPreceptorNotificationSubscriptionMachineSendMock,
        ).not.toBeCalled();

        expect(setAvailableMock).toHaveBeenCalledWith(false);
    });
});
