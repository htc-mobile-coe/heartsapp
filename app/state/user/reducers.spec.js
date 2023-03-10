import reducer from './reducers';
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

describe('UserReducers', () => {
    it('Should set initial state null by default to indicate not yet determined', () => {
        expect(reducer(undefined, {})).toEqual({
            isAgeConsentPopupVisibile: false,
            authenticated: null,
            firebaseUserInfo: null,
            hfnProfile: null,
            shouldPlayGuidedRelaxationAudio: false,
            isIntroductorySittingsCompletionDetailEnquiryFilled: false,
            isWeeklyInspirationNotificationSubscribed: false,
            takenIntroductorySittings: false,
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 68400,
                isReminderForNextSittingEnabled: true,
                nextSittingReminderIntervalInDays: 7,
            },
            showRemindForNextSessionButton: true,
            countOfSittingsTaken: 0,
            countOfSittingsGivenThroughHeartsApp: 0,
            countOfSittingsGivenOffline: 0,
        });
    });

    it('Should set auth info status based on payload passed', () => {
        expect(
            reducer(
                {
                    authenticated: null,
                    firebaseUserInfo: null,
                    hfnProfile: null,
                },
                {
                    type: SET_AUTH_STATE,
                    payload: {
                        authenticated: true,
                        firebaseUserInfo: {
                            uid: 'firebaseId',
                        },
                        hfnProfile: null,
                    },
                },
            ),
        ).toEqual({
            authenticated: true,
            firebaseUserInfo: {
                uid: 'firebaseId',
            },
            hfnProfile: null,
        });
    });

    it('Should not handle other actions', () => {
        expect(
            reducer(
                {
                    authenticated: true,
                    firebaseUserInfo: {
                        uid: 'firebaseId',
                    },
                    hfnProfile: null,
                },
                {
                    type: 'RandomeAction',
                    payload: {
                        day1: '1',
                        day2: '2',
                        day3: '3',
                    },
                },
            ),
        ).toEqual({
            authenticated: true,
            firebaseUserInfo: {
                uid: 'firebaseId',
            },
            hfnProfile: null,
        });
    });

    it('Should set isWeeklyInspirationNotificationSubscribed based on payload passed', () => {
        expect(
            reducer(
                {
                    isWeeklyInspirationNotificationSubscribed: null,
                },
                {
                    type: SET_WEEKLY_INSPIRATION_NOTIFICATION_SUBSCRIPTION_STATUS,
                    payload: {
                        isWeeklyInspirationNotificationSubscribed: true,
                    },
                },
            ),
        ).toEqual({
            isWeeklyInspirationNotificationSubscribed: true,
        });
    });

    it('Should set user preference based on payload passed', () => {
        expect(
            reducer(
                {
                    shouldPlayGuidedRelaxationAudio: null,
                    isWeeklyInspirationNotificationSubscribed: null,
                },
                {
                    type: SET_USER_PREFERENCE_SITTINGS,
                    payload: {
                        shouldPlayGuidedRelaxationAudio: true,
                        isWeeklyInspirationNotificationSubscribed: true,
                    },
                },
            ),
        ).toEqual({
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
    });

    it('Should set isAgeConsentPopupVisibile to true if SET_AGE_CONSENT_POPUP_VISIBILITY called', () => {
        expect(
            reducer(
                { isAgeConsentPopupVisibile: false },
                { type: SET_AGE_CONSENT_POPUP_VISIBILITY, payload: true },
            ),
        ).toEqual({
            isAgeConsentPopupVisibile: true,
        });
    });
    it('Should set meditationRemindersSettings values based on payload passed', () => {
        expect(
            reducer(
                {
                    meditationRemindersSettings: {
                        isMorningMeditationReminderEnabled: true,
                        morningMeditationTime: '71821',
                        isEveningMeditationReminderEnabled: true,
                        eveningCleaningTime: '81939',
                    },
                },
                {
                    type: SET_MEDITATION_REMINDERS_SETTINGS,
                    payload: {
                        meditationRemindersSettings: {
                            isMorningMeditationReminderEnabled: true,
                            morningMeditationTime: '71821',
                            isEveningMeditationReminderEnabled: true,
                            eveningCleaningTime: '81939',
                        },
                    },
                },
            ),
        ).toEqual({
            meditationRemindersSettings: {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: '71821',
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: '81939',
            },
        });
    });

    describe('#SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY', () => {
        it('Should set showRemindForNextSessionButton values based on payload is true', () => {
            expect(
                reducer(
                    {
                        showRemindForNextSessionButton: true,
                    },
                    {
                        type: SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY,
                        payload: true,
                    },
                ),
            ).toEqual({
                showRemindForNextSessionButton: true,
            });
        });
        it('Should set showRemindForNextSessionButton values based on payload is false', () => {
            expect(
                reducer(
                    {
                        showRemindForNextSessionButton: true,
                    },
                    {
                        type: SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY,
                        payload: false,
                    },
                ),
            ).toEqual({
                showRemindForNextSessionButton: false,
            });
        });
    });

    describe('#SET_COUNT_OF_SITTINGS_TAKEN', () => {
        it('Should set countOfSittingsTaken values based on payload', () => {
            expect(
                reducer(
                    {
                        countOfSittingsTaken: 100,
                    },
                    {
                        type: SET_COUNT_OF_SITTINGS_TAKEN,
                        payload: 100,
                    },
                ),
            ).toEqual({
                countOfSittingsTaken: 100,
            });
        });
    });

    describe('#SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP', () => {
        it('Should set countOfSittingsGivenThroughHeartsApp values based on payload', () => {
            expect(
                reducer(
                    {
                        countOfSittingsGivenThroughHeartsApp: 120,
                    },
                    {
                        type: SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP,
                        payload: 120,
                    },
                ),
            ).toEqual({
                countOfSittingsGivenThroughHeartsApp: 120,
            });
        });
    });

    describe('#SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE', () => {
        it('Should set countOfSittingsGivenOffline values based on payload', () => {
            expect(
                reducer(
                    {
                        countOfSittingsGivenOffline: 120,
                    },
                    {
                        type: SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE,
                        payload: 120,
                    },
                ),
            ).toEqual({
                countOfSittingsGivenOffline: 120,
            });
        });
    });

    describe('#SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS', () => {
        it('Should set isIntroductorySittingsCompletionDetailEnquiryFilled based on payload passed', () => {
            expect(
                reducer(
                    {
                        isIntroductorySittingsCompletionDetailEnquiryFilled: null,
                    },
                    {
                        type: SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS,
                        payload: true,
                    },
                ),
            ).toEqual({
                isIntroductorySittingsCompletionDetailEnquiryFilled: true,
            });
        });
    });
});
