import { Scenes, AbhyasStage } from '../../shared/Constants';
import auth from '@react-native-firebase/auth';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { Actions } from 'react-native-router-flux';
import { get, isUndefined, isArray, isEqual, isNil } from 'lodash';
import i18n from 'i18next';
import { getUserPreferences } from '../../services/grpc/ProfileService';
import {
    subscribeToWeeklyInspirationNotification,
    unsubscribeFromWeeklyInspirationNotification,
} from '../../services/firebase/MessagingService';
import StorageService from '../../services/native/AppStorageService';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import MeditationSessionCountService from '../../services/meditation/MeditationSessionCountService';
import { EVENT_TRACKER } from 'app/shared/Constants';

const _getErrorMessage = error => {
    const errorCode = error.errorCode;

    switch (errorCode) {
        case ERROR_CODES.ACCOUNT_ALREADY_EXISTS:
            return i18n.t('signInScreen:accountAlreadyExists');

        case ERROR_CODES.INVALID_CREDENTIALS:
            return i18n.t('signInScreen:invalidCredentials');

        case ERROR_CODES.INVALID_EMAIL:
            return i18n.t('signInScreen:invalidEmail');

        case ERROR_CODES.OPERATION_NOT_ENABLED:
            return i18n.t('signInScreen:operationNotEnabled');

        case ERROR_CODES.UNABLE_TO_GET_ACCESS_TOKEN:
            return i18n.t('signInScreen:unableToGetAccessToken');

        case ERROR_CODES.USER_CANCELLED_LOGIN:
            return i18n.t('signInScreen:loginCancelledByUser');

        case ERROR_CODES.USER_DISABLED:
            return i18n.t('signInScreen:userDisabled');

        case ERROR_CODES.USER_NOT_FOUND:
            return i18n.t('signInScreen:userNotFound');

        case ERROR_CODES.WRONG_PASSWORD:
            return i18n.t('signInScreen:wrongPassword');

        case ERROR_CODES.EMAIL_NOT_VERIFIED:
            return i18n.t('signInScreen:emailNotVerified');

        default:
            return error.message;
    }
};

export const onLoginPress = async (loginHandle, params, props) => {
    const {
        setBusy,
        setHfnProfile,
        setUserPreferenceSettings,
        setAgeConsentPopupVisibility,
        shouldNavigateToEventTracker,
    } = props;
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            const hfnProfile = await loginHandle(params);
            const providerData = auth().currentUser.providerData;
            const userPreference = await getUserPreferences();
            const providerId =
                !isUndefined(providerData) &&
                isArray(providerData) &&
                providerData.length > 0
                    ? get(providerData[0], 'providerId')
                    : undefined;
            setHfnProfile({ ...hfnProfile, providerId });
            const stage = get(hfnProfile, 'stage');
            if (isEqual(stage, AbhyasStage.PRECEPTOR)) {
                await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            }
            await MeditationSessionCountService.updateCountOfSittingsTaken();

            const { roleDeclaredByUser, saveOnboardingStatus } = props;
            await ReminderNotificationService.cancelReminderNotifications();
            await saveOnboardingStatus(Scenes.home, roleDeclaredByUser, true);
            const isAnonymousUser = get(hfnProfile, 'anonymous');
            if (!isNil(shouldNavigateToEventTracker) && !isAnonymousUser) {
                Actions.push(Scenes.trainersSectionWebViewScreen, {
                    trainersSectionSelectedOption: EVENT_TRACKER,
                });
            }
            setBusy(false);
            if (params) {
                params.resetForm();
            }
            const hasSubscribedToWeeklyInspirationNotification = get(
                userPreference,
                'isSubscribedToWeeklyInspiration.kind',
            );
            const subscribedToWeeklyInspirationNotification =
                isEqual(hasSubscribedToWeeklyInspirationNotification, true) ||
                isNil(hasSubscribedToWeeklyInspirationNotification);
            if (subscribedToWeeklyInspirationNotification) {
                await subscribeToWeeklyInspirationNotification();
            } else {
                await unsubscribeFromWeeklyInspirationNotification();
            }
            await StorageService.hasSubscribedToWeeklyInspirationNotification.setValue(
                subscribedToWeeklyInspirationNotification,
            );
            setAgeConsentPopupVisibility(true);
            setUserPreferenceSettings({
                isWeeklyInspirationNotificationSubscribed: subscribedToWeeklyInspirationNotification,
                shouldPlayGuidedRelaxationAudio: get(
                    userPreference,
                    'shouldPlayRelaxationAudioBeforeMeditation.kind',
                    false,
                ),
            });
            return null;
        } catch (error) {
            setBusy(false);
            return _getErrorMessage(error);
        }
    } else {
        setBusy(false);
    }
};

export const onHelpDeskPress = async (loginHandle, props) => {
    const { setBusy } = props;
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        await loginHandle();
        setBusy(false);
        Actions.helpDesk();
    } else {
        setBusy(false);
    }
};
