import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';

const _getErrorMessage = error => {
    const errorCode = error.code;

    switch (errorCode) {
        default:
            return error.message;
    }
};

export const onDataDoesNotMatchTryAgain = async (params, props) => {
    const { setBusy } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            setBusy(false);
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
export const onDataDoesNotMatchContactHelpDeskScreen = async (
    params,
    props,
) => {
    const { setBusy } = props;
    setBusy(true);

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            setBusy(false);
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
