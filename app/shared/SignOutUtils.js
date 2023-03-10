import PreceptorSession from '../services/meditation/PreceptorSession';
import ServerReachabilityCheck from '../services/ServerReachabilityCheckService';
import { deRegisterFCMToken } from '../services/grpc/ProfileService';
import UserLogoutHelper from '../services/UserLogoutHelper';
import { Alert } from 'react-native';

export const signOut = async (isUserPreceptor, setBusy) => {
    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        //IMPORTANT - Check and do changes in MyAccountScreen deactivate account method as well
        try {
            await deRegisterFCMToken();

            if (isUserPreceptor) {
                await PreceptorSession.stop(true);
            }

            UserLogoutHelper.onLogout();
        } catch (e) {
            Alert.alert('Error', e.message);
        }
    }

    setBusy(false);
};
