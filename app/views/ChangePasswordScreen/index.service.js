import { changePassword } from '../../services/firebase/AuthService';
import { ERROR_CODES } from '../../shared/AuthenticationException';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import i18n from 'i18next';

const _getErrorMessage = error => {
    const errorCode = error.errorCode;
    switch (errorCode) {
        case ERROR_CODES.WRONG_PASSWORD:
            return i18n.t('changePasswordScreen:wrongPassword');
        case ERROR_CODES.WEAK_PASSWORD:
            return i18n.t('changePasswordScreen:weakPassword');
        default:
            return error.message;
    }
};

export const update = async (params, props) => {
    const { setBusy } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            await changePassword(params);
            setBusy(false);
            return null;
        } catch (error) {
            setBusy(false);
            return _getErrorMessage(error);
        }
    } else {
        setBusy(false);
        return null;
    }
};
