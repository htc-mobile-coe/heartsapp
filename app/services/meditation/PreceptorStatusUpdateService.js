import operations from '../../state/operations';
import PreceptorSession from './PreceptorSession';
import { Alert } from 'react-native';
import OnlineMetricsPoller from './OnlineMetricsPoller';
import ServerReachabilityCheckService from '../ServerReachabilityCheckService';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';

class PreceptorStatusUpdateService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };
    onlineStatusChange = async online => {
        operations.appBusyStatus.setBusy(true)(this.dispatch);
        const canDoNetworkCalls = await ServerReachabilityCheckService.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            try {
                if (online) {
                    ZeroPreceptorNotificationSubscriptionMachine.send(
                        Events.AVAILABLE_FOR_SITTINGS,
                    );
                    const UPDATE_STATUS_ON_SERVER = true;
                    const UPDATE_STATUS_IN_DASHBOARD = true;
                    await PreceptorSession.setReady(
                        UPDATE_STATUS_ON_SERVER,
                        UPDATE_STATUS_IN_DASHBOARD,
                    );
                } else {
                    ZeroPreceptorNotificationSubscriptionMachine.send(
                        Events.UNAVAILABLE_FOR_SITTINGS,
                    );
                    await PreceptorSession.stop(true);
                }
                await OnlineMetricsPoller.doGetOnlineMetrics();
            } catch (e) {
                Alert.alert('Error', e.message);
            }
        } else {
            operations.preceptorDashboard.setAvailable(!online)(this.dispatch);
        }
        operations.appBusyStatus.setBusy(false)(this.dispatch);
    };
}

export default new PreceptorStatusUpdateService();
