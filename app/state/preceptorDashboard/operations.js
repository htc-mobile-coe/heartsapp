import {
    setAvailabilityStatus,
    setPreceptorStatus,
    setOnlineMetrics as onlineMetricsAction,
    setZeroPreceptorNotificationEnabled as setZeroPreceptorNotificationEnabledAction,
    setOnlineMetricsLastUpdatedDateAndTime as setOnlineMetricsLastUpdatedDateAndTimeAction,
} from './actions';
import { get, isEmpty, isUndefined } from 'lodash';
import StorageService from '../../services/native/AppStorageService';
import { getSeekerOnlineMetricsConfig } from '../../services/firebase/RemoteConfigService';
import moment from 'moment';

export const setZeroPreceptorNotificationEnabled = enabled => {
    return dispatch => {
        dispatch(setZeroPreceptorNotificationEnabledAction(enabled));
        StorageService.zeroPreceptorNotificationEnabled.setValue(enabled);
    };
};

export const setAvailable = available => {
    return dispatch => {
        dispatch(setAvailabilityStatus(available));
        StorageService.setPreceptorAvailabilityStatus(available).catch(
            () => {},
        );
    };
};

export const clearAvailabilityStatus = () => {
    return dispatch => {
        dispatch(setPreceptorStatus(null, null));
        StorageService.clearPreceptorAvailabilityStatus().catch(() => {});
        StorageService.zeroPreceptorNotificationEnabled.clear();
    };
};

export const loadFromStorage = () => {
    return async dispatch => {
        try {
            const available = await StorageService.getPreceptorAvailabilityStatus();
            const zeroPreceptorNotificationEnabled = await StorageService.zeroPreceptorNotificationEnabled.getValue();

            if (!isUndefined(available)) {
                setAvailable(available)(dispatch);
            }

            if (!isUndefined(zeroPreceptorNotificationEnabled)) {
                setZeroPreceptorNotificationEnabled(
                    zeroPreceptorNotificationEnabled,
                )(dispatch);
            }
            const seekerOnlineMetricsConfig = getSeekerOnlineMetricsConfig();
            const onlineMetrics = (await StorageService.sittingMetrics.getValue()) ?? {
                noOfSeekersTakingSitting:
                    seekerOnlineMetricsConfig.noOfSeekersTakingSitting,
                noOfSittingsCompleted:
                    seekerOnlineMetricsConfig.noOfSittingsCompleted,
                noOfSittingsCompletedLastUpdatedTimestamp:
                    seekerOnlineMetricsConfig.noOfSittingsCompletedLastUpdatedTimestamp,
                noOfSeekersWaitingForSitting: '-',
                noOfPreceptorsFree: '-',
                noOfSittingsInProgress: '-',
            };
            setOnlineMetrics(onlineMetrics)(dispatch);
        } catch (err) {}
    };
};

const DATE_FORMAT = 'MMM DD, h:mm A';

const getLastUpdatedTimeStamp = noOfSittingsCompletedLastUpdatedTimestamp => {
    const timeStamp = get(noOfSittingsCompletedLastUpdatedTimestamp, 'seconds');

    if (timeStamp) {
        return moment.unix(timeStamp).format(DATE_FORMAT);
    }

    return moment().format(DATE_FORMAT);
};

const getCompletedSessions = noOfSittingsCompleted => {
    const decimalPlaces = Math.pow(10, 1);
    let number = noOfSittingsCompleted;
    const abbrev = ['K', 'M', 'B'];

    for (var i = abbrev.length - 1; i >= 0; i--) {
        const size = Math.pow(10, (i + 1) * 3);

        if (size <= noOfSittingsCompleted) {
            number =
                Math.round((noOfSittingsCompleted * decimalPlaces) / size) /
                decimalPlaces;

            if (number === 1000 && i < abbrev.length - 1) {
                number = 1;
                i++;
            }

            number += abbrev[i];
            break;
        }
    }

    return number;
};

export const setOnlineMetrics = onlineMetrics => {
    return dispatch => {
        dispatch(
            onlineMetricsAction({
                ...onlineMetrics,
                noOfSittingsCompletedLastUpdatedTimestamp: getLastUpdatedTimeStamp(
                    onlineMetrics.noOfSittingsCompletedLastUpdatedTimestamp,
                ),
                noOfSittingsCompleted: getCompletedSessions(
                    onlineMetrics.noOfSittingsCompleted,
                ),
            }),
        );
        StorageService.sittingMetrics.setValue(onlineMetrics);
    };
};

export const getOnlineMetrics = state => {
    const onlineMetrics = get(state.preceptorDashboard, 'onlineMetrics');
    if (isEmpty(onlineMetrics)) {
        return {
            noOfPreceptorsOnline: '--',
            noOfPreceptorsFree: undefined,
            noOfSittingsInProgress: undefined,
            noOfPendingSeekerRequests: '--',
            noOfSeekersTakingSitting: undefined,
            noOfSeekersWaitingForSitting: undefined,
            noOfSittingsCompleted: undefined,
            noOfSittingsCompletedLastUpdatedTimestamp: getLastUpdatedTimeStamp(),
        };
    }
    return onlineMetrics;
};
export const setOnlineMetricsLastUpdatedDateAndTime = dateTime => {
    return dispatch => {
        dispatch(setOnlineMetricsLastUpdatedDateAndTimeAction(dateTime));
    };
};
