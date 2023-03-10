import { Scenes } from '../../shared/Constants';
import { signUp } from '../../services/firebase/AuthService';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { loginAnonymously } from '../../services/firebase/AuthService';
import i18n from 'i18next';
import { subscribeToWeeklyInspirationNotification } from '../../services/firebase/MessagingService';
import StorageService from '../../services/native/AppStorageService';

const _getErrorMessage = error => {
    const errorCode = error.errorCode;

    switch (errorCode) {
        case ERROR_CODES.ACCOUNT_ALREADY_IN_USE:
            return i18n.t('signUpScreen:accountAlreadyInUse');

        case ERROR_CODES.INVALID_EMAIL:
            return i18n.t('signUpScreen:invalidEmail');

        case ERROR_CODES.OPERATION_NOT_ENABLED:
            return i18n.t('signUpScreen:operationNotAllowed');

        case ERROR_CODES.WEAK_PASSWORD:
            return i18n.t('signUpScreen:weakPassword');

        default:
            return error.message;
    }
};

export const doLoginAnonymously = async props => {
    const { setBusy, setHfnProfile } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            const hfnProfile = await loginAnonymously();
            setHfnProfile(hfnProfile);
            const { roleDeclaredByUser, saveOnboardingStatus } = props;
            await saveOnboardingStatus(Scenes.home, roleDeclaredByUser, true);
            setBusy(false);
            await subscribeToWeeklyInspirationNotification();
            return null;
        } catch (error) {
            setBusy(false);
            return _getErrorMessage(error);
        }
    } else {
        setBusy(false);
    }
};

export const onSignUp = async (params, props) => {
    const { setBusy, setUserPreferenceSettings } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            await signUp(params);
            setBusy(false);
            await subscribeToWeeklyInspirationNotification();
            await StorageService.hasSubscribedToWeeklyInspirationNotification.setValue(
                true,
            );
            setUserPreferenceSettings({
                isWeeklyInspirationNotificationSubscribed: true,
                shouldPlayGuidedRelaxationAudio: false,
            });
            return null;
        } catch (error) {
            setBusy(false);
            return _getErrorMessage(error);
        }
    } else {
        setBusy(false);
        return undefined;
    }
};
