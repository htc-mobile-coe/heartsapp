import { sendPasswordResetEmail } from '../../services/firebase/AuthService';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import i18n from 'i18next';

const _getErrorMessage = error => {
    const errorCode = error.errorCode;

    switch (errorCode) {
        case ERROR_CODES.INVALID_EMAIL:
            return i18n.t('forgotPasswordScreen:invalidEmail');

        case ERROR_CODES.USER_NOT_FOUND:
            return i18n.t('forgotPasswordScreen:userNotFound');

        default:
            return error.message;
    }
};

export const send = async (params, props) => {
    const { setBusy } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            await sendPasswordResetEmail(params);
            setBusy(false);
            return null;
        } catch (error) {
            setBusy(false);
            return _getErrorMessage(error);
        }
    } else {
        setBusy(false);
        return false;
    }
};
