import PreceptorSession from '../../services/meditation/PreceptorSession';
import { onError } from '../../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';

export const startMeditation = async setBusy => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            await PreceptorSession.startMeditation();
        } catch (e) {
            onError(e, 'PMSSCR-SM');
        }
    }

    setBusy(false);
};

export const acceptSession = async setBusy => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            await PreceptorSession.acceptMeditation();
        } catch (e) {
            onError(e, 'PMSSCR-AM');
        }
    }

    setBusy(false);
};

export const cancelSession = async setBusy => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            await PreceptorSession.cancelMeditationRequest();
        } catch (e) {
            onError(e, 'PMSSCR-CM');
        }
    }

    setBusy(false);
};

export const endMeditation = async setBusy => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            await PreceptorSession.endMeditation();
        } catch (e) {
            onError(e, 'PMSSCR-EM');
        }
    }

    setBusy(false);
};
