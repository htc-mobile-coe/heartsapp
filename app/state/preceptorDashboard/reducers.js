import {
    SET_ONLINE_METRICS,
    SET_AVAILABILITY_STATUS,
    SET_ZERO_PRECEPTOR_NOTIFICATION_ENABLED,
    SET_PRECEPTOR_STATUS,
    SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME,
} from './types';

const initial = {
    available: null,
    onlineMetrics: null,
    isZeroPreceptorNotificationEnabled: null,
    onlineMetricsLastUpdatedDateAndTime: null,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_ZERO_PRECEPTOR_NOTIFICATION_ENABLED:
        case SET_AVAILABILITY_STATUS:
        case SET_PRECEPTOR_STATUS:
        case SET_ONLINE_METRICS:
            return {
                ...previousState,
                ...action.payload,
            };
        case SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME:
            return {
                ...previousState,
                onlineMetricsLastUpdatedDateAndTime: action.payload,
            };
        default:
            return previousState;
    }
};
