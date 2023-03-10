import reducer from './reducers';
import { SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME } from './types';

describe('preceptorDashboardReducers', () => {
    it('Should set initial state null by default to indicate not yet determined', () => {
        expect(reducer(undefined, {})).toEqual({
            available: null,
            onlineMetrics: null,
            isZeroPreceptorNotificationEnabled: null,
            onlineMetricsLastUpdatedDateAndTime: null,
        });
    });

    it('Should set SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME values based on payload', () => {
        expect(
            reducer(
                {},
                {
                    type: SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME,
                    payload: 'Feb 1st,1: 47 PM',
                },
            ),
        ).toEqual({
            onlineMetricsLastUpdatedDateAndTime: 'Feb 1st,1: 47 PM',
        });
    });
});
