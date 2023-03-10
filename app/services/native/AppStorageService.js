import AsyncStorage from '@react-native-async-storage/async-storage';
import { isNil, isUndefined } from 'lodash';
import StorageItem from './StorageItem';

const setValue = (key, value) => {
    return AsyncStorage.setItem(key, value);
};

const getValue = key => {
    return AsyncStorage.getItem(key);
};

const remove = key => {
    return AsyncStorage.removeItem(key);
};

const ONBOARDING_STATUS = 'ORG_HEARTSAPP_ONBOARDING_STATUS';
const MASTER_CLASS_PROGRESS = 'ORG_HEARTSAPP_MASTER_CLASS_PROGRESS';
const MASTER_CLASS_SERVER_LOGGING_STATUS =
    'ORG_HEARTSAPP_MASTER_CLASS_SERVER_LOGGING_STATUS';
const AUTHENTICATION_INFO = 'ORG_HEARTSAPP_AUTHENTICATION_INFO';
const HFN_PROFILE = 'ORG_HEARTSAPP_HFN_PROFILE';
const PRECEPTOR_AVAILABILITY_STATUS =
    'ORG_HEARTSAPP_PRECEPTOR_AVAILABILITY_STATUS';
const ONGOING_MEDITATION_SESSION = 'ORG_HEARTSAPP_ONGOING_MEDITATION_SESSION';
const ONGOING_SEEKER_MEDITATION_SESSION =
    'ORG_HEARTSAPP_ONGOING_SEEKER_MEDITATION_SESSION';
const USER_TAKEN_INTRODUCTORY_SITTINGS =
    'ORG_HEARTSAPP_USER_TAKEN_INTRODUCTORY_SITTINGS';
const ONGOING_MASTER_SITTING = 'ORG_HEARTSAPP_ONGOING_MASTER_SITTING';

const AppStorageService = {
    setOnboardingStatus(value) {
        return setValue(ONBOARDING_STATUS, JSON.stringify(value));
    },
    getOnboardingStatus() {
        return getValue(ONBOARDING_STATUS).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearOnboardingStatus() {
        return remove(ONBOARDING_STATUS);
    },

    setMasterClassProgress(value) {
        return setValue(MASTER_CLASS_PROGRESS, value);
    },
    getMasterClassProgress() {
        return getValue(MASTER_CLASS_PROGRESS);
    },
    clearMasterClassProgress() {
        return remove(MASTER_CLASS_PROGRESS);
    },

    setMasterClassServerLoggingStatus(value) {
        return setValue(
            MASTER_CLASS_SERVER_LOGGING_STATUS,
            JSON.stringify(value),
        );
    },
    getMasterClassServerLoggingStatus() {
        return getValue(MASTER_CLASS_SERVER_LOGGING_STATUS);
    },
    clearMasterClassServerLoggingStatus() {
        return remove(MASTER_CLASS_SERVER_LOGGING_STATUS);
    },

    setAuthenticationInfo(value) {
        return setValue(AUTHENTICATION_INFO, JSON.stringify(value));
    },
    getAuthenticationInfo() {
        return getValue(AUTHENTICATION_INFO).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearAuthenticationInfo() {
        return remove(AUTHENTICATION_INFO);
    },

    setHFNProfile(value) {
        return setValue(HFN_PROFILE, JSON.stringify(value));
    },
    getHFNProfile() {
        return getValue(HFN_PROFILE).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearHFNProfile() {
        return remove(HFN_PROFILE);
    },

    setPreceptorAvailabilityStatus(value) {
        return setValue(PRECEPTOR_AVAILABILITY_STATUS, JSON.stringify(value));
    },
    getPreceptorAvailabilityStatus() {
        return getValue(PRECEPTOR_AVAILABILITY_STATUS).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearPreceptorAvailabilityStatus() {
        return remove(PRECEPTOR_AVAILABILITY_STATUS);
    },

    setOngoingMeditationSession(value) {
        return setValue(ONGOING_MEDITATION_SESSION, JSON.stringify(value));
    },
    getOngoingMeditationSession() {
        return getValue(ONGOING_MEDITATION_SESSION).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearOngoingMeditationSession() {
        return remove(ONGOING_MEDITATION_SESSION);
    },

    setUserTakenIntroductorySittings(value) {
        return setValue(
            USER_TAKEN_INTRODUCTORY_SITTINGS,
            JSON.stringify(value),
        );
    },
    getUserTakenIntroductorySittings() {
        return getValue(USER_TAKEN_INTRODUCTORY_SITTINGS).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearUserTakenIntroductorySittings() {
        return remove(USER_TAKEN_INTRODUCTORY_SITTINGS);
    },

    setOngoingSeekerMeditationSession(value) {
        return setValue(
            ONGOING_SEEKER_MEDITATION_SESSION,
            JSON.stringify(value),
        );
    },
    getOngoingSeekerMeditationSession() {
        return getValue(ONGOING_SEEKER_MEDITATION_SESSION).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },
    clearOngoingSeekerMeditationSession() {
        return remove(ONGOING_SEEKER_MEDITATION_SESSION);
    },

    setOngoingMasterSitting(value) {
        return setValue(ONGOING_MASTER_SITTING, JSON.stringify(value));
    },
    getOngoingMasterSitting() {
        return getValue(ONGOING_MASTER_SITTING).then(value => {
            const valueIsPresent = !isUndefined(value) && !isNil(value);

            if (valueIsPresent) {
                return JSON.parse(value);
            }

            return undefined;
        });
    },

    clearOngoingMasterSitting() {
        return remove(ONGOING_MASTER_SITTING);
    },
    playGuidedRelaxationAudioBeforeMeditationSetting: new StorageItem(
        'ORG_HEARTSAPP_PLAY_GUIDED_RELAXATION_AUDIO_SETTING',
    ),
    versionNumberForWhichWhatsNewPopupShown: new StorageItem(
        'ORG_HEARTSAPP_VERSION_NUMBER_FOR_WHICH_WHATS_NEW_POPUP_SHOWN',
    ),
    appLocale: new StorageItem('ORG_HEARTSAPP_APP_LOCALE'),

    zeroPreceptorNotificationEnabled: new StorageItem(
        'ORG_HEARTSAPP_ZERO_PRECEPTOR_NOTIFICATION_ENABLED',
    ),

    zeroPreceptorNotificationSubscriptionMachine: new StorageItem(
        'ORG_HEARTSAPP_ZERO_PRECEPTOR_NOTIFICATION_FSM',
    ),
    sittingMetrics: new StorageItem('ORG_HEARTSAPP_SITTING_METRICS_STORAGE'),
    appTheme: new StorageItem('ORG_HEARTSAP_APP_THEME_SETTING'),

    ageConsentTimeStamp: new StorageItem('ORG_HEARTSAPP_AGE_CONSENT_TIMESTAMP'),

    meditationRemindersSettings: new StorageItem(
        'ORG_HEARTSAPP_MEDITATION_REMINDERS_SETTINGS',
    ),

    hasSubscribedToWeeklyInspirationNotification: new StorageItem(
        'ORG_HEARTSAPP_HAS_SUBSCRIBED_TO_WEEKLY_INSPIRATION_NOTIFICATION',
    ),
    hasMorningMeditationReminderNotificationEnabled: new StorageItem(
        'ORG_HEARTSAPP_MORNING_MEDITATION_REMINDER_NOTIFICATION_ENABLED',
    ),
    hasEveningCleaningReminderNotificationEnabled: new StorageItem(
        'ORG_HEARTSAPP_EVENING_CLEANING_REMINDER_NOTIFICATION_ENABLED',
    ),
    morningMeditationReminderTime: new StorageItem(
        'ORG_HEARTSAPP_MORNING_MEDITATION_REMINDER_TIME',
    ),
    eveningCleaningReminderTime: new StorageItem(
        'ORG_HEARTSAPP_EVENING_CLEANING_REMINDER_TIME',
    ),

    morningMeditationReminderNotificationId: new StorageItem(
        'ORG_HEARTSAPP_MORNING_MEDITATION_REMINDER_NOTIFICATION_ID',
    ),
    eveningCleaningReminderNotificationId: new StorageItem(
        'ORG_HEARTSAPP_EVENING_CLEANING_REMINDER_NOTIFICATION_ID',
    ),
    meditateWithTrainerReminderNotificationId: new StorageItem(
        'ORG_HEARTSAPP_MEDITATE_WITH_TRAINER_REMINDER_NOTIFICATION_ID',
    ),
    morningMeditationSchedulingNotificationId: new StorageItem(
        'ORG_HEARTSAPP_MORNING_MEDITATION_SCHEDULING_NOTIFICATION_ID',
    ),
    eveningCleaningSchedulingNotificationId: new StorageItem(
        'ORG_HEARTSAPP_EVENING_CLEANING_SCHEDULING_NOTIFICATION_ID',
    ),
    meditateWithTrainerReminderSchedulingNotificationId: new StorageItem(
        'ORG_HEARTSAPP_MEDITATE_WITH_TRAINER_REMINDER_SCHEDULING_NOTIFICATION_ID',
    ),
    meditateWithTrainerFollowUpReminderSchedulingNotificationId: new StorageItem(
        'ORG_HEARTSAPP_MEDITATE_WITH_TRAINER_FOLLOWUP_REMINDER_SCHEDULING_NOTIFICATION_ID',
    ),
    hasHomeSpotLightDisplayedOnce: new StorageItem(
        'ORG_HEARTSAPP_HAS_HOME_SPOTLIGHT_DISPLAYED_ONCE',
    ),
    day2MasterClassReminderSchedulingNotificationId: new StorageItem(
        'ORG_HEARTSAPP_DAY_2_MASTER_CLASS_REMINDER_SCHEDULING_NOTIFICATION_ID',
    ),
    day3MasterClassReminderSchedulingNotificationId: new StorageItem(
        'ORG_HEARTSAPP_DAY_3_MASTER_CLASS_REMINDER_SCHEDULING_NOTIFICATION_ID',
    ),
    countOfSittingsTaken: new StorageItem(
        'ORG_HEARTSAPP_COUNT_OF_SITTINGS_TAKEN',
    ),
    countOfSittingsGivenThroughHeartsApp: new StorageItem(
        'ORG_HEARTSAPP_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP',
    ),
    countOfSittingsGivenOffline: new StorageItem(
        'ORG_HEARTSAPP_COUNT_OF_SITTINGS_GIVEN_OFFLINE',
    ),
    preceptorPostMeditationExperienceRecordingOption: new StorageItem(
        'ORG_HEARTSAPP_PRECEPTOR_POST_MEDITATION_EXPERIENCE_RECORDING_OPTION',
    ),
    hasIntroductorySittingsCompletionDetailEnquiryFilled: new StorageItem(
        'ORG_HEARTSAPP_HAS_INTRODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED',
    ),
    offlinePreceptorMeditationStartedTime: new StorageItem(
        'ORG_HEARTSAPP_OFFLINE_PRECEPTOR_MEDITATION_STARTED_TIME',
    ),
    preceptorSearchedSeekerDates: new StorageItem(
        'ORG_HEARTSAPP_PRECEPTOR_SEARCHED_SEEKER_DATES',
    ),
    showHeartInTuneBanner: new StorageItem(
        'ORG_HEARTSAPP_SHOW_HEART_IN_TUNE_BANNER',
    ),
    showHeartInTuneAppDownloadPopup: new StorageItem(
        'ORG_HEARTSAPP_SHOW_HEART_IN_TUNE_APP_DOWNLOAD_POPUP',
    ),
};

export default AppStorageService;
