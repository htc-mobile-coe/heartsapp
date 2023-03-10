import ApplicationEventHandlers from './ApplicationEventHandlers';
import { Actions } from 'react-native-router-flux';
import { InteractionManager } from 'react-native';
import {
    AbhyasStage,
    MASTERCLASS_VIDEOS,
    NotificationCategory,
    NotificationSubCategory,
    Scenes,
} from '../shared/Constants';
import * as MessagingService from './firebase/MessagingService';
import ServerReachabilityCheck from './ServerReachabilityCheckService';
import * as ProfileService from './grpc/ProfileService';
import NotificationService from './NotificationService';
import * as DiagnosticLogService from './DiagnosticLogService';
import AppStorageService from './native/AppStorageService';
import { runAllPromises, spyOnProperty } from '../utils/TestUtils';
import moment from 'moment';
import * as PlayerOperation from '../state/player/operations';
import * as SeekerMeditationOperation from '../state/seekerMeditation/operations';
import * as UserOperation from '../state/user/operations';
import MasterClassProgressService from './MasterClassProgressService';
import MeditationSessionCountService from './meditation/MeditationSessionCountService';

describe('ApplicationEventHandlers', () => {
    const dispatchMock = jest.fn();
    let getStateMock;
    let determineNetworkConnectivityStatusMock;
    let ageConsentTimeStampGetMock;
    let isPlayingGuidedRelaxationMock;
    let hasTakenIntroductorySittingsMock;

    const actionsPushMock = jest
        .spyOn(Actions, 'push')
        .mockImplementation(() => ({}));
    const actionsJumpMock = jest
        .spyOn(Actions, 'jump')
        .mockImplementation(() => ({}));
    const actionsRefreshMock = jest
        .spyOn(Actions, 'refresh')
        .mockImplementation(() => ({}));
    const subscribeToWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'subscribeToWeeklyInspirationNotification')
        .mockImplementation(() => ({}));
    const localNotificationMock = jest
        .spyOn(NotificationService, 'localNotification')
        .mockImplementation(() => ({}));
    const runAfterInteractionsMock = jest
        .spyOn(InteractionManager, 'runAfterInteractions')
        .mockImplementation(callback => callback());
    const saveUserPreferencesMock = jest
        .spyOn(ProfileService, 'saveUserPreferences')
        .mockImplementation(() => {});
    const logsMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});
    const setVideoPauseMock = jest
        .spyOn(PlayerOperation, 'setVideoPause')
        .mockImplementation(() => jest.fn());
    const setShouldRequestForMeditationWithTrainerSessionMock = jest
        .spyOn(
            SeekerMeditationOperation,
            'setShouldRequestForMeditationWithTrainerSession',
        )
        .mockImplementation(() => jest.fn());
    const updateCountOfSittingsTakenMock = jest
        .spyOn(MeditationSessionCountService, 'updateCountOfSittingsTaken')
        .mockImplementation(() => {});
    const updateCountOfSittingsGivenOutsideHeartsAppMock = jest
        .spyOn(
            MeditationSessionCountService,
            'updateCountOfSittingsGivenOutsideHeartsApp',
        )
        .mockImplementation(() => {});
    const masterClassProgressServiceMock = jest
        .spyOn(MasterClassProgressService, 'start')
        .mockImplementation(() => {});
    const goToDay2Mock = jest
        .spyOn(MasterClassProgressService, 'goToDay2')
        .mockImplementation(() => {});
    const goToDay3Mock = jest
        .spyOn(MasterClassProgressService, 'goToDay3')
        .mockImplementation(() => {});
    const prepareInitialize = (state, internet = true) => {
        getStateMock = jest.fn().mockImplementation(() => state);
        ApplicationEventHandlers.initialize(dispatchMock, getStateMock);
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(internet);
            });
    };
    const prepareHasTakenIntroductorySittings = state => {
        hasTakenIntroductorySittingsMock = jest
            .spyOn(UserOperation, 'hasTakenIntroductorySittings')
            .mockImplementation(() => {
                return state;
            });
    };

    afterEach(() => {
        logsMock.mockClear();
        dispatchMock.mockClear();
        masterClassProgressServiceMock.mockClear();
        goToDay2Mock.mockClear();
        goToDay3Mock.mockClear();
        saveUserPreferencesMock.mockClear();
        localNotificationMock.mockClear();
        actionsPushMock.mockClear();
        actionsJumpMock.mockClear();
        actionsRefreshMock.mockClear();
        runAfterInteractionsMock.mockClear();
        subscribeToWeeklyInspirationNotificationMock.mockClear();
        setVideoPauseMock.mockClear();
        setShouldRequestForMeditationWithTrainerSessionMock.mockClear();
        updateCountOfSittingsTakenMock.mockClear();
        updateCountOfSittingsGivenOutsideHeartsAppMock.mockClear();
        if (getStateMock) {
            getStateMock.mockClear();
            getStateMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (ageConsentTimeStampGetMock) {
            ageConsentTimeStampGetMock.mockClear();
            ageConsentTimeStampGetMock = undefined;
        }
        if (isPlayingGuidedRelaxationMock) {
            isPlayingGuidedRelaxationMock.mockClear();
            isPlayingGuidedRelaxationMock = undefined;
        }
        if (hasTakenIntroductorySittingsMock) {
            hasTakenIntroductorySittingsMock.mockClear();
            hasTakenIntroductorySittingsMock = undefined;
        }
        Actions.currentScene = undefined;
    });

    describe('#handleOpenURL', () => {
        const timeStampValue = moment().unix();
        const prepareAgeConsentTimeStamp = () => {
            ageConsentTimeStampGetMock = jest
                .fn()
                .mockImplementation(() => timeStampValue);
            spyOnProperty(AppStorageService, 'ageConsentTimeStamp', {
                getValue: ageConsentTimeStampGetMock,
            });
        };

        it('should not able to navigate WeeklyInspiration screen. when url path is undefined', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: false,
                },
            });
            await ApplicationEventHandlers.handleOpenURL({
                url: undefined,
            });
            expect(
                subscribeToWeeklyInspirationNotificationMock,
            ).not.toBeCalled();
            expect(actionsPushMock).not.toBeCalled();
        });

        it('should able to navigate weekly inspiration screen and subscribe Notification topic. when url host is heartfulnessmagazine', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: false,
                    shouldPlayGuidedRelaxationAudio: false,
                    authenticated: true,
                    hfnProfile: { anonymous: false },
                    meditationRemindersSettings: {
                        eveningCleaningTime: 68700,
                        isEveningMeditationReminderEnabled: true,
                        isMorningMeditationReminderEnabled: true,
                        morningMeditationTime: 33240,
                        isReminderForNextSittingEnabled: true,
                        nextSittingReminderIntervalInDays: 3,
                    },
                },
            });
            prepareAgeConsentTimeStamp();
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'https://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration, {
                showSubscriptionSuccess: true,
            });
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
            expect(ageConsentTimeStampGetMock).toBeCalled();
            expect(saveUserPreferencesMock).toBeCalledWith({
                shouldPlayRelaxationAudioBeforeMeditation: false,
                isSubscribedToWeeklyInspiration: true,
                language: undefined,
                timeOfConsent: timeStampValue,
                eveningCleaningTime: 68700,
                isEveningMeditationReminderEnabled: true,
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 33240,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            });
        });
        it('should able to refresh weekly inspiration screen and subscribe Notification topic, when current screen is weekly inspiration and url host is heartfulnessmagazine', async () => {
            Actions.currentScene = Scenes.weeklyInspiration;
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: false,
                    shouldPlayGuidedRelaxationAudio: false,
                    authenticated: true,
                    hfnProfile: { anonymous: false },
                    meditationRemindersSettings: {
                        eveningCleaningTime: 68700,
                        isEveningMeditationReminderEnabled: true,
                        isMorningMeditationReminderEnabled: true,
                        morningMeditationTime: 33240,
                        isReminderForNextSittingEnabled: true,
                        nextSittingReminderIntervalInDays: 3,
                    },
                },
            });
            prepareAgeConsentTimeStamp();
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'https://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(actionsRefreshMock).toBeCalledWith({
                showSubscriptionSuccess: true,
            });
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
            expect(ageConsentTimeStampGetMock).toBeCalled();
            expect(saveUserPreferencesMock).toBeCalledWith({
                shouldPlayRelaxationAudioBeforeMeditation: false,
                isSubscribedToWeeklyInspiration: true,
                language: undefined,
                timeOfConsent: timeStampValue,
                eveningCleaningTime: 68700,
                isEveningMeditationReminderEnabled: true,
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 33240,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 3,
            });
        });
        it('should able to navigate weekly inspiration screen and subscribe Notification topic. when url host is heartfulnessmagazine and user not logged-in', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: false,
                    shouldPlayGuidedRelaxationAudio: false,
                },
            });
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'https://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration, {
                showSubscriptionSuccess: false,
            });
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
            expect(saveUserPreferencesMock).not.toBeCalled();
        });

        it('should able to navigate weekly inspiration screen. when url is heartsapp://heartfulnessmagazine.com', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: true,
                    hfnProfile: { anonymous: false },
                },
            });
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'heartsapp://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration, {
                showSubscriptionSuccess: false,
            });
            expect(
                subscribeToWeeklyInspirationNotificationMock,
            ).not.toBeCalled();
        });

        it('should able to lifeStyle refresh Screen . when url is https://heartfulnessmagazine.com', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: true,
                    hfnProfile: { anonymous: false },
                },
            });
            Actions.currentScene = Scenes.lifeStyleScreen;
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'https://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(setVideoPauseMock).toBeCalledWith(true);
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration, {
                showSubscriptionSuccess: false,
            });
            expect(
                subscribeToWeeklyInspirationNotificationMock,
            ).not.toBeCalled();
        });

        it('should able to masterClass refresh Screen . when url is https://heartfulnessmagazine.com', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: true,
                    hfnProfile: { anonymous: false },
                },
            });
            Actions.currentScene = Scenes.masterClassesScreen;
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'https://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(setVideoPauseMock).toBeCalledWith(true);
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration, {
                showSubscriptionSuccess: false,
            });
            expect(
                subscribeToWeeklyInspirationNotificationMock,
            ).not.toBeCalled();
        });

        it('should able to basic Practices refresh Screen . when url is https://heartfulnessmagazine.com', async () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: true,
                    hfnProfile: { anonymous: false },
                },
            });
            Actions.currentScene = Scenes.basicPracticesScreen;
            await ApplicationEventHandlers.handleOpenURL({
                url:
                    'https://writeoldmag.heartfulnessmagazine.com/weekly-inspiration',
            });
            expect(setVideoPauseMock).toBeCalledWith(true);
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration, {
                showSubscriptionSuccess: false,
            });
            expect(
                subscribeToWeeklyInspirationNotificationMock,
            ).not.toBeCalled();
        });

        it('should be skip the navigate. when url path is invalid', () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: true,
                },
            });
            ApplicationEventHandlers.handleOpenURL({
                url: 'heartsapp://mock-path',
            });
            expect(actionsPushMock).not.toBeCalled();
            expect(
                subscribeToWeeklyInspirationNotificationMock,
            ).not.toBeCalled();
        });

        it('should be skip the navigate. when url is not matched url host empty with app schema', () => {
            prepareInitialize({
                user: {
                    isWeeklyInspirationNotificationSubscribed: true,
                },
            });
            ApplicationEventHandlers.handleOpenURL({
                url: 'heartsapp://',
            });
            expect(actionsPushMock).not.toBeCalled();
        });
    });
    describe('#onNotificationOpenedAppInBackground', () => {
        prepareHasTakenIntroductorySittings();
        const prepareNotificationOpenedAppInBackground = (
            notification,
            timeStampValue,
            getStateValue = {},
        ) => {
            getStateMock = jest.fn().mockImplementation(() => getStateValue);
            ageConsentTimeStampGetMock = jest
                .fn()
                .mockImplementation(() => timeStampValue);
            spyOnProperty(AppStorageService, 'ageConsentTimeStamp', {
                getValue: ageConsentTimeStampGetMock,
            });
            ApplicationEventHandlers.initialize(dispatchMock, getStateMock);
            ApplicationEventHandlers.onNotificationOpenedAppInBackground(
                notification,
            );
        };
        it('should able to navigate weekly inspiration screen', () => {
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                },
            });
            expect(actionsPushMock).toBeCalledWith(Scenes.weeklyInspiration);
        });
        it('should able to refresh weekly inspiration screen, when notification received from foreground', async () => {
            Actions.currentScene = Scenes.weeklyInspiration;
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                },
            });
            expect(actionsRefreshMock).toBeCalledWith({});
        });
        it('should able to refresh lifeStyle screen, when open or press notification', async () => {
            Actions.currentScene = Scenes.lifeStyleScreen;
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                },
            });
            expect(setVideoPauseMock).toBeCalledWith(true);
        });
        it('should able to refresh newbieMaster screen, when open or press notification', async () => {
            Actions.currentScene = Scenes.masterClassesScreen;
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                },
            });
            expect(setVideoPauseMock).toBeCalledWith(true);
        });
        it('should able to refresh basicPractices screen, when open or press notification', async () => {
            Actions.currentScene = Scenes.basicPracticesScreen;
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                },
            });
            expect(setVideoPauseMock).toBeCalledWith(true);
        });
        it('should not able to navigate weekly inspiration screen, when categorySubType is unknown', () => {
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType: 'unknown',
                },
            });
            expect(actionsPushMock).not.toBeCalled();
        });
        it('should not able to navigate weekly inspiration screen, when meditate categorySubType is unknown', () => {
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.MEDITATION_SERVICE,
                    categorySubType: 'unknown',
                },
            });
            expect(actionsPushMock).not.toBeCalled();
        });
        it('should not able to navigate weekly inspiration screen, when notification dont have category', () => {
            prepareNotificationOpenedAppInBackground({
                data: {},
            });
            expect(actionsPushMock).not.toBeCalled();
        });
        it('Should able to navigate to Guided practices screen, when categorySubType is morning reminder', () => {
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MORNING_MEDITATION_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsPushMock).toBeCalledWith(
                Scenes.basicPracticesScreen,
                {
                    cardToBeExpanded: 'MEDITATION',
                },
            );
        });
        it('Should able to refresh to Guided practices screen, when categorySubType is morning reminder and current screen basicPracticesScreen', () => {
            Actions.currentScene = Scenes.basicPracticesScreen;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MORNING_MEDITATION_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsRefreshMock).toBeCalledWith({
                cardToBeExpanded: 'MEDITATION',
            });
        });
        it('Should not able to navigate to Guided practices screen, when morning reminder categorySubType is unknown', () => {
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType: 'unknown',
                },
            });
            expect(actionsPushMock).not.toBeCalled();
        });
        it('Should able to navigate to Guided practices screen, when categorySubType is evening reminder', () => {
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsPushMock).toBeCalledWith(
                Scenes.basicPracticesScreen,
                {
                    cardToBeExpanded: 'CLEANING',
                },
            );
        });
        it('Should able to refresh to Guided practices screen , when categorySubType is evening reminder and current screen basicPracticesScreen', () => {
            Actions.currentScene = Scenes.basicPracticesScreen;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsRefreshMock).toBeCalledWith({
                cardToBeExpanded: 'CLEANING',
            });
        });
        it('Should not able to navigate to Guided practices screen, when evening reminder categorySubType is unknown', () => {
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType: 'unknown',
                },
            });
            expect(actionsPushMock).not.toBeCalled();
        });
        it('Should able to navigate to benefitsOfMeditatingWithTrainer, when user has taken introductory sittings and categorySubType is meditate with trainer', async () => {
            prepareHasTakenIntroductorySittings(true);
            prepareNotificationOpenedAppInBackground(
                {
                    data: {
                        category:
                            NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                        categorySubType:
                            NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                    },
                },
                1625058005,
                {
                    user: { hfnProfile: { stage: AbhyasStage.ABHYASI } },
                    preceptorDashboard: { available: true },
                },
            );
            await runAllPromises();
            expect(actionsPushMock).toBeCalledWith(
                Scenes.benefitsOfMeditatingWithTrainer,
            );
        });
        it('should not able to navigate to master classes screen, when categorySubType is unknown', () => {
            prepareNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType: 'unknown',
                },
            });
            expect(actionsPushMock).not.toBeCalled();
        });
        it('should able to navigate to master classes screen, when reminder categorySubType is master class reminder and user is in some other screen', () => {
            Actions.currentScene = Scenes.more;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    masterClasses: MASTERCLASS_VIDEOS.DAY2,
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsPushMock).toBeCalledWith(Scenes.masterClassesScreen);
            expect(masterClassProgressServiceMock).toBeCalledWith(
                Actions.currentScene,
            );
            expect(goToDay2Mock).toHaveBeenCalled();
        });
        it('should able to navigate to master classes screen, when masterClasses is unknown', () => {
            Actions.currentScene = Scenes.more;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    masterClasses: 'unknown',
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsPushMock).toBeCalledWith(Scenes.masterClassesScreen);
            expect(masterClassProgressServiceMock).toBeCalledWith(
                Actions.currentScene,
            );
            expect(goToDay2Mock).not.toHaveBeenCalled();
            expect(goToDay3Mock).not.toHaveBeenCalled();
        });
        it('should able to call master class progress service, when reminder categorySubType is master class reminder and user is in master classes screen', () => {
            Actions.currentScene = Scenes.masterClassesScreen;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    masterClasses: MASTERCLASS_VIDEOS.DAY3,
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                },
            });
            expect(masterClassProgressServiceMock).toHaveBeenCalled();
            expect(goToDay3Mock).toHaveBeenCalled();
        });
        it('Should able to navigate to introSittingCompletionEnquiryScreen, when user has not taken introductory sittings and categorySubType is meditate with trainer', async () => {
            prepareHasTakenIntroductorySittings(false);
            prepareNotificationOpenedAppInBackground(
                {
                    data: {
                        category:
                            NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                        categorySubType:
                            NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                    },
                },
                1625058005,
                {
                    user: { hfnProfile: { stage: AbhyasStage.PRECEPTOR } },
                    preceptorDashboard: { available: false },
                },
            );
            await runAllPromises();
            expect(actionsPushMock).toBeCalledWith(
                Scenes.introSittingCompletionEnquiryScreen,
            );
        });
        it('Should able to navigate to HomeScreen, when ageConsent is not accepted by user', async () => {
            prepareHasTakenIntroductorySittings(false);
            prepareNotificationOpenedAppInBackground(
                {
                    data: {
                        category:
                            NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                        categorySubType:
                            NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                    },
                },
                undefined,
                {
                    user: { hfnProfile: { stage: AbhyasStage.PRECEPTOR } },
                    preceptorDashboard: { available: true },
                },
            );
            await runAllPromises();
            expect(actionsJumpMock).toBeCalledWith(Scenes.home);
        });
        it('Should not able to navigate to home screen, when categorySubType is meditate with trainer and current screen seekerMeditationSession', () => {
            Actions.currentScene = Scenes.seekerMeditationSession;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsJumpMock).not.toBeCalledWith(Scenes.home);
        });
        it('Should not able to navigate to home screen, when categorySubType is meditate with trainer and current screen seekerMeditationCancellationReasonScreen', () => {
            Actions.currentScene =
                Scenes.seekerMeditationCancellationReasonScreen;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsPushMock).not.toBeCalledWith(Scenes.home);
        });
        it('Should not able to navigate to home screen, when categorySubType is meditate with trainer and current screen preceptorMeditationSession', () => {
            Actions.currentScene = Scenes.preceptorMeditationSession;
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                },
            });
            expect(actionsJumpMock).not.toBeCalledWith(Scenes.home);
        });
        it('Should not able to navigate to home screen, when categorySubType is unknown', () => {
            ApplicationEventHandlers.onNotificationOpenedAppInBackground({
                data: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType: 'unknown',
                },
            });
            expect(actionsPushMock).not.toBeCalled();
        });
    });
    describe('#onFCMMessageReceived', () => {
        it('should able to show meditation local notification', () => {
            ApplicationEventHandlers.onFCMMessageReceived(
                {
                    data: {
                        category:
                            NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                        categorySubType: 'unknown',
                        title: 'Mock title',
                        body: 'Mock body',
                    },
                },
                false,
            );
            expect(localNotificationMock).toBeCalledWith({
                channelId: 'General Notification',
                message: 'Mock body',
                playSound: false,
                soundName: 'default',
                title: 'Mock title',
                userInfo: {
                    category: 'SCHEDULED_CONTENT_SERVICE',
                    categorySubType: 'unknown',
                },
            });
        });
    });
    describe('#populateSittingCount', () => {
        it('should able to populate count of sittings taken when user is loggedIn and internet is available', () => {
            prepareInitialize({
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.SEEKER,
                    },
                },
                deviceState: {
                    isApplicationServerReachable: true,
                },
            });

            ApplicationEventHandlers.populateSittingCount();

            expect(updateCountOfSittingsTakenMock).toBeCalled();
        });
        it('should not able to populate count of sittings taken when user is not loggedIn or internet is not available', () => {
            prepareInitialize({
                user: {
                    authenticated: false,
                    hfnProfile: {
                        stage: AbhyasStage.SEEKER,
                    },
                },
                deviceState: {
                    isApplicationServerReachable: false,
                },
            });

            ApplicationEventHandlers.populateSittingCount();

            expect(updateCountOfSittingsTakenMock).not.toBeCalled();
        });
        it('should able to populate count of sittings given and taken when user is preceptor and internet is available', async () => {
            prepareInitialize({
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
                deviceState: {
                    isApplicationServerReachable: true,
                },
            });

            await ApplicationEventHandlers.populateSittingCount();

            expect(updateCountOfSittingsGivenOutsideHeartsAppMock).toBeCalled();
            expect(updateCountOfSittingsTakenMock).toBeCalled();
        });
        it('should not able to populate count of sittings given and taken when user is preceptor and internet is not available', async () => {
            prepareInitialize({
                user: {
                    authenticated: true,
                    hfnProfile: {
                        stage: AbhyasStage.PRECEPTOR,
                    },
                },
                deviceState: {
                    isApplicationServerReachable: false,
                },
            });

            await ApplicationEventHandlers.populateSittingCount();

            expect(
                updateCountOfSittingsGivenOutsideHeartsAppMock,
            ).not.toBeCalled();
            expect(updateCountOfSittingsTakenMock).not.toBeCalled();
        });
    });
});
