import {
    SET_ONLINE_METRICS,
    SET_AVAILABILITY_STATUS,
    SET_ZERO_PRECEPTOR_NOTIFICATION_ENABLED,
    SET_PRECEPTOR_STATUS,
    SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME,
} from './types';

export const setAvailabilityStatus = available => {
    return {
        type: SET_AVAILABILITY_STATUS,
        payload: {
            available,
        },
    };
};

export const setOnlineMetrics = onlineMetrics => {
    return {
        type: SET_ONLINE_METRICS,
        payload: {
            onlineMetrics,
        },
    };
};

export const setZeroPreceptorNotificationEnabled = enabled => {
    return {
        type: SET_ZERO_PRECEPTOR_NOTIFICATION_ENABLED,
        payload: {
            isZeroPreceptorNotificationEnabled: enabled,
        },
    };
};

export const setPreceptorStatus = (
    available,
    isZeroPreceptorNotificationEnabled,
) => {
    return {
        type: SET_PRECEPTOR_STATUS,
        payload: {
            available,
            isZeroPreceptorNotificationEnabled,
        },
    };
};
export const setOnlineMetricsLastUpdatedDateAndTime = dateTime => {
    return {
        type: SET_ONLINE_METRICS_LAST_UPDATED_DATE_AND_TIME,
        payload: dateTime,
    };
};
