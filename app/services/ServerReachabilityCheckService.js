import { operations } from '../state';
import ApplicationEventHandlers from './ApplicationEventHandlers';
import Application from './Application';
import { onError } from '../utils/ErrorHandlingUtils';
import { isEmpty } from 'lodash';
import { currentFirebaseUser } from './firebase/AuthService';
import UserLogoutHelper from './UserLogoutHelper';
import NetInfo from '@react-native-community/netinfo';

class ServerReachabilityObserver {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;

        NetInfo.configure({
            reachabilityLongTimeout: 20 * 1000, // 60s
        });
    };

    _isServerReachable = async () => {
        const state = await NetInfo.fetch();
        return state.isInternetReachable;
    };

    determineNetworkConnectivityStatus = async () => {
        try {
            await this._setServerReachabilityStatus();
            return this.getState().deviceState.isApplicationServerReachable;
        } catch (err) {
            onError(err, 'SRCS-DNCS');
            return false;
        }
    };

    _setServerReachabilityStatus = async (timeout = 5000) => {
        const serverReachable = await this._isServerReachable(timeout);
        operations.deviceState.setApplicationServerReachable(serverReachable)(
            this.dispatch,
        );

        if (serverReachable) {
            await this._executeActions();
        }
    };

    refreshFCMTokenWhenOnline = () => {
        this.refreshFCMTokenAction = true;
    };

    reloadFirebaseUserWhenOnline = () => {
        this.reloadFirebaseUser = true;
    };
    refreshMeditationSessionCountWhenOnline = () => {
        this.refreshMeditationSessionCount = true;
    };

    checkForOngoingSessionWhenOnline = retryCount => {
        this.checkForOngoingMeditationSession = true;
        this.retryCountOfCheckForOngoingMeditationSession = retryCount;
    };

    _executeActions = async () => {
        if (this.reloadFirebaseUser) {
            if (operations.user.isLoggedIn(this.getState())) {
                if (!isEmpty(currentFirebaseUser())) {
                    try {
                        await currentFirebaseUser().reload();
                    } catch (e) {}
                }

                if (isEmpty(currentFirebaseUser())) {
                    UserLogoutHelper.onSessionExpire();
                }
            }

            this.reloadFirebaseUser = false;
        }

        if (this.refreshFCMTokenAction) {
            await ApplicationEventHandlers.refreshFCMToken();
            this.refreshFCMTokenAction = undefined;
        }
        if (this.refreshMeditationSessionCount) {
            await ApplicationEventHandlers.populateSittingCount();
            this.refreshMeditationSessionCount = undefined;
        }

        if (this.checkForOngoingMeditationSession) {
            this.checkForOngoingMeditationSession = undefined;

            if (operations.user.isLoggedIn(this.getState())) {
                await Application.checkAndConnectToOngoingMeditationSession(
                    this.getState,
                    this.retryCountOfCheckForOngoingMeditationSession,
                );
            }
        }
    };
}

export default new ServerReachabilityObserver();
