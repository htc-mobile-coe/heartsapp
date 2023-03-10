import moment from 'moment';
import operations from '../../state/operations';
import { getOnlineMetrics } from '../grpc/MeditationService';

class OnlineMetricsService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };

    doGetOnlineMetrics = async () => {
        try {
            const refreshOnlineMetrics = this.getState().deviceState
                .isApplicationServerReachable;
            const onlineMetricsLastUpdatedDateAndTime = moment().format(
                'MMM Do, h:mm A',
            );

            if (refreshOnlineMetrics) {
                const onlineMetrics = await getOnlineMetrics();
                operations.preceptorDashboard.setOnlineMetrics(onlineMetrics)(
                    this.dispatch,
                );
                operations.preceptorDashboard.setOnlineMetricsLastUpdatedDateAndTime(
                    onlineMetricsLastUpdatedDateAndTime,
                )(this.dispatch);
            }
        } catch (er) {}
    };

    start = async () => {
        if (!this._getOnlineMetricsTimer) {
            await this.doGetOnlineMetrics();
            this._getOnlineMetricsTimer = setInterval(
                this.doGetOnlineMetrics,
                15000,
            );
        }
    };

    stop = async () => {
        if (this._getOnlineMetricsTimer) {
            clearInterval(this._getOnlineMetricsTimer);
            this._getOnlineMetricsTimer = undefined;
        }
    };
}

export default new OnlineMetricsService();
