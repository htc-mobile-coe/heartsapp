import {
    setAuthenticationInfo,
    isLoggedIn,
    setHfnProfileImage,
    hasUserSubscribedToWeeklyInspirationNotification,
    updateWeeklyInspirationNotificationSubscriptionStatus,
    setUserPreferenceSettings,
    setAgeConsentPopupVisibility,
    setMeditationRemindersSettings,
    setRemindForNextSessionButtonVisibility,
    isReminderForNextSittingEnabled,
    nextSittingReminderIntervalInDays,
    loadMeditationRemindersSettingsFromStorage,
    setCountOfSittingsTaken,
    setCountOfSittingsGivenThroughHeartsApp,
    setCountOfSittingsGivenOffline,
    loadFromStorage,
    getCountOfSittingsGivenThroughHeartsApp,
    getCountOfSittingsGivenOffline,
    setIntroductorySittingsCompletionDetailEnquiryFilledStatus,
    hasIntroductorySittingsCompletionDetailEnquiryFilled,
} from './operations';
import {
    SET_AUTH_STATE,
    SET_USER_PREFERENCE_SITTINGS,
    SET_WEEKLY_INSPIRATION_NOTIFICATION_SUBSCRIPTION_STATUS,
    SET_AGE_CONSENT_POPUP_VISIBILITY,
    SET_MEDITATION_REMINDERS_SETTINGS,
    SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY,
    SET_COUNT_OF_SITTINGS_TAKEN,
    SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP,
    SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE,
    SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS,
} from './types';
import StorageService from '../../services/native/AppStorageService';
import { spyOnProperty } from '../../utils/TestUtils';

describe('UserOperations', () => {
    let getAuthenticationInfoStorageMock;
    let setAuthenticationInfoStorageMock;
    let setHFNProfileStorageMock;
    let getRemindersSettingsStorageMock;
    let setCountOfSittingsTakenStorageMock;
    let getCountOfSittingsTakenStorageMock;
    let setCountOfSittingsGivenThroughHeartsAppStorageMock;
    let getCountOfSittingsGivenThroughHeartsAppStorageMock;
    let setCountOfSittingsGivenOfflineStorageMock;
    let getCountOfSittingsGivenOfflineStorageMock;

    const prepareRemindersSettingsStorage = remindersSettings => {
        getRemindersSettingsStorageMock = jest
            .fn()
            .mockImplementation(() => remindersSettings);

        spyOnProperty(StorageService, 'meditationRemindersSettings', {
            getValue: getRemindersSettingsStorageMock,
        });
    };
    const prepareCountOfSittingsTakenStorage = value => {
        setCountOfSittingsTakenStorageMock = jest
            .fn()
            .mockImplementation(() => {});
        getCountOfSittingsTakenStorageMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(StorageService, 'countOfSittingsTaken', {
            setValue: setCountOfSittingsTakenStorageMock,
            getValue: getCountOfSittingsTakenStorageMock,
        });
    };
    const prepareCountOfSittingsGivenThroughHeartsAppStorage = value => {
        setCountOfSittingsGivenThroughHeartsAppStorageMock = jest
            .fn()
            .mockImplementation(() => {});
        getCountOfSittingsGivenThroughHeartsAppStorageMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(StorageService, 'countOfSittingsGivenThroughHeartsApp', {
            setValue: setCountOfSittingsGivenThroughHeartsAppStorageMock,
            getValue: getCountOfSittingsGivenThroughHeartsAppStorageMock,
        });
    };
    const prepareCountOfSittingsGivenOfflineStorage = value => {
        setCountOfSittingsGivenOfflineStorageMock = jest
            .fn()
            .mockImplementation(() => {});
        getCountOfSittingsGivenOfflineStorageMock = jest
            .fn()
            .mockImplementation(() => value);
        spyOnProperty(StorageService, 'countOfSittingsGivenOffline', {
            setValue: setCountOfSittingsGivenOfflineStorageMock,
            getValue: getCountOfSittingsGivenOfflineStorageMock,
        });
    };
    const getAuthenticationInfoMock = jest
        .spyOn(StorageService, 'getAuthenticationInfo')
        .mockImplementationOnce(() => ({
            uid: 'firebaseId',
        }));

    afterEach(() => {
        if (getAuthenticationInfoStorageMock) {
            getAuthenticationInfoStorageMock.mockClear();
            getAuthenticationInfoStorageMock = undefined;
        }
        if (setAuthenticationInfoStorageMock) {
            setAuthenticationInfoStorageMock.mockClear();
            setAuthenticationInfoStorageMock = undefined;
        }
        if (setHFNProfileStorageMock) {
            setHFNProfileStorageMock.mockClear();
            setHFNProfileStorageMock = undefined;
        }
        if (getRemindersSettingsStorageMock) {
            getRemindersSettingsStorageMock.mockClear();
            getRemindersSettingsStorageMock = undefined;
        }
        if (setCountOfSittingsTakenStorageMock) {
            setCountOfSittingsTakenStorageMock.mockClear();
            setCountOfSittingsTakenStorageMock = undefined;
        }
        if (getCountOfSittingsTakenStorageMock) {
            getCountOfSittingsTakenStorageMock.mockClear();
            getCountOfSittingsTakenStorageMock = undefined;
        }
        if (setCountOfSittingsGivenThroughHeartsAppStorageMock) {
            setCountOfSittingsGivenThroughHeartsAppStorageMock.mockClear();
            setCountOfSittingsGivenThroughHeartsAppStorageMock = undefined;
        }
        if (getCountOfSittingsGivenThroughHeartsAppStorageMock) {
            getCountOfSittingsGivenThroughHeartsAppStorageMock.mockClear();
            getCountOfSittingsGivenThroughHeartsAppStorageMock = undefined;
        }
        if (setCountOfSittingsGivenOfflineStorageMock) {
            setCountOfSittingsGivenOfflineStorageMock.mockClear();
            setCountOfSittingsGivenOfflineStorageMock = undefined;
        }
        if (getCountOfSittingsGivenOfflineStorageMock) {
            getCountOfSittingsGivenOfflineStorageMock.mockClear();
            getCountOfSittingsGivenOfflineStorageMock = undefined;
        }
        getAuthenticationInfoMock.mockClear();
    });
    describe('#setAuthenticationInfo', () => {
        it('should set authentication info properly, based on authInfo passed', () => {
            const dispatchMock = jest.fn();
            setAuthenticationInfo({ uid: 'firebaseId' })(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    authenticated: true,
                    firebaseUserInfo: {
                        uid: 'firebaseId',
                    },
                },
                type: SET_AUTH_STATE,
            });
        });

        it('should set as not authenticated, if authInfo is passed as null', () => {
            const dispatchMock = jest.fn();
            setAuthenticationInfo(null)(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    authenticated: false,
                    firebaseUserInfo: null,
                },
                type: SET_AUTH_STATE,
            });
        });
    });

    describe('#isLoggedIn', () => {
        it('should return as unauthenticated if authenticated value is null', () => {
            expect(
                isLoggedIn({
                    user: {
                        authenticated: null,
                    },
                }),
            ).toBeFalsy();
        });

        it('should return as unauthenticated if authenticated value is false', () => {
            expect(
                isLoggedIn({
                    user: {
                        authenticated: false,
                    },
                }),
            ).toBeFalsy();
        });

        it('should return as authenticated if authenticated value is true', () => {
            expect(
                isLoggedIn({
                    user: {
                        authenticated: true,
                    },
                }),
            ).toBeTruthy();
        });
    });
    describe('#hasUserSubscribedToWeeklyInspirationNotification', () => {
        it('should be unsubcribed when hasUserSubscribedToWeeklyInspirationNotification is null ', () => {
            expect(
                hasUserSubscribedToWeeklyInspirationNotification({
                    user: {
                        isWeeklyInspirationNotificationSubscribed: null,
                    },
                }),
            ).toBeFalsy();
        });

        it('should be unsubcribed when hasUserSubscribedToWeeklyInspirationNotification is false  ', () => {
            expect(
                hasUserSubscribedToWeeklyInspirationNotification({
                    user: {
                        isWeeklyInspirationNotificationSubscribed: false,
                    },
                }),
            ).toBeFalsy();
        });

        it('should be subcribed when hasUserSubscribedToWeeklyInspirationNotification is true ', () => {
            expect(
                hasUserSubscribedToWeeklyInspirationNotification({
                    user: {
                        isWeeklyInspirationNotificationSubscribed: true,
                    },
                }),
            ).toBeTruthy();
        });
    });

    it('should able to update WeeklyInspiration Notification', () => {
        const dispatchMock = jest.fn();
        updateWeeklyInspirationNotificationSubscriptionStatus(true)(
            dispatchMock,
        );
        expect(dispatchMock).toBeCalledWith({
            payload: { isWeeklyInspirationNotificationSubscribed: true },
            type: SET_WEEKLY_INSPIRATION_NOTIFICATION_SUBSCRIPTION_STATUS,
        });
    });

    it('should able to set user preference settings', () => {
        const dispatchMock = jest.fn();
        setUserPreferenceSettings({
            isWeeklyInspirationNotificationSubscribed: true,
            shouldPlayGuidedRelaxationAudio: true,
        })(dispatchMock);
        expect(dispatchMock).toBeCalledWith({
            payload: {
                isWeeklyInspirationNotificationSubscribed: true,
                shouldPlayGuidedRelaxationAudio: true,
            },
            type: SET_USER_PREFERENCE_SITTINGS,
        });
    });

    describe('#setAgeConsentPopupVisibility', () => {
        it('should set isAgeConsentPopupVisibile properly', () => {
            const dispatchMock = jest.fn();
            setAgeConsentPopupVisibility(true)(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: true,
                type: SET_AGE_CONSENT_POPUP_VISIBILITY,
            });
        });
    });

    it('should able to set Profile Image', async () => {
        const dispatchMock = jest.fn();
        const getStateMock = jest.fn().mockImplementation(() => ({ user: {} }));

        const getHFNProfileMock = jest
            .spyOn(StorageService, 'getHFNProfile')
            .mockImplementationOnce(() => ({
                firstName: 'John',
            }));

        const setHFNProfileMock = jest
            .spyOn(StorageService, 'setHFNProfile')
            .mockImplementationOnce(() => {});

        await setHfnProfileImage('http://mock-profile')(
            dispatchMock,
            getStateMock,
        );
        expect(getHFNProfileMock).toHaveBeenCalled();
        expect(setHFNProfileMock).toHaveBeenCalledWith({
            firstName: 'John',
            photoURL: 'http://mock-profile',
        });
        expect(setHFNProfileMock).toHaveBeenCalledTimes(2);
    });
    describe('#setMeditationRemindersSettings', () => {
        it('should set meditation reminders settings value properly', () => {
            const dispatchMock = jest.fn();

            setMeditationRemindersSettings({
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 71821,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 81939,
            })(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    meditationRemindersSettings: {
                        isMorningMeditationReminderEnabled: true,
                        morningMeditationTime: 71821,
                        isEveningMeditationReminderEnabled: true,
                        eveningCleaningTime: 81939,
                    },
                },
                type: SET_MEDITATION_REMINDERS_SETTINGS,
            });
        });

        it('should call loadMeditationRemindersSettingsFromStorage and set meditationRemindersSettings value from local storage', async () => {
            const dispatchMock = jest.fn();
            const remindersSettings = {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 71821,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 81939,
            };

            prepareRemindersSettingsStorage(remindersSettings);

            await loadMeditationRemindersSettingsFromStorage(dispatchMock);

            expect(getRemindersSettingsStorageMock).toHaveBeenCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    meditationRemindersSettings: remindersSettings,
                },
                type: SET_MEDITATION_REMINDERS_SETTINGS,
            });
        });

        it('should call loadMeditationRemindersSettingsFromStorage and should not set meditationRemindersSettings value from local storage when values are undefined', async () => {
            const dispatchMock = jest.fn();
            const remindersSettings = undefined;

            prepareRemindersSettingsStorage(remindersSettings);

            await loadMeditationRemindersSettingsFromStorage(dispatchMock);

            expect(getRemindersSettingsStorageMock).toHaveBeenCalled();
            expect(dispatchMock).not.toHaveBeenCalled();
        });
    });

    describe('#setRemindForNextSessionButtonVisibility', () => {
        it('should set ShowReminderForNextSessionButton value properly', () => {
            const dispatchMock = jest.fn();

            setRemindForNextSessionButtonVisibility(true)(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: true,
                type: SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY,
            });
        });
    });

    describe('#setCountOfSittingsTaken', () => {
        it('should set setCountOfSittingsTaken value properly', () => {
            const dispatchMock = jest.fn();
            prepareCountOfSittingsTakenStorage();

            setCountOfSittingsTaken(100)(dispatchMock);

            expect(setCountOfSittingsTakenStorageMock).toBeCalledWith(100);
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: 100,
                type: SET_COUNT_OF_SITTINGS_TAKEN,
            });
        });
    });

    describe('#setCountOfSittingsGivenThroughHeartsApp', () => {
        it('should set setCountOfSittingsGivenThroughHeartsApp value properly', () => {
            const dispatchMock = jest.fn();
            prepareCountOfSittingsGivenThroughHeartsAppStorage();

            setCountOfSittingsGivenThroughHeartsApp(100)(dispatchMock);

            expect(
                setCountOfSittingsGivenThroughHeartsAppStorageMock,
            ).toBeCalledWith(100);
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: 100,
                type: SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP,
            });
        });
    });

    describe('#setCountOfSittingsGivenOffline', () => {
        it('should set setCountOfSittingsGivenOffline value properly', () => {
            const dispatchMock = jest.fn();
            prepareCountOfSittingsGivenOfflineStorage();

            setCountOfSittingsGivenOffline(100)(dispatchMock);

            expect(setCountOfSittingsGivenOfflineStorageMock).toBeCalledWith(
                100,
            );
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: 100,
                type: SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE,
            });
        });
    });

    describe('#loadFromStorage', () => {
        it('should set values properly', async () => {
            const dispatchMock = jest.fn();
            prepareCountOfSittingsTakenStorage(100);
            prepareCountOfSittingsGivenThroughHeartsAppStorage(120);
            prepareCountOfSittingsGivenOfflineStorage(120);
            await loadFromStorage()(dispatchMock);

            expect(getAuthenticationInfoMock).toBeCalled();
            expect(getCountOfSittingsTakenStorageMock).toBeCalled();
            expect(
                getCountOfSittingsGivenThroughHeartsAppStorageMock,
            ).toBeCalled();
            expect(getCountOfSittingsGivenOfflineStorageMock).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: 100,
                type: SET_COUNT_OF_SITTINGS_TAKEN,
            });
        });
        it('should set values properly when values are not set in storage', async () => {
            const dispatchMock = jest.fn();
            prepareCountOfSittingsTakenStorage(undefined);
            prepareCountOfSittingsGivenThroughHeartsAppStorage(undefined);
            prepareCountOfSittingsGivenOfflineStorage(undefined);
            await loadFromStorage()(dispatchMock);

            expect(getAuthenticationInfoMock).toBeCalled();
            expect(getCountOfSittingsTakenStorageMock).toBeCalled();
            expect(
                getCountOfSittingsGivenThroughHeartsAppStorageMock,
            ).toBeCalled();
            expect(getCountOfSittingsGivenOfflineStorageMock).toBeCalled();
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: 0,
                type: SET_COUNT_OF_SITTINGS_TAKEN,
            });
        });
    });

    it('should get isReminderForNextSittingEnabled value', () => {
        expect(
            isReminderForNextSittingEnabled({
                user: {
                    meditationRemindersSettings: {
                        isReminderForNextSittingEnabled: true,
                    },
                },
            }),
        ).toBeTruthy();
    });

    it('should get nextSittingReminderIntervalInDays value', () => {
        expect(
            nextSittingReminderIntervalInDays({
                user: {
                    meditationRemindersSettings: {
                        nextSittingReminderIntervalInDays: 7,
                    },
                },
            }),
        ).toEqual(7);
    });
    describe('#getCountOfSittingsGivenThroughHeartsApp', () => {
        it('should get preceptor session count through HeartsApp formatted properly', () => {
            expect(
                getCountOfSittingsGivenThroughHeartsApp({
                    user: {
                        countOfSittingsGivenThroughHeartsApp: 1320,
                    },
                }),
            ).toBe('1,320');
        });
    });
    describe('#getCountOfSittingsGivenOffline', () => {
        it('should get preceptor session count offline HeartsApp formatted properly', () => {
            expect(
                getCountOfSittingsGivenOffline({
                    user: {
                        countOfSittingsGivenOffline: 1320,
                    },
                }),
            ).toBe('1,320');
        });
    });
    describe('#setIntroductorySittingsCompletionDetailEnquiryFilledStatus', () => {
        it('should set Introductory Sittings Completion Detail Enquiry Filled Status properly', () => {
            const dispatchMock = jest.fn();

            setIntroductorySittingsCompletionDetailEnquiryFilledStatus(true)(
                dispatchMock,
            );

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: true,
                type: SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS,
            });
        });
    });
    describe('#hasIntroductorySittingsCompletionDetailEnquiryFilled', () => {
        it('should able to return true if the user has already filled the introductory sitting completion detail enquiry', () => {
            expect(
                hasIntroductorySittingsCompletionDetailEnquiryFilled({
                    user: {
                        isIntroductorySittingsCompletionDetailEnquiryFilled: true,
                    },
                }),
            ).toBeTruthy();
        });
        it('should able to return false if the user has not yet filled the introductory sitting completion detail enquiry', () => {
            expect(
                hasIntroductorySittingsCompletionDetailEnquiryFilled({
                    user: {
                        isIntroductorySittingsCompletionDetailEnquiryFilled: false,
                    },
                }),
            ).toBeFalsy();
        });
    });
});
