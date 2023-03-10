import { Alert } from 'react-native';
import { isEqual, get, inRange, gt } from 'lodash';
import DeviceInfo from 'react-native-device-info';

import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import OnlineMetricsPoller from '../../services/meditation/OnlineMetricsPoller';
import {
    Events,
    ZeroPreceptorNotificationSubscriptionMachine,
} from '../../machines/ZeroPreceptorNotificationSubscription';
import { saveUserPreferences } from '../../services/grpc/ProfileService';
import StorageService from '../../services/native/AppStorageService';
import { IsAndroid, getDefaultLanguageToSelect } from '../../shared/Constants';
import {
    getHeartInTuneAppDownloadPopupConfig,
    whatsNewPopupConfig,
} from '../../services/firebase/RemoteConfigService';
import moment from 'moment';

export const handleZeroPreceptorNotificationStatusChange = async (
    setBusy,
    enabled,
    setZeroPreceptorNotificationEnabled,
) => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            if (enabled) {
                ZeroPreceptorNotificationSubscriptionMachine.send(
                    Events.NOTIFICATION_ENABLED,
                );
            } else {
                ZeroPreceptorNotificationSubscriptionMachine.send(
                    Events.NOTIFICATION_DISABLED,
                );
            }
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    } else {
        setZeroPreceptorNotificationEnabled(!enabled);
    }

    setBusy(false);
};

export const handleSaveUserPreferences = async params => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        await saveUserPreferences(params);
    }
};

export const startPollingOnlineMetrics = async () => {
    OnlineMetricsPoller.start();
};

export const stopPollingOnlineMetrics = async () => {
    OnlineMetricsPoller.stop();
};

const _getContent = () => {
    const config = whatsNewPopupConfig();
    const selectedLanguage = getDefaultLanguageToSelect(config);
    const content = config[selectedLanguage];
    return content;
};

export const getWhatsNewPopUpContent = async () => {
    const content = await _getContent();
    const shownVersion = await StorageService.versionNumberForWhichWhatsNewPopupShown.getValue();
    const latestVersion = IsAndroid
        ? get(content, 'playStore.latestVersionNumber')
        : get(content, 'appStore.latestVersionNumber');
    const latestVersionNumber = latestVersion.replace(/[^0-9.]/g, '');
    const description = IsAndroid
        ? get(content, 'playStore.description')
        : get(content, 'appStore.description');

    const hasUpdateAvailable = DeviceInfo.getVersion().localeCompare(
        latestVersionNumber,
        undefined,
        { numeric: true, sensitivity: 'base' },
    );
    const updateAvailable =
        isEqual(hasUpdateAvailable, -1) &&
        !isEqual(shownVersion, latestVersion);

    if (updateAvailable) {
        await StorageService.versionNumberForWhichWhatsNewPopupShown.setValue(
            latestVersion,
        );
    }
    return { updateAvailable, description, latestVersion };
};

export const getStoreUrl = () => {
    const content = _getContent();
    return IsAndroid ? content.playStore.url : content.appStore.url;
};

export const getHeartInTuneAppURL = () => {
    return getHeartInTuneAppDownloadPopupConfig();
};

export const getRelativeDate = date => {
    const startDate = moment(date, 'YYYY-MM-DD');
    const endDate = moment(moment(), 'YYYY-MM-DD');

    const monthDiff = endDate.diff(startDate, 'months');
    switch (true) {
        case inRange(monthDiff, 0, 3):
            return '1monthsAgo';
        case inRange(monthDiff, 3, 6):
            return '3monthsAgo';
        case inRange(monthDiff, 6, 12):
            return '6monthsAgo';
        case isEqual(monthDiff, 12):
            return '1yearAgo';
        case gt(monthDiff, 12):
            return 'Over1';
    }
};
