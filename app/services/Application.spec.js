import Application from './Application';
import * as MessagingService from './firebase/MessagingService';
import { spyOnProperty } from '../utils/TestUtils';
import ServerReachabilityCheck from './ServerReachabilityCheckService';
import * as ProfileService from './grpc/ProfileService';
import ApplicationEventHandlers from './ApplicationEventHandlers';
import * as RemoteConfigService from './firebase/RemoteConfigService';
import NotificationService from './NotificationService';
import { Actions } from 'react-native-router-flux';
import StorageService from './native/AppStorageService';
import SeekerSession from './meditation/SeekerSession';
import NetInfo from '@react-native-community/netinfo';
import * as DiagnosticLogService from './DiagnosticLogService';
import moment from 'moment';
import PushNotification from 'react-native-push-notification';
import * as AsyncUtils from '../utils/AsyncUtils';
import { service as SeekerMeditationSessionService } from './meditation/SeekerMeditationSession';
import MasterClassProgressService from './MasterClassProgressService';
import * as UserOperation from '../state/user/operations';
import * as MasterClassProgressOperation from '../state/masterClassesProgress/operations';
import { Scenes } from '../shared/Constants';
import { MasterClassProgressMachine } from '../machines/MasterClassProgress';
import { OfflineSittingDetailMachine } from '../machines/OfflineSittingDetail';
import OfflineSittingDetailService from './meditation/OfflineSittingDetailService';
import { waitFor } from '@testing-library/react-native';

describe('Application', () => {
    jest.useFakeTimers();
    const dispatchMock = jest.fn();
    let getStateMock;
    let getExistingSessionByUserMock;
    let ongoingSeekerMeditationSessionMock;
    let hasDoNotDisturbPermissionMock;
    let determineNetworkConnectivityStatusMock;
    let getOfflinePreceptorMeditationStartedTimeStorageMock;
    const initializeRemoteConfigMock = jest
        .spyOn(RemoteConfigService, 'initialize')
        .mockImplementation(() => {});
    const configureNotificationMock = jest
        .spyOn(NotificationService, 'configure')
        .mockImplementation(() => {});
    const onInternetConnectivityStatusChangeMock = jest
        .spyOn(ApplicationEventHandlers, 'onInternetConnectivityStatusChange')
        .mockImplementation(() => {});
    const handleMasterSittingMock = jest
        .spyOn(SeekerSession, 'handleMasterSitting')
        .mockReturnValueOnce(Promise.resolve());
    const getAuthenticationInfoMock = jest
        .spyOn(StorageService, 'getAuthenticationInfo')
        .mockImplementation(() => ({ hfnProfile: {} }));
    const sceneReplaceMock = jest.spyOn(Actions, 'replace');

    const subscribeToWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'subscribeToWeeklyInspirationNotification')
        .mockImplementation(() => ({}));
    const unsubscribeFromWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'unsubscribeFromWeeklyInspirationNotification')
        .mockImplementation(() => ({}));
    const saveUserPreferencesMock = jest
        .spyOn(ProfileService, 'saveUserPreferences')
        .mockImplementation(() => {});
    const hasSubscribedToWeeklyInspirationNotificationSetMock = jest.fn();
    const logsMock = jest
        .spyOn(DiagnosticLogService, 'log')
        .mockImplementation(() => {});
    const popInitialNotificationMock = jest
        .spyOn(PushNotification, 'popInitialNotification')
        .mockImplementation(callback => callback());
    const waitMock = jest
        .spyOn(AsyncUtils, 'wait')
        .mockImplementation(() => Promise.resolve());
    const seekerMeditationSessionServiceInitializeMock = jest
        .spyOn(SeekerMeditationSessionService, 'initialize')
        .mockImplementation(() => {});
    const masterClassProgressServiceInitializeMock = jest.spyOn(
        MasterClassProgressService,
        'initialize',
    );
    const masterClassProgressMachineInitializeMock = jest
        .spyOn(MasterClassProgressMachine, 'initialize')
        .mockImplementation(() => {});
    const masterClassProgressServiceStartMock = jest
        .spyOn(MasterClassProgressService, 'start')
        .mockImplementation(() => {});
    const offlineSittingDetailServiceInitializeMock = jest
        .spyOn(OfflineSittingDetailService, 'initialize')
        .mockImplementation(() => {});
    const offlineSittingDetailMachineInitializeMock = jest
        .spyOn(OfflineSittingDetailMachine, 'initialize')
        .mockImplementation(() => {});
    const pushMock = jest.spyOn(Actions, 'push');
    const replaceMock = jest.spyOn(Actions, 'replace');
    let hasTakenIntroductorySittingsMock;
    let getUnlockedMock;
    let hasSubscribedToWeeklyInspirationNotificationGetMock;
    let ageConsentTimeStampGetMock;
    let getUserPreferencesMock;

    const fetchNetworkMock = jest
        .spyOn(NetInfo, 'fetch')
        .mockImplementation(() =>
            Promise.resolve({
                isConnected: true,
                isInternetReachable: true,
            }),
        );

    const updateDetermineNetworkConnectivityStatus = internet => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(internet);
            });
    };
    const updateOngoingSeekerMeditationSessionValue = sessionValue => {
        ongoingSeekerMeditationSessionMock = jest
            .spyOn(StorageService, 'getOngoingSeekerMeditationSession')
            .mockImplementation(() => {
                return sessionValue;
            });
    };

    const prepareOfflinePreceptorMeditationStartedTimeStorage = value => {
        getOfflinePreceptorMeditationStartedTimeStorageMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(StorageService, 'offlinePreceptorMeditationStartedTime', {
            getValue: getOfflinePreceptorMeditationStartedTimeStorageMock,
        });
    };
    afterEach(() => {
        initializeRemoteConfigMock.mockClear();
        waitMock.mockClear();
        replaceMock.mockClear();
        configureNotificationMock.mockClear();
        fetchNetworkMock.mockClear();
        onInternetConnectivityStatusChangeMock.mockClear();
        sceneReplaceMock.mockClear();
        handleMasterSittingMock.mockClear();
        getAuthenticationInfoMock.mockClear();
        popInitialNotificationMock.mockClear();
        seekerMeditationSessionServiceInitializeMock.mockClear();

        if (hasDoNotDisturbPermissionMock) {
            hasDoNotDisturbPermissionMock.mockClear();
            hasDoNotDisturbPermissionMock = undefined;
        }
        if (getExistingSessionByUserMock) {
            getExistingSessionByUserMock.mockClear();
            getExistingSessionByUserMock = undefined;
        }
        if (ongoingSeekerMeditationSessionMock) {
            ongoingSeekerMeditationSessionMock.mockClear();
            ongoingSeekerMeditationSessionMock = undefined;
        }

        dispatchMock.mockClear();
        logsMock.mockClear();
        subscribeToWeeklyInspirationNotificationMock.mockClear();
        unsubscribeFromWeeklyInspirationNotificationMock.mockClear();
        saveUserPreferencesMock.mockClear();
        hasSubscribedToWeeklyInspirationNotificationSetMock.mockClear();
        masterClassProgressServiceInitializeMock.mockClear();
        masterClassProgressMachineInitializeMock.mockClear();
        masterClassProgressServiceStartMock.mockClear();
        offlineSittingDetailServiceInitializeMock.mockClear();
        offlineSittingDetailMachineInitializeMock.mockClear();
        pushMock.mockClear();
        if (getStateMock) {
            getStateMock.mockClear();
            getStateMock = undefined;
        }
        if (hasSubscribedToWeeklyInspirationNotificationGetMock) {
            hasSubscribedToWeeklyInspirationNotificationGetMock.mockClear();
            hasSubscribedToWeeklyInspirationNotificationGetMock = undefined;
        }
        if (ageConsentTimeStampGetMock) {
            ageConsentTimeStampGetMock.mockClear();
            ageConsentTimeStampGetMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (getUserPreferencesMock) {
            getUserPreferencesMock.mockClear();
            getUserPreferencesMock = undefined;
        }
        if (hasTakenIntroductorySittingsMock) {
            hasTakenIntroductorySittingsMock.mockClear();
            hasTakenIntroductorySittingsMock = undefined;
        }
        if (getUnlockedMock) {
            getUnlockedMock.mockClear();
            getUnlockedMock = undefined;
        }
        if (getOfflinePreceptorMeditationStartedTimeStorageMock) {
            getOfflinePreceptorMeditationStartedTimeStorageMock.mockClear();
            getOfflinePreceptorMeditationStartedTimeStorageMock = undefined;
        }
    });

    it('Should able to initialize the offline sitting detail service and offline sitting detail machine', () => {
        waitFor(() => Application.initialize(dispatchMock, getStateMock));
        expect(offlineSittingDetailServiceInitializeMock).toBeCalledWith(
            dispatchMock,
            getStateMock,
        );
        expect(offlineSittingDetailMachineInitializeMock).toBeCalledWith(
            dispatchMock,
            getStateMock,
        );
    });

    describe('#subscribeToWeeklyInspirationIfRequired', () => {
        const timeStampValue = moment().unix();
        const prepareWeeklyInspiration = (
            getState,
            getWeeklyInspirationValue,
            userPreferences,
            internet = true,
        ) => {
            getStateMock = jest.fn().mockImplementation(() => getState);
            updateDetermineNetworkConnectivityStatus(internet);
            hasSubscribedToWeeklyInspirationNotificationGetMock = jest
                .fn()
                .mockImplementation(() => getWeeklyInspirationValue);
            ageConsentTimeStampGetMock = jest
                .fn()
                .mockImplementation(() => timeStampValue);

            spyOnProperty(
                StorageService,
                'hasSubscribedToWeeklyInspirationNotification',
                {
                    getValue: hasSubscribedToWeeklyInspirationNotificationGetMock,
                    setValue: hasSubscribedToWeeklyInspirationNotificationSetMock,
                },
            );
            spyOnProperty(StorageService, 'ageConsentTimeStamp', {
                getValue: ageConsentTimeStampGetMock,
            });
            getUserPreferencesMock = jest
                .spyOn(ProfileService, 'getUserPreferences')
                .mockImplementation(() => userPreferences);
        };
        it('should not able to subscribe weekly inspiration notification when internet is not available', () => {
            prepareWeeklyInspiration(
                {
                    user: {
                        authenticated: true,
                    },
                },
                false,
                undefined,
                false,
            );
            waitFor(() => Application.subscribeToWeeklyInspirationIfRequired(
                dispatchMock,
                getStateMock,
            ));

            expect(saveUserPreferencesMock).not.toBeCalled();
        });
        it('should able to unsubscribe weekly inspiration notification, when user is anonymous and weekly inspiration notification setting is false', () => {
            prepareWeeklyInspiration(
                {
                    user: {
                        authenticated: false,
                    },
                },
                false,
                false,
            );

            waitFor(() => Application.subscribeToWeeklyInspirationIfRequired(
                dispatchMock,
                getStateMock,
            ));
            expect(
                unsubscribeFromWeeklyInspirationNotificationMock,
            ).toBeCalled();
            expect(saveUserPreferencesMock).not.toBeCalled();
        });
        it('should able to subscribe weekly inspiration notification, when user is anonymous and weekly inspiration notification settings undefined', () => {
            prepareWeeklyInspiration(
                {
                    user: {
                        authenticated: false,
                    },
                },
                undefined,
                false,
            );
            waitFor(() => Application.subscribeToWeeklyInspirationIfRequired(
                dispatchMock,
                getStateMock,
            ));
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
            expect(saveUserPreferencesMock).not.toBeCalled();
        });
        it('should able to subscribe weekly inspiration notification and save the user preferences, when user preferences of weekly inspiration notification settings is undefined', () => {
            prepareWeeklyInspiration(
                {
                    user: {
                        authenticated: true,
                        shouldPlayGuidedRelaxationAudio: true,
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
                },
                undefined,
                { isSubscribedToWeeklyInspiration: undefined },
            );
            waitFor(() => Application.subscribeToWeeklyInspirationIfRequired(
                dispatchMock,
                getStateMock,
            ));
            expect(subscribeToWeeklyInspirationNotificationMock).toBeCalled();
            expect(ageConsentTimeStampGetMock).toBeCalled();

            expect(saveUserPreferencesMock).toBeCalledWith({
                shouldPlayRelaxationAudioBeforeMeditation: true,
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
        it('should able to subscribe weekly inspiration notification, when user preferences of weekly inspiration notification settings is true', () => {
            prepareWeeklyInspiration(
                {
                    user: {
                        authenticated: true,
                        shouldPlayGuidedRelaxationAudio: true,
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
                },
                true,
                { isSubscribedToWeeklyInspiration: { kind: true } },
            );
            waitFor(() => Application.subscribeToWeeklyInspirationIfRequired(
                dispatchMock,
                getStateMock,
            ));
            expect(ageConsentTimeStampGetMock).toBeCalled();

            expect(saveUserPreferencesMock).toBeCalledWith({
                shouldPlayRelaxationAudioBeforeMeditation: true,
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
        it('should able to unsubscribe weekly inspiration notification, when user preferences of weekly inspiration notification settings is false', () => {
            prepareWeeklyInspiration(
                {
                    user: {
                        authenticated: true,
                        isSubscribedToWeeklyInspiration: false,
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
                },
                false,
                { isSubscribedToWeeklyInspiration: { kind: false } },
            );
            waitFor(() => Application.subscribeToWeeklyInspirationIfRequired(
                dispatchMock,
                getStateMock,
            ));
            expect(
                unsubscribeFromWeeklyInspirationNotificationMock,
            ).toBeCalled();
            expect(ageConsentTimeStampGetMock).toBeCalled();

            expect(saveUserPreferencesMock).toBeCalledWith({
                shouldPlayRelaxationAudioBeforeMeditation: false,
                isSubscribedToWeeklyInspiration: false,
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
    });

    describe('#updateMeditationRemindersSettingsFromServer', () => {
        const prepare = (getState, userPreferences, internet = true) => {
            getStateMock = jest.fn().mockImplementation(() => getState);
            getUserPreferencesMock = jest
                .spyOn(ProfileService, 'getUserPreferences')
                .mockImplementation(() => userPreferences);
            updateDetermineNetworkConnectivityStatus(internet);
        };

        it('should able to get userPreferences value and save to setMeditationRemindersSettings when internet is available', () => {
            prepare(
                {
                    user: {
                        authenticated: true,
                    },
                },
                {
                    eveningCleaningTime: { seconds: 68700 },
                    isEveningMeditationReminderEnabled: true,
                    morningMeditationTime: { seconds: 33240 },
                    isMorningMeditationReminderEnabled: true,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 3,
                },
                true,
            );

            waitFor(() => Application.updateMeditationRemindersSettingsFromServer(
                dispatchMock,
                getStateMock,
            ));
            expect(getUserPreferencesMock).toBeCalled();
            expect(dispatchMock).toBeCalled();
        });

        it('should not able to get userPreferences value when internet is not available', () => {
            prepare(
                {
                    user: {
                        authenticated: true,
                    },
                },
                {
                    eveningCleaningTime: { seconds: 68700 },
                    isEveningMeditationReminderEnabled: true,
                    morningMeditationTime: { seconds: 33240 },
                    isMorningMeditationReminderEnabled: true,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 3,
                },
                false,
            );
            Application.updateMeditationRemindersSettingsFromServer(
                dispatchMock,
                getStateMock,
            );
            expect(getUserPreferencesMock).not.toBeCalled();
            expect(dispatchMock).not.toBeCalled();
        });

        it('should able to get userPreferences value and should not able to save it to setMeditationRemindersSettings, when values are undefined and 0', () => {
            prepare(
                {
                    user: {
                        authenticated: true,
                    },
                },
                {
                    eveningCleaningTime: { seconds: 0 },
                    isEveningMeditationReminderEnabled: undefined,
                    morningMeditationTime: { seconds: 0 },
                    isMorningMeditationReminderEnabled: undefined,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 3,
                },
                true,
            );
            waitFor(() => Application.updateMeditationRemindersSettingsFromServer(
                dispatchMock,
                getStateMock,
            ));

            expect(getUserPreferencesMock).toBeCalled();
            expect(dispatchMock).not.toBeCalled();
        });

        it('should not able to get userPreferences value for non-loggedIn user', () => {
            prepare(
                {
                    user: {
                        authenticated: false,
                    },
                },
                {
                    eveningCleaningTime: { seconds: 68700 },
                    isEveningMeditationReminderEnabled: true,
                    morningMeditationTime: { seconds: 33240 },
                    isMorningMeditationReminderEnabled: true,
                    isReminderForNextSittingEnabled: true,
                    nextSittingReminderIntervalInDays: 3,
                },
                true,
            );
            Application.updateMeditationRemindersSettingsFromServer(
                dispatchMock,
                getStateMock,
            );
            expect(getUserPreferencesMock).not.toBeCalled();
        });
    });

    describe('navigateToMasterClass', () => {
        const prepare = (getState, internet = true) => {
            getStateMock = jest.fn().mockImplementation(() => getState);
            updateDetermineNetworkConnectivityStatus(internet);
        };
        const prepareHasTakenIntroductorySittings = state => {
            hasTakenIntroductorySittingsMock = jest
                .spyOn(UserOperation, 'hasTakenIntroductorySittings')
                .mockImplementation(() => {
                    return state;
                });
        };

        const prepareGetUnlocked = state => {
            getUnlockedMock = jest
                .spyOn(MasterClassProgressOperation, 'getUnLocked')
                .mockImplementation(() => {
                    return state;
                });
        };

        it('should navigate to master classes screen when user has not taken introductory sittings', () => {
            prepare(
                {
                    masterClassesProgress: {
                        masterClassesFinishedDates: {
                            introductionAboutMasterClasses:
                                '2021-07-14T05:55:36.360Z',
                            day1: '2021-07-14T05:55:47.881Z',
                            day2: null,
                            day3: null,
                        },
                    },
                    onboardingStatus: { onboardingFinished: true },
                },
                true,
            );
            prepareHasTakenIntroductorySittings(false);
            prepareGetUnlocked({
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: false,
            });
            waitFor(() => Application.initialize(dispatchMock, getStateMock))
            expect(masterClassProgressServiceStartMock).toBeCalled();
            expect(replaceMock).toBeCalledWith(Scenes.masterClassesScreen);
        });
        it('should navigate to master classes screen when meditation session in storage', () => {
            prepare(
                {
                    user: {
                        authenticated: true,
                    },
                    masterClassesProgress: {
                        masterClassesFinishedDates: {
                            introductionAboutMasterClasses:
                                '2021-07-14T05:55:36.360Z',
                            day1: '2021-07-14T05:55:47.881Z',
                            day2: null,
                            day3: null,
                        },
                    },
                    onboardingStatus: { onboardingFinished: true },
                },
                true,
            );
            updateOngoingSeekerMeditationSessionValue(Promise.resolve({}));
            prepareHasTakenIntroductorySittings(false);
            prepareGetUnlocked({
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: false,
            });
            waitFor(() => Application.initialize(dispatchMock, getStateMock))

            expect(masterClassProgressServiceStartMock).toBeCalled();
            expect(ongoingSeekerMeditationSessionMock).toBeCalled();
            expect(replaceMock).toBeCalledWith(Scenes.masterClassesScreen);
        });
        it('should able to navigate to home screen when meditation session in storage is not available', () => {
            prepare(
                {
                    user: {
                        authenticated: true,
                    },
                    masterClassesProgress: {
                        masterClassesFinishedDates: {
                            introductionAboutMasterClasses: null,
                            day1: null,
                            day2: null,
                            day3: null,
                        },
                    },
                    onboardingStatus: { onboardingFinished: true },
                },
                true,
            );
            updateOngoingSeekerMeditationSessionValue(Promise.resolve({}));
            prepareHasTakenIntroductorySittings(false);
            prepareGetUnlocked({
                introductionAboutMasterClasses: true,
                day1: false,
                day2: false,
                day3: false,
            });

            waitFor(() => Application.initialize(dispatchMock, getStateMock))
            expect(masterClassProgressServiceStartMock).not.toBeCalled();
            expect(replaceMock).toBeCalledWith(Scenes.home);
        });
        it('should navigate to master classes screen if day3 master class is unlocked but not yet finished', () => {
            prepare(
                {
                    masterClassesProgress: {
                        masterClassesFinishedDates: {
                            introductionAboutMasterClasses:
                                '2021-07-14T05:55:36.360Z',
                            day1: '2021-07-14T05:55:47.881Z',
                            day2: '2021-07-15T05:55:47.881Z',
                            day3: null,
                        },
                    },
                    onboardingStatus: { onboardingFinished: true },
                },
                true,
            );
            prepareHasTakenIntroductorySittings(false);
            prepareGetUnlocked({
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: true,
            });

            waitFor(() => Application.initialize(dispatchMock, getStateMock))
            expect(masterClassProgressServiceStartMock).toBeCalled();
            expect(replaceMock).toBeCalledWith(Scenes.masterClassesScreen);
        });
        it('should not navigate to master classes screen when user has taken introductory sittings', () => {
            prepare(
                {
                    masterClassesProgress: {
                        masterClassesFinishedDates: {
                            introductionAboutMasterClasses:
                                '2021-07-14T05:55:36.360Z',
                            day1: '2021-07-14T05:55:47.881Z',
                            day2: '2021-07-15T05:55:47.881Z',
                            day3: '2021-07-16T05:55:47.881Z',
                        },
                    },
                    onboardingStatus: { onboardingFinished: true },
                },
                true,
            );
            prepareHasTakenIntroductorySittings(true);
            prepareGetUnlocked({
                introductionAboutMasterClasses: true,
                day1: true,
                day2: true,
                day3: true,
            });
            Application.initialize(dispatchMock, getStateMock);
            expect(masterClassProgressServiceStartMock).not.toBeCalled();
        });

        it('should navigate to offline meditation session screen when there is a valid value in OfflinePreceptorMeditationStartedTime storage', () => {
            prepare(
                {
                    user: {
                        authenticated: true,
                    },
                    onboardingStatus: { onboardingFinished: true },
                },
                true,
            );
            prepareOfflinePreceptorMeditationStartedTimeStorage(
                '2022-10-30T00:00:00.000Z',
            );
            waitFor(() => Application._navigateToLandingScreen(getStateMock))
            expect(
                getOfflinePreceptorMeditationStartedTimeStorageMock,
            ).toBeCalled();
            expect(replaceMock).toBeCalledWith(
                Scenes.offlineMeditationSessionScreen,
            );
        });
    });
});
