import {
    registerFCMTokenAndDeviceDetails,
    saveUserPreferences,
} from './grpc/ProfileService';
import {
    isNil,
    isEqual,
    isUndefined,
    includes,
    isEmpty,
    get,
    endsWith,
} from 'lodash';
import { operations } from '../state';
import { onError } from '../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from './ServerReachabilityCheckService';
import NotificationService from '../services/NotificationService';
import {
    DEEP_LINK_HOST,
    NOTIFICATION_CHANNEL_ID,
    NotificationCategory,
    NotificationSubCategory,
    Scenes,
    BASIC_PRACTICES_VIDEOS,
    MASTERCLASS_VIDEOS,
} from '../shared/Constants';
import { isAppInBackground } from '../shared/Constants';
import { Alert, InteractionManager } from 'react-native';
import Application from './Application';
import PreceptorSession from './meditation/PreceptorSession';
import { updatePreceptorDNDStatus } from './grpc/MeditationService';
import { handleGoBack } from './BackButtonService';
import i18n from 'i18next';
import { requestDoNotDisturbPermission } from './native/DoNotDisturbService';
import { logEvent, setUserIdForAnalytics } from './firebase/AnalyticsService';
import { setUserIdForCrashlytics } from './firebase/CrashlyticsService';
import UserLogoutHelper from './UserLogoutHelper';
import { Actions } from 'react-native-router-flux';
import { service as seekerMeditationSessionService } from './meditation/SeekerMeditationSession';
import URL from 'url';
import { subscribeToWeeklyInspirationNotification } from './firebase/MessagingService';
import StorageService from './native/AppStorageService';
import { log } from './DiagnosticLogService';
import MasterClassProgressService from './MasterClassProgressService';
import MeditationSessionCountService from './meditation/MeditationSessionCountService';

class ApplicationEventHandlers {
    TAG = 'ApplicationEventHandlers';
    _exec = operation => {
        operation(this.dispatch, this.getState);
    };

    hardwareBackPress = () => {
        this._exec(handleGoBack);
        return true;
    };
    handleOpenURL = async options => {
        const url = options.url;
        if (isNil(url)) {
            return;
        }
        const urlParse = URL.parse(url);
        const host = urlParse.host;
        if (isNil(host) || isEmpty(host)) {
            return;
        }
        if (endsWith(host, DEEP_LINK_HOST.MAGAZINE)) {
            const hasUserSubscribedToWeeklyInspirationNotification = operations.user.hasUserSubscribedToWeeklyInspirationNotification(
                this.getState(),
            );
            const shouldPlayGuidedRelaxationAudio = operations.user.shouldPlayGuidedRelaxation(
                this.getState(),
            );
            const isLoggedIn = operations.user.isLoggedIn(this.getState());
            const isAnonymous = operations.user.isAnonymous(this.getState());
            const localAgeConsentTimeStamp = await StorageService.ageConsentTimeStamp.getValue();
            const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
            const meditationRemindersSettings = get(
                this.getState(),
                'user.meditationRemindersSettings',
            );

            if (
                !hasUserSubscribedToWeeklyInspirationNotification &&
                canDoNetworkCalls
            ) {
                await subscribeToWeeklyInspirationNotification();
                if (isLoggedIn) {
                    await saveUserPreferences({
                        shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudio,
                        language: i18n.language,
                        isSubscribedToWeeklyInspiration: true,
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
                await StorageService.hasSubscribedToWeeklyInspirationNotification.setValue(
                    true,
                );
                operations.user.updateWeeklyInspirationNotificationSubscriptionStatus(
                    true,
                )(this.dispatch);
            }
            this._pauseVideoIfPlaying();
            InteractionManager.runAfterInteractions(() => {
                const isUserPreceptor = operations.user.isPreceptor(
                    this.getState(),
                );
                const eventName = isUserPreceptor
                    ? 'preceptor_weekly_inspiration'
                    : 'seeker_weekly_inspiration';
                logEvent(eventName);
                if (isEqual(Actions.currentScene, Scenes.weeklyInspiration)) {
                    Actions.refresh({
                        showSubscriptionSuccess:
                            !hasUserSubscribedToWeeklyInspirationNotification &&
                            (isLoggedIn && !isAnonymous),
                    });
                } else {
                    Actions.push(Scenes.weeklyInspiration, {
                        showSubscriptionSuccess:
                            !hasUserSubscribedToWeeklyInspirationNotification &&
                            (isLoggedIn && !isAnonymous),
                    });
                }
            });
        }
    };

    _pauseVideoIfPlaying = () => {
        if (
            includes(
                [
                    Scenes.lifeStyleScreen,
                    Scenes.masterClassesScreen,
                    Scenes.basicPracticesScreen,
                ],
                Actions.currentScene,
            )
        ) {
            operations.player.setVideoPause(true)(this.dispatch);
        }
    };
    onInternetConnectivityStatusChange = async state => {
        const isOnline = state.isConnected && state.isInternetReachable;
        this._exec(operations.deviceState.setConnectedToNetwork(isOnline));
        await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    };

    onFirebaseAuthStateChange = async userInfo => {
        if (operations.user.isLoggedIn(this.getState()) && isNil(userInfo)) {
            UserLogoutHelper.onSessionExpire();
            return;
        }

        this._exec(operations.user.setAuthenticationInfo(userInfo));

        if (!isNil(userInfo)) {
            setUserIdForCrashlytics(userInfo.uid);
            setUserIdForAnalytics(userInfo.uid);
        }

        if (!isNil(userInfo) && !this.isRefreshingFCMToken) {
            this.isRefreshingFCMToken = true;
            await this.refreshFCMToken();
            this.isRefreshingFCMToken = false;
        }
    };
    onNotificationOpenedAppInBackground = message => {
        const category = get(message, 'data.category');
        const subCategory = get(message, 'data.categorySubType');
        if (
            isEqual(category, NotificationCategory.SCHEDULED_CONTENT_SERVICE) &&
            isEqual(
                subCategory,
                NotificationSubCategory.MORNING_MEDITATION_REMINDER_SUBCATEGORY,
            )
        ) {
            this._navigateToBasicPracticesScreen(
                BASIC_PRACTICES_VIDEOS.MEDITATION,
            );
            logEvent('reminders_morning_notification_open');
        }
        if (
            isEqual(category, NotificationCategory.SCHEDULED_CONTENT_SERVICE) &&
            isEqual(
                subCategory,
                NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
            )
        ) {
            this._navigateToBasicPracticesScreen(
                BASIC_PRACTICES_VIDEOS.CLEANING,
            );
            logEvent('reminders_evening_notification_open');
        }
        if (
            isEqual(category, NotificationCategory.SCHEDULED_CONTENT_SERVICE) &&
            isEqual(
                subCategory,
                NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
            )
        ) {
            InteractionManager.runAfterInteractions(async () => {
                if (
                    !includes(
                        [
                            Scenes.additionalAbhyasisMeditatingInputScreen,
                            Scenes.seekerMeditationSession,
                            Scenes.seekerMeditationCancellationReasonScreen,
                            Scenes.preceptorMeditationSession,
                        ],
                        Actions.currentScene,
                    )
                ) {
                    logEvent('reminders_medwithTrainer_notification_open');
                    const takenIntroductorySittings = operations.user.hasTakenIntroductorySittings(
                        this.getState(),
                    );
                    const localAgeConsentTimeStamp = await StorageService.ageConsentTimeStamp.getValue();
                    const isUserPreceptor = operations.user.isPreceptor(
                        this.getState(),
                    );
                    const isAvailableForSitting = get(
                        this.getState(),
                        'preceptorDashboard.available',
                    );

                    if (
                        isUndefined(localAgeConsentTimeStamp) ||
                        (isUserPreceptor && isAvailableForSitting)
                    ) {
                        operations.seekerMeditation.setShouldRequestForMeditationWithTrainerSession(
                            true,
                        )(this.dispatch);
                        Actions.jump(Scenes.home);
                    } else if (takenIntroductorySittings) {
                        Actions.push(Scenes.benefitsOfMeditatingWithTrainer);
                    } else {
                        Actions.push(
                            Scenes.introSittingCompletionEnquiryScreen,
                        );
                    }
                }
            });
        }
        if (
            isEqual(category, NotificationCategory.SCHEDULED_CONTENT_SERVICE) &&
            isEqual(
                subCategory,
                NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
            )
        ) {
            const masterClasses = get(message, 'data.masterClasses');

            if (!isEqual(Actions.currentScene, Scenes.masterClassesScreen)) {
                MasterClassProgressService.start(Actions.currentScene);
                Actions.push(Scenes.masterClassesScreen);
            } else {
                MasterClassProgressService.start();
            }
            if (isEqual(masterClasses, MASTERCLASS_VIDEOS.DAY2)) {
                MasterClassProgressService.goToDay2();
            } else if (isEqual(masterClasses, MASTERCLASS_VIDEOS.DAY3)) {
                MasterClassProgressService.goToDay3();
            }
        }
        if (isEqual(category, NotificationCategory.SCHEDULED_CONTENT_SERVICE)) {
            if (
                isEqual(
                    subCategory,
                    NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                )
            ) {
                this._pauseVideoIfPlaying();

                InteractionManager.runAfterInteractions(() => {
                    if (
                        !isEqual(Actions.currentScene, Scenes.weeklyInspiration)
                    ) {
                        Actions.push(Scenes.weeklyInspiration);
                    } else {
                        Actions.refresh({});
                    }
                });
            }
        } else if (isEqual(category, NotificationCategory.MEDITATION_SERVICE)) {
            this._handleMeditationServiceNotification(message, true);
        }
    };
    _navigateToBasicPracticesScreen = cardToBeExpanded => {
        InteractionManager.runAfterInteractions(() => {
            if (isEqual(Actions.currentScene, Scenes.basicPracticesScreen)) {
                Actions.refresh({
                    cardToBeExpanded,
                });
            } else {
                Actions.push(Scenes.basicPracticesScreen, {
                    cardToBeExpanded,
                });
            }
        });
    };
    onFCMMessageReceived = async (message, doNotShowLocalNotification) => {
        // console.log('onFCMMessageReceived', JSON.stringify(message));
        const category = get(message, 'data.category');
        const subCategory = get(message, 'data.categorySubType');

        seekerMeditationSessionService.onNotificationReceived(
            category,
            subCategory,
            message,
        );

        log(this.TAG, 'onFCMMessageReceived_1', {
            category,
            doNotShowLocalNotification,
            isAppInBackground: isAppInBackground(),
        });
        const categorySubType = get(message, 'data.categorySubType');
        if (category === NotificationCategory.MEDITATION_SERVICE) {
            await this._handleMeditationServiceNotification(
                message,
                doNotShowLocalNotification,
            );
        } else {
            NotificationService.localNotification({
                channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
                title: message.data.title,
                message: message.data.body,
                playSound: false,
                soundName: 'default',
                userInfo: { category, categorySubType },
            });
        }
    };

    _handleMeditationServiceNotification = async (
        message,
        doNotShowLocalNotification,
    ) => {
        const subCategory = get(message, 'data.categorySubType');
        const notification = {
            channelId: NOTIFICATION_CHANNEL_ID.SILENT_NOTIFICATION,
            title: message.data.title,
            message: message.data.body,
            playSound: false,
            soundName: 'default',
        };
        if (subCategory === NotificationSubCategory.LOW_PRECEPTOR_CONDITION) {
            if (!isAppInBackground()) {
                Application.showPreceptorsNeededAlert();
                return;
            }
        }

        if (subCategory === NotificationSubCategory.ZERO_PRECEPTOR_CONDITION) {
            if (!isAppInBackground()) {
                Application.showZeroPreceptorsAlert();
                return;
            }
        }

        if (isAppInBackground()) {
            notification.playSound = true;

            switch (subCategory) {
                case NotificationSubCategory.IN_PROGRESS:
                case NotificationSubCategory.IN_PROGRESS_BATCH:
                case NotificationSubCategory.MASTER_SITTING:
                    notification.soundName = 'psm_m.mp3';
                    notification.channelId =
                        NOTIFICATION_CHANNEL_ID.MEDITATION_START;
                    break;

                case NotificationSubCategory.BATCH_MEDITATION_COMPLETED:
                case NotificationSubCategory.MEDITATION_COMPLETED:
                case NotificationSubCategory.IN_PROGRESS_TIMED_OUT:
                    notification.soundName = 'tha_m.mp3';
                    notification.channelId =
                        NOTIFICATION_CHANNEL_ID.MEDITATION_END;
                    break;

                case NotificationSubCategory.WAITING_FOR_PRECEPTOR_TO_START_BATCH:
                case NotificationSubCategory.WAITING_FOR_PRECEPTOR_TO_START:
                    notification.soundName = 'apple_ring.mp3';
                    notification.channelId =
                        NOTIFICATION_CHANNEL_ID.TRAINER_INCOMING_SESSION;
                    break;

                case NotificationSubCategory.LOW_PRECEPTOR_CONDITION:
                    notification.soundName = 'default';
                    notification.userInfo = {
                        isPreceptorNeededNotification: true,
                    };
                    break;

                case NotificationSubCategory.ZERO_PRECEPTOR_CONDITION:
                    notification.soundName = 'default';
                    notification.userInfo = {
                        isZeroPreceptorNotification: true,
                    };
                    break;

                default:
                    notification.soundName = 'default';
            }
        }

        if (
            !isNil(this.getState) &&
            !isUndefined(this.getState) &&
            operations.user.shouldPlayGuidedRelaxation(this.getState()) &&
            includes(
                [
                    NotificationSubCategory.IN_PROGRESS,
                    NotificationSubCategory.IN_PROGRESS_BATCH,
                    NotificationSubCategory.MASTER_SITTING,
                ],
                subCategory,
            )
        ) {
            notification.channelId =
                NOTIFICATION_CHANNEL_ID.SILENT_NOTIFICATION;
            notification.playSound = false;
        }

        if (!doNotShowLocalNotification) {
            NotificationService.localNotification(notification);
        }
        log(this.TAG, '_handleMeditationServiceNotification', {
            subCategory,
            notificationPlaySound: notification.playSound,
            isAppInBackground: isAppInBackground(),
        });
    };

    onAppStateChange = async () => {
        if (!isAppInBackground()) {
            // ServerReachabilityCheck.checkForOngoingSessionWhenOnline();
            // ServerReachabilityCheck.determineNetworkConnectivityStatus();
        }
    };

    refreshFCMToken = async fcmToken => {
        const state = this.getState();
        const onlineAuthenticatedUser =
            state.deviceState.isApplicationServerReachable &&
            operations.user.isLoggedIn(state);

        if (onlineAuthenticatedUser) {
            try {
                await registerFCMTokenAndDeviceDetails(fcmToken);
            } catch (err) {
                onError(err, 'AEH-OFTR');
            }
        }
    };

    initialize = async (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };

    _makeMeAvailable = async () => {
        const canConnectToNetwork = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        const UPDATE_STATUS_ON_SERVER = true;
        const UPDATE_STATUS_IN_DASHBOARD = true;

        if (canConnectToNetwork) {
            await PreceptorSession.setReady(
                UPDATE_STATUS_ON_SERVER,
                UPDATE_STATUS_IN_DASHBOARD,
            );
        } else {
            Alert.alert(
                'Could not connect to server',
                'Could not connect to server',
            );
        }
    };

    _snoozeFor6Hours = () => {
        this._doNotDisturb(6);
    };

    _snoozeFor24Hours = () => {
        this._doNotDisturb(24);
    };

    _doNotDisturb = async timeInHours => {
        const canConnectToNetwork = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

        if (canConnectToNetwork) {
            await updatePreceptorDNDStatus(timeInHours * 60 * 60);
        } else {
            Alert.alert(
                'Could not connect to server',
                'Could not connect to server',
            );
        }
    };

    isNotMeditationScene = () => {
        const scene = Actions.currentScene;
        return !(
            isEqual(scene, Scenes.preceptorMeditationSession) ||
            isEqual(scene, Scenes.seekerMeditationSession)
        );
    };

    showZeroPreceptorsAlert = async () => {
        if (
            operations.user.isPreceptor(this.getState()) &&
            this.isNotMeditationScene()
        ) {
            NotificationService.cancelAll();
            Alert.alert(
                i18n.t('zeroPreceptorsPopup:title'),
                i18n.t('zeroPreceptorsPopup:description'),
                [
                    {
                        text: i18n.t('zeroPreceptorsPopup:makeMeAvailable'),
                        onPress: this._makeMeAvailable,
                    },
                    {
                        text: i18n.t('zeroPreceptorsPopup:cancel'),
                    },
                ],
                { cancelable: false },
            );
            log(this.TAG, 'showZeroPreceptorsAlert', {
                notification: 'cancelled',
            });
            logEvent('preceptor_zeropreceptor_notification');
        }
    };

    showPreceptorNeededAlert = async () => {
        if (
            operations.user.isPreceptor(this.getState()) &&
            this.isNotMeditationScene()
        ) {
            NotificationService.cancelAll();
            Alert.alert(
                i18n.t('preceptorsNeededPopup:title'),
                i18n.t('preceptorsNeededPopup:description'),
                [
                    {
                        text: i18n.t('preceptorsNeededPopup:snooze', {
                            hours: '24',
                        }),
                        onPress: this._snoozeFor24Hours,
                    },
                    {
                        text: i18n.t('preceptorsNeededPopup:snooze', {
                            hours: '6',
                        }),
                        onPress: this._snoozeFor6Hours,
                    },
                    {
                        text: i18n.t('preceptorsNeededPopup:makeMeAvailable'),
                        onPress: this._makeMeAvailable,
                    },
                ],
                { cancelable: false },
            );
            log(this.TAG, 'showPreceptorNeededAlert', {
                notification: 'cancelled',
            });
        }
    };

    showDNDPermissionsNeededAlert = async () => {
        Alert.alert(
            i18n.t('dndPermissionsNeededPopup:title'),
            i18n.t('dndPermissionsNeededPopup:description'),
            [
                {
                    text: i18n.t('dndPermissionsNeededPopup:allow'),
                    onPress: requestDoNotDisturbPermission,
                },
                {
                    text: i18n.t('dndPermissionsNeededPopup:doNotAllow'),
                    onPress: () => {},
                },
            ],
            { cancelable: false },
        );
    };
    populateSittingCount = async () => {
        const state = this.getState();
        const onlineAuthenticatedUser =
            state.deviceState.isApplicationServerReachable &&
            operations.user.isLoggedIn(state);
        if (onlineAuthenticatedUser) {
            const isUserPreceptor = operations.user.isPreceptor(state);
            if (isUserPreceptor) {
                await MeditationSessionCountService.updateCountOfSittingsGivenOutsideHeartsApp();
            }
            await MeditationSessionCountService.updateCountOfSittingsTaken();
        }
    };
}

export default new ApplicationEventHandlers();
