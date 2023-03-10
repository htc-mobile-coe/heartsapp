import { BackHandler, Alert } from 'react-native';
import Orientation from 'react-native-orientation';
import NetInfo from '@react-native-community/netinfo';
import firebaseMessaging from '@react-native-firebase/messaging';
import {
    subscribeToWeeklyInspirationNotification,
    unsubscribeFromWeeklyInspirationNotification,
} from './firebase/MessagingService';
import firebaseAuth from '@react-native-firebase/auth';
import { get, set, isEmpty, isUndefined, isEqual, isNil, isNull } from 'lodash';
import { configure } from './firebase/AuthService';
import EventHandlers from './ApplicationEventHandlers';
import { service as SeekerMeditationSessionService } from './meditation/SeekerMeditationSession';
import PreceptorSession from './meditation/PreceptorSession';
import OnlineMetricsPoller from './meditation/OnlineMetricsPoller';
import MeditationSessionCountService from './meditation/MeditationSessionCountService';
import PreceptorStatusUpdateService from './meditation/PreceptorStatusUpdateService';
import { operations } from '../state';
import { Actions } from 'react-native-router-flux';
import ServerReachabilityCheck from './ServerReachabilityCheckService';
import { onError } from '../utils/ErrorHandlingUtils';
import { getExistingSessionByUser } from './grpc/MeditationService';
import StorageService from './native/AppStorageService';
import NotificationService from './NotificationService';
import LocationService from './location/LocationService';
import { isSessionInProgress, Scenes, IsAndroid } from '../shared/Constants';
import { recordException } from './firebase/CrashlyticsService';
import { logExceptionOccurredWhileInitialization } from './firebase/AnalyticsService';
import MasterClassProgressService from './MasterClassProgressService';
import { AppState } from 'react-native';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {
    initialize as initializeRemoteConfig,
    getMinimumSupportedVersion,
} from './firebase/RemoteConfigService';
import compareVersions from 'compare-versions';
import DeviceInfo from 'react-native-device-info';
import { hasDoNotDisturbPermission } from './native/DoNotDisturbService';
import UserLogoutHelper from './UserLogoutHelper';
import MasterClassFinishedDatesLoggingService from './MasterClassFinishedDatesLoggingService';
import { ZeroPreceptorNotificationSubscriptionMachine } from '../machines/ZeroPreceptorNotificationSubscription';
import i18n from 'i18next';
import ApplicationEventHandlers from './ApplicationEventHandlers';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import { getUserPreferences, saveUserPreferences } from './grpc/ProfileService';
import {
    deleteLogsOlderThan7Days,
    log,
} from '../services/DiagnosticLogService';
import PushNotification from 'react-native-push-notification';
import { wait } from '../utils/AsyncUtils';
import { MasterClassProgressMachine } from '../machines/MasterClassProgress';
import { OfflineSittingDetailMachine } from '../machines/OfflineSittingDetail';
import OfflineSittingDetailService from './meditation/OfflineSittingDetailService';

class Application {
    TAG = 'Application';
    _subscribeToEventListeners = () => {
        BackHandler.addEventListener(
            'hardwareBackPress',
            EventHandlers.hardwareBackPress,
        );
        dynamicLinks().onLink(this._handleOpenURL);

        if (!this.internetConnectivityStatusChangeListener) {
            this.internetConnectivityStatusChangeListener = NetInfo.addEventListener(
                EventHandlers.onInternetConnectivityStatusChange,
            );
        }

        if (!this.fcmTokenRefreshListener) {
            this.fcmTokenRefreshListener = firebaseMessaging().onTokenRefresh(
                EventHandlers.refreshFCMToken,
            );
        }

        if (!this.firebaseAuthStateChangedListener) {
            this.firebaseAuthStateChangedListener = firebaseAuth().onAuthStateChanged(
                EventHandlers.onFirebaseAuthStateChange,
            );
        }

        AppState.addEventListener('change', EventHandlers.onAppStateChange);

        if (!this.firebaseMessagingListener) {
            this.firebaseMessagingListener = firebaseMessaging().onMessage(
                EventHandlers.onFCMMessageReceived,
            );
        }

        if (!this.onNotificationOpenedAppLinstener) {
            this.onNotificationOpenedAppLinstener = firebaseMessaging().onNotificationOpenedApp(
                this._onNotificationOpenedAppInBackground,
            );
        }

        PushNotificationIOS.addEventListener(
            'notification',
            this.onIOSRemoteNotification,
        );
        PushNotificationIOS.addEventListener(
            'localNotification',
            this.onIOSLocalNotification,
        );
    };

    _onNotificationOpenedAppInBackground = message => {
        EventHandlers.onNotificationOpenedAppInBackground(message);
    };

    onIOSRemoteNotification = async () => {};

    onIOSLocalNotification = async () => {
        // console.log('===========LocalNotification', notif);
    };

    _checkForUnSupportedVersion = () => {
        if (
            compareVersions(
                DeviceInfo.getVersion(),
                getMinimumSupportedVersion(),
            ) === -1
        ) {
            Alert.alert(
                i18n.t('updateHeartsappPopup:title'),
                i18n.t('updateHeartsappPopup:description'),
            );
        }
    };

    initialize = async (dispatch, getState) => {
        initializeRemoteConfig();

        try {
            Orientation.lockToPortrait();
            NotificationService.configure();
            ServerReachabilityCheck.initialize(dispatch, getState);
            EventHandlers.initialize(dispatch, getState);
            SeekerMeditationSessionService.initialize(dispatch, getState);
            PreceptorSession.initialize(dispatch, getState);
            OnlineMetricsPoller.initialize(dispatch, getState);
            MeditationSessionCountService.initialize(dispatch, getState);
            UserLogoutHelper.initialize(dispatch, getState);
            LocationService.initialize(dispatch, getState);
            PreceptorStatusUpdateService.initialize(dispatch, getState);
            MasterClassFinishedDatesLoggingService.initialize(
                dispatch,
                getState,
            );
            configure();

            await this._loadUserDataFromLocalStorage(dispatch);
            operations.seekerMeditation.loadMeditateSessionConfigurationFromFirebase()(
                dispatch,
            );

            ServerReachabilityCheck.reloadFirebaseUserWhenOnline();
            ServerReachabilityCheck.refreshFCMTokenWhenOnline();
            ServerReachabilityCheck.refreshMeditationSessionCountWhenOnline();
            await this._determineServerConnectivityStatus();
            this._subscribeToEventListeners(dispatch, getState);
            ZeroPreceptorNotificationSubscriptionMachine.initialize(
                dispatch,
                getState,
            );
            MasterClassProgressService.initialize(dispatch, getState);
            MasterClassProgressMachine.initialize(dispatch, getState);
            this.loadMasterClassProgressData(dispatch);
            OfflineSittingDetailService.initialize(dispatch, getState);
            OfflineSittingDetailMachine.initialize(dispatch, getState);
            await this._navigateToLandingScreen(getState);
            await this.updateMeditationRemindersSettingsFromServer(
                dispatch,
                getState,
            );
            await this.subscribeToWeeklyInspirationIfRequired(
                dispatch,
                getState,
            );
            this.initialized = true;

            //initialNotification will not be empty when app is opened by tapping notification
            PushNotification.popInitialNotification(notification => {
                if (!isUndefined(notification) && !isEmpty(notification)) {
                    ApplicationEventHandlers.onNotificationOpenedAppInBackground(
                        notification,
                    );
                    log(this.TAG, 'initialize_1', {
                        notification,
                    });
                }
            });

            if (this.showPreceptorNeedAlertAfterInitializing) {
                this.showPreceptorsNeededAlert();
            }

            if (this.showZeroPreceptorsAlertAfterInitializing) {
                this.showZeroPreceptorsAlert();
            }

            if (IsAndroid) {
                const hasDNDPermissions = await hasDoNotDisturbPermission();

                if (!hasDNDPermissions) {
                    EventHandlers.showDNDPermissionsNeededAlert();
                }
                log(this.TAG, 'initialize_2', {
                    hasDNDPermissions,
                });
            }

            this._checkForUnSupportedVersion();

            const url = await dynamicLinks().getInitialLink();
            if (!isNil(url)) {
                this._handleOpenURL(url);
            }
            await deleteLogsOlderThan7Days();
        } catch (e) {
            Alert.alert(
                i18n.t('somethingWentWrongWhileInitializingAppPopup:title'),
                i18n.t(
                    'somethingWentWrongWhileInitializingAppPopup:description',
                ),
            );
            recordException(e);
            logExceptionOccurredWhileInitialization();
        }
    };
    loadMasterClassProgressData = dispatch => {
        operations.masterClassesProgress.load()(dispatch);
    };

    showPreceptorsNeededAlert() {
        this.showPreceptorNeedAlertAfterInitializing = false;

        if (this.initialized) {
            EventHandlers.showPreceptorNeededAlert();
        } else {
            this.showPreceptorNeedAlertAfterInitializing = true;
        }
    }

    showZeroPreceptorsAlert() {
        this.showZeroPreceptorsAlertAfterInitializing = false;

        if (this.initialized) {
            EventHandlers.showZeroPreceptorsAlert();
        } else {
            this.showZeroPreceptorsAlertAfterInitializing = true;
        }
    }

    _loadUserDataFromLocalStorage = async dispatch => {
        await StorageService.showHeartInTuneAppDownloadPopup.setValue(true);
        await StorageService.showHeartInTuneBanner.setValue(false);
        await operations.user.loadFromStorage()(dispatch);
        await operations.onboardingStatus.loadFromStorage()(dispatch);
        await operations.preceptorDashboard.loadFromStorage()(dispatch);
        await operations.preceptorMeditation.loadFromStorage()(dispatch);
        await operations.offlinePreceptorMeditationSession.loadFromStorage()(
            dispatch,
        );
        await MasterClassFinishedDatesLoggingService.load();
    };

    _determineServerConnectivityStatus = async () => {
        try {
            const connectionInfo = await NetInfo.fetch();
            await EventHandlers.onInternetConnectivityStatusChange(
                connectionInfo,
            );
        } catch (err) {
            onError(err, 'APP-DSCS');
        }
    };

    _navigateToLandingScreen = async getState => {
        const shouldCheckForOngoingSession =
            getState().onboardingStatus.onboardingFinished &&
            operations.user.isLoggedIn(getState());
        log(this.TAG, '_navigateToLandingScreen_1', {
            shouldCheckForOngoingSession,
        });
        const offlinePreceptorMeditationStartedTime = await StorageService.offlinePreceptorMeditationStartedTime.getValue();

        if (shouldCheckForOngoingSession) {
            if (offlinePreceptorMeditationStartedTime) {
                Actions.replace(Scenes.offlineMeditationSessionScreen);
                return;
            }
            const seekerSessionInStorage = await StorageService.getOngoingSeekerMeditationSession();
            if (seekerSessionInStorage) {
                StorageService.clearOngoingSeekerMeditationSession();
                Actions.replace(Scenes.home);
                if (this._shouldNavigateToMasterClass(getState)) {
                    MasterClassProgressService.start();
                    Actions.replace(Scenes.masterClassesScreen);
                    return;
                } else {
                    Actions.replace(Scenes.home);
                }
            }
            if (getState().deviceState.isApplicationServerReachable) {
                const connectedToSession = await this.checkAndConnectToOngoingMeditationSession(
                    getState,
                );
                log(this.TAG, '_navigateToLandingScreen_2', {
                    connectedToSession,
                    seekerSessionInStorage,
                });
                if (connectedToSession) {
                    return;
                }
            } else {
                ServerReachabilityCheck.checkForOngoingSessionWhenOnline();
                log(this.TAG, '_navigateToLandingScreen_3', {
                    checkForOngoingSessionWhenOnline: true,
                });
            }
        }
        await wait(500);
        if (this._shouldNavigateToMasterClass(getState)) {
            MasterClassProgressService.start();
            Actions.replace(Scenes.masterClassesScreen);
        } else {
            Actions.replace(getState().onboardingStatus.landingScene);
        }
    };

    _shouldNavigateToMasterClass = getState => {
        const masterClassesFinishedDates = get(
            getState(),
            'masterClassesProgress.masterClassesFinishedDates',
        );
        const unlockState = operations.masterClassesProgress.getUnLocked(
            getState(),
        );
        const hasTakenIntroductorySittings = operations.user.hasTakenIntroductorySittings(
            getState(),
        );

        return (
            (!hasTakenIntroductorySittings &&
                (unlockState.day2 &&
                    isNull(masterClassesFinishedDates.day2))) ||
            (unlockState.day3 &&
                isNull(masterClassesFinishedDates.day3) &&
                unlockState.day1)
        );
    };

    checkAndConnectToSessionInServer = async getState => {
        const meditationSession = await getExistingSessionByUser();

        const isMeditationInProgressInServer =
            !isEmpty(meditationSession.sessionId) &&
            isSessionInProgress(meditationSession.state);

        log(this.TAG, 'checkAndConnectToSessionInServer_1', {
            meditationSession,
            isMeditationInProgressInServer,
        });
        if (isMeditationInProgressInServer) {
            const isPreceptorSession =
                getState().user.firebaseUserInfo.uid ===
                meditationSession.preceptorId;
            if (isPreceptorSession) {
                await PreceptorSession.reconnectToSession();
            }
            return isPreceptorSession;
        }

        return false;
    };

    checkAndConnectToOngoingMeditationSession = async (
        getState,
        retryCount,
    ) => {
        const preceptorSessionInStorage = await StorageService.getOngoingMeditationSession();

        try {
            log(this.TAG, 'checkAndConnectToOngoingMeditationSession_1', {
                preceptorSessionInStorage,
            });
            if (!preceptorSessionInStorage) {
                // this.checkForOngoingSessionInProgress = false;
                return false;
            }

            const isConnectedToASession = await this.checkAndConnectToSessionInServer(
                getState,
            );

            if (isConnectedToASession) {
                const state = preceptorSessionInStorage.state;
                log(this.TAG, 'checkAndConnectToOngoingMeditationSession_2', {
                    preceptorSessionInStorage,
                    state,
                });
                // this.checkForOngoingSessionInProgress = false;
                return true;
            }

            const isPreceptor = operations.user.isPreceptor(getState());

            if (isPreceptor) {
                const isPreceptorAvailable = getState().preceptorDashboard
                    .available;

                if (isPreceptorAvailable) {
                    // Preceptor Session might be going on

                    if (preceptorSessionInStorage) {
                        const isMeditationInProgress =
                            !isEmpty(preceptorSessionInStorage.sessionId) &&
                            isSessionInProgress(
                                preceptorSessionInStorage.state,
                            );

                        if (isMeditationInProgress) {
                            PreceptorSession.onSessionComplete(
                                preceptorSessionInStorage,
                            );
                            await PreceptorSession.checkAvailabilityStatusAndSetReady();
                            // this.checkForOngoingSessionInProgress = false;
                            log(
                                this.TAG,
                                'checkAndConnectToOngoingMeditationSession_3',
                                {
                                    isMeditationInProgress,
                                    onSessionComplete: true,
                                    preceptorSessionInStorage,
                                },
                            );
                            return true;
                        }
                    }

                    await PreceptorSession.checkAvailabilityStatusAndSetReady();
                    return false; // Not connected to any session
                }
            }
        } catch (err) {
            // this.checkForOngoingSessionInProgress = false;
            const tmp = retryCount ? retryCount + 1 : 1;

            if (tmp <= 12) {
                setTimeout(() => {
                    ServerReachabilityCheck.checkForOngoingSessionWhenOnline(
                        tmp,
                    );
                    ServerReachabilityCheck.determineNetworkConnectivityStatus();
                    log(
                        this.TAG,
                        'checkAndConnectToOngoingMeditationSession_8',
                        {
                            retryCount: tmp,
                            checkForOngoingSessionWhenOnline: true,
                        },
                    );
                }, 5000);
            } else {
                onError(err, 'APP-CFOMS');
            }
        }

        // this.checkForOngoingSessionInProgress = false;
        return false;
    };

    _handleOpenURL = url => {
        if (this.initialized) {
            EventHandlers.handleOpenURL(url);
        }
    };

    subscribeToWeeklyInspirationIfRequired = async (dispatch, getState) => {
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        const isLoggedIn = operations.user.isLoggedIn(getState());
        if (!canDoNetworkCalls) {
            return;
        }

        let hasSubscribedToWeeklyInspirationNotification = await StorageService.hasSubscribedToWeeklyInspirationNotification.getValue();
        const shouldPlayGuidedRelaxationAudio = operations.user.shouldPlayGuidedRelaxation(
            getState(),
        );
        if (isLoggedIn) {
            const userPreferences = await getUserPreferences();
            hasSubscribedToWeeklyInspirationNotification = get(
                userPreferences,
                'isSubscribedToWeeklyInspiration.kind',
            );
        }
        const isSubscribedToWeeklyInspiration =
            isNil(hasSubscribedToWeeklyInspirationNotification) ||
            isEqual(hasSubscribedToWeeklyInspirationNotification, true);

        if (isSubscribedToWeeklyInspiration) {
            await subscribeToWeeklyInspirationNotification();
            await StorageService.hasSubscribedToWeeklyInspirationNotification.setValue(
                true,
            );
        } else {
            await unsubscribeFromWeeklyInspirationNotification();
        }

        operations.user.updateWeeklyInspirationNotificationSubscriptionStatus(
            isSubscribedToWeeklyInspiration,
        )(dispatch);

        const localAgeConsentTimeStamp = await StorageService.ageConsentTimeStamp.getValue();
        const meditationRemindersSettings = get(
            getState(),
            'user.meditationRemindersSettings',
        );

        if (isLoggedIn) {
            await saveUserPreferences({
                shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudio,
                language: i18n.language,
                isSubscribedToWeeklyInspiration,
                timeOfConsent: localAgeConsentTimeStamp,
                isMorningMeditationReminderEnabled:
                    meditationRemindersSettings.isMorningMeditationReminderEnabled,
                morningMeditationTime:
                    meditationRemindersSettings.morningMeditationTime,
                isEveningMeditationReminderEnabled:
                    meditationRemindersSettings.isEveningMeditationReminderEnabled,
                eveningCleaningTime:
                    meditationRemindersSettings.eveningCleaningTime,
                isReminderForNextSittingEnabled:
                    meditationRemindersSettings.isReminderForNextSittingEnabled,
                nextSittingReminderIntervalInDays:
                    meditationRemindersSettings.nextSittingReminderIntervalInDays,
            });
        }
    };

    updateMeditationRemindersSettingsFromServer = async (
        dispatch,
        getState,
    ) => {
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        const isLoggedIn = operations.user.isLoggedIn(getState());

        if (!canDoNetworkCalls) {
            return;
        }

        if (isLoggedIn) {
            const userPreferences = await getUserPreferences();

            const eveningCleaningTime = get(
                userPreferences,
                'eveningCleaningTime.seconds',
            );
            const morningMeditationTime = get(
                userPreferences,
                'morningMeditationTime.seconds',
            );
            const isEveningMeditationReminderEnabled = get(
                userPreferences,
                'isEveningMeditationReminderEnabled',
            );
            const isMorningMeditationReminderEnabled = get(
                userPreferences,
                'isMorningMeditationReminderEnabled',
            );
            const isReminderForNextSittingEnabled = get(
                userPreferences,
                'isReminderForNextSittingEnabled',
            );
            const nextSittingReminderIntervalInDays = get(
                userPreferences,
                'nextSittingReminderIntervalInDays',
            );

            if (
                !isUndefined(eveningCleaningTime) &&
                !isEqual(eveningCleaningTime, 0) &&
                !isUndefined(morningMeditationTime) &&
                !isEqual(morningMeditationTime, 0) &&
                !isUndefined(isEveningMeditationReminderEnabled) &&
                !isUndefined(isMorningMeditationReminderEnabled) &&
                !isUndefined(isReminderForNextSittingEnabled) &&
                !isEqual(nextSittingReminderIntervalInDays, 0) &&
                !isUndefined(nextSittingReminderIntervalInDays)
            ) {
                const remindersSettings = {
                    eveningCleaningTime: eveningCleaningTime,
                    morningMeditationTime: morningMeditationTime,
                    isEveningMeditationReminderEnabled: isEveningMeditationReminderEnabled,
                    isMorningMeditationReminderEnabled: isMorningMeditationReminderEnabled,
                    isReminderForNextSittingEnabled: isReminderForNextSittingEnabled,
                    nextSittingReminderIntervalInDays: nextSittingReminderIntervalInDays,
                };

                operations.user.setMeditationRemindersSettings(
                    remindersSettings,
                )(dispatch);
            }
        }
    };

    _unsubscribe = fn => {
        const unsubscriber = get(this, fn);

        if (unsubscriber) {
            unsubscriber();
            set(this, fn, undefined);
        }
    };

    cleanup = () => {
        BackHandler.removeEventListener(
            'hardwareBackPress',
            EventHandlers.hardwareBackPress,
        );

        PushNotificationIOS.removeEventListener(
            'notification',
            this.onIOSRemoteNotification,
        );
        PushNotificationIOS.removeEventListener(
            'localNotification',
            this.onIOSLocalNotification,
        );

        AppState.removeListener('change', EventHandlers.onAppStateChange);

        this._unsubscribe('internetConnectivityStatusChangeListener');
        this._unsubscribe('firebaseAuthStateChangedListener');
        this._unsubscribe('firebaseMessagingListener');
        this._unsubscribe('fcmTokenRefreshListener');
        this._unsubscribe('notificationListener');
        this._unsubscribe('onNotificationOpenedAppLinstener');
        PreceptorSession.cleanup();
        OnlineMetricsPoller.stop();
    };
}

export default new Application();
