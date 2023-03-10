import { Platform, AppState, NativeModules } from 'react-native';
import { find, get } from 'lodash';
import i18n from 'i18next';

export const Scenes = {
    appEntryPoint: 'appEntryPoint',
    newToHeartfulness: 'newToHeartfulness',
    onboarding: 'onboarding',
    masterClassesScreen: 'masterClassesScreen',
    signIn: 'signIn',
    seekerMeditationSession: 'seekerMeditationSession',
    requestorMeditationSession: 'requestorMeditationSession',
    donationPromptingMeditation: 'donationPromptingMeditation',
    paymentScreen: 'paymentScreen',
    signUp: 'signUp',
    helpDesk: 'helpDesk',
    forgotPassword: 'forgotPassword',
    home: 'home',
    locate: 'locate',
    weeklyInspiration: 'weeklyInspiration',
    preceptorMeditationSession: 'preceptorMeditationSession',
    more: 'more',
    dataDoesNotMatch: 'dataDoesNotMatch',
    readAndReflect: 'readAndReflect',
    exploreScreen: 'exploreScreen',
    webViewScreen: 'webViewScreen',
    basicPracticesScreen: 'basicPracticesScreen',
    profileScreen: 'profileScreen',
    personalInfoScreen: 'personalInfoScreen',
    lifeStyleScreen: 'lifeStyleScreen',
    donationFormScreen: 'DonationFormScreen',
    myAccountScreen: 'myAccountScreen',
    changePasswordScreen: 'changePasswordScreen',
    themeSelectionScreen: 'themeSelectionScreen',
    seekerMeditationCancellationReasonScreen:
        'seekerMeditationCancellationReasonScreen',
    notificationSettingsScreen: 'notificationSettingsScreen',
    reminderSettingsScreen: 'reminderSettingsScreen',
    experienceInMeditationScreen: 'experienceInMeditationScreen',
    meditationExperienceDetailScreen: 'meditationExperienceDetailScreen',
    whatAreYouLookingForScreen: 'whatAreYouLookingForScreen',
    spotlight: 'spotlight',
    introSittingCompletionEnquiryScreen: 'introSittingCompletionEnquiryScreen',
    benefitsOfMeditatingWithTrainer: 'benefitsOfMeditatingWithTrainerScreen',
    introductorySittingsAttestationScreen:
        'introductorySittingsAttestationScreen',
    additionalAbhyasisMeditatingInputScreen:
        'additionalAbhyasisMeditatingInputScreen',
    introductorySittingCompletionDetailsEnquiryScreen:
        'introductorySittingCompletionDetailsEnquiryScreen',
    sittingHistoryScreen: 'sittingHistoryScreen',
    heartSpotSettingsScreen: 'heartSpotSettingsScreen',
    heartSpotLocationSelectionScreen: 'heartSpotLocationSelectionScreen',
    sittingDetailsScreen: 'sittingDetailsScreen',
    donationOptionsScreen: 'donationOptionsScreen',
    recurringDonationScreen: 'recurringDonationScreen',
    offlineMeditationSessionScreen: 'offlineMeditationSessionScreen',
    trainersSectionWebViewScreen: 'trainersSectionWebViewScreen',
    trainersSectionScreen: 'trainersSectionScreen',
};

export const NotificationCategory = {
    MEDITATION_SERVICE: 'MEDITATION_SERVICE',
    SCHEDULED_CONTENT_SERVICE: 'SCHEDULED_CONTENT_SERVICE',
};

export const NotificationSubCategory = {
    WAITING_FOR_PRECEPTOR_TO_START: 'WAITING_FOR_PRECEPTOR_TO_START',
    WAITING_FOR_PRECEPTOR_TO_START_BATCH:
        'WAITING_FOR_PRECEPTOR_TO_START_BATCH',
    TIMED_OUT: 'TIMED_OUT',
    IN_PROGRESS_TIMED_OUT: 'IN_PROGRESS_TIMED_OUT',
    BATCH_MEDITATION_COMPLETED: 'BATCH_MEDITATION_COMPLETED',
    MEDITATION_COMPLETED: 'MEDITATION_COMPLETED',
    IN_PROGRESS: 'IN_PROGRESS',
    IN_PROGRESS_BATCH: 'IN_PROGRESS_BATCH',
    MASTER_SITTING: 'MASTER_SITTING',
    LOW_PRECEPTOR_CONDITION: 'LOW_PRECEPTOR_CONDITION',
    ZERO_PRECEPTOR_CONDITION: 'ZERO_PRECEPTOR_CONDITION',
    WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY:
        'WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY',
    MORNING_MEDITATION_REMINDER_SUBCATEGORY:
        'MORNING_MEDITATION_REMINDER_SUBCATEGORY',
    EVENING_CLEANING_REMINDER_SUBCATEGORY:
        'EVENING_CLEANING_REMINDER_SUBCATEGORY',
    MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY:
        'MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY',
    MASTER_CLASS_REMINDER_SUBCATEGORY: 'MASTER_CLASS_REMINDER_SUBCATEGORY',
};

export const AbhyasStage = {
    NEWBIE: 0, // not taken three sittings yet
    SEEKER: 1,
    ABHYASI: 2, // regular abhyasi
    PRECEPTOR: 3,
};

export const SEEKER_MEDITATION_UI_STATE = {
    PLAY_GUIDE_RELAXATION_SOUND: -1,
    CONNECTING_TO_TRAINER: 0,
    WAITING_FOR_TRAINER_TO_ACCEPT: 1,
    WAITING_FOR_TRAINER_TO_START: 2,
    PLAY_PLEASE_START_MEDITATION_SOUND: 3,
    MEDITATION_IN_PROGRESS: 4,
    MASTER_SITTING_IN_PROGRESS: 5,
    PLAY_THATS_ALL_SOUND: 6,
    MEDITATION_COMPLETED: 7,
    SITTING_LIMIT_EXCEEDED: 8,
    SITTING_LIMIT_EXCEEDED_FOR_PERIOD: 9,
    SITTING_CANCELLED: 10,
};

export const PRECEPTOR_MEDITATION_UI_STATE = {
    PRECEPTOR_AVAILABLE_FOR_SITTING: 0,
    WAITING_FOR_PRECEPTOR_TO_ACCEPT: 1,
    PLAY_MEDITATION_REQUEST_SOUND: 2,
    PRECEPTOR_ACCEPTED_YET_TO_START: 3,
    PLAY_START_SOUND: 4,
    MEDITATION_IN_PROGRESS: 5,
    PLAY_END_SOUND: 6,
    MEDITATION_COMPLETED: 7,
};

export const SITTING_STATE = {
    NO_SITTING: 0, // Same as initial
    WAITING_FOR_SCHEDULING: 1,
    HEART_BEAT_SITTING_STATE: 2,

    SCHEDULED: 3,

    IN_PERSON_SITTING_STATE: 4,
    READY_STATE: 5,
    SEEKER_READY_STATE: 6,
    PRECEPTOR_READY_STATE: 7,
    READY_FOR_SITTING: 8,

    WAITING_FOR_PRECEPTOR_TO_START: 9,
    PRECEPTOR_NOT_AVAILABLE: 10,
    PRECEPTOR_CANCELLED: 11,

    SEEKER_CANCELLED: 12,
    SEEKER_NOT_AVAILABLE: 13,

    STARTED: 14,
    IN_PROGRESS: 15,
    MEDITATION_COMPLETED: 16,
    PRECEPTOR_COMPLETED: 17,
    SEEKER_COMPLETED: 18,
    COMPLETED: 19,

    TIMED_OUT: 20,
    ERROR: 21,

    SITTING_LIMIT_EXCEEDED: 22,
    UPCOMING_SITTING: 23,

    WAITING_FOR_PRECEPTOR_TO_START_BATCH: 24,
    STARTED_BATCH: 25,
    IN_PROGRESS_BATCH: 26,

    MASTER_SITTING: 27,
    BATCH_MEDITATION_COMPLETED: 28,

    SITTING_LIMIT_EXCEEDED_FOR_PERIOD: 29,
};

export const IsIOS = Platform.OS === 'ios';
export const IsAndroid = Platform.OS === 'android';

export const DEFAULT_TRAINER_NAME = 'trainer';
export const MASTER_PRECEPTOR_ID = 'MASTER_PRECEPTOR_ID';

export const isAppInBackground = () => {
    return (
        AppState.currentState === 'background' ||
        AppState.currentState === 'inactive'
    );
};

export const isSessionInProgress = state => {
    switch (state) {
        case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START_BATCH:
        case SITTING_STATE.WAITING_FOR_PRECEPTOR_TO_START:
        case SITTING_STATE.STARTED:
        case SITTING_STATE.STARTED_BATCH:
        case SITTING_STATE.IN_PROGRESS:
        case SITTING_STATE.IN_PROGRESS_BATCH:
            return true;

        default:
            return false;
    }
};

export const MASTERCLASS_VIDEOS = {
    INTRO_TO_MASTERCLASS: 'introductionAboutMasterClasses',
    DAY1: 'day1',
    DAY2: 'day2',
    DAY3: 'day3',
};

export const BASIC_PRACTICES_VIDEOS = {
    RELAXATION: 'RELAXATION',
    MEDITATION: 'MEDITATION',
    CLEANING: 'CLEANING',
    PRAYER: 'PRAYER',
};

export const LIFE_STYLE_VIDEOS = {
    INTRODUCTION: 'INTRODUCTION',
    STRESS_DETOX: 'STRESS_DETOX',
    FEAR_DETOX: 'FEAR_DETOX',
    ANGER_DETOX: 'ANGER_DETOX',
    SLEEP: 'SLEEP',
};

export const getDefaultLanguageToSelect = config => {
    const languageInRemoteConfig = find(config.languages, {
        value: i18n.language,
    });
    return get(languageInRemoteConfig, 'value', 'en');
};

export const DONATION = {
    DONATION_URL: NativeModules.ApplicationConstants.DONATION_URL,
    RECURRING_DONATION_URL:
        NativeModules.ApplicationConstants.RECURRING_DONATION_URL,
    STATUS_SUCCESS: 'status=success',
    STATUS_FAILURE: 'status=failure',
    STATUS_AUTHENTICATION_FAILED: 'status=AUTHENTICATION_FAILED',
    STATUS_EMAIL_SUCCESS: 'status=emailsuccess',
    STATUS_EMAIL_FAILURE: 'status=emailfailure',
    CANCEL: 'cancel',
    UNDEFINED: 'undefined',
};

export const PROVIDER_ID = {
    PROVIDER: 'password',
};

export const DEEP_LINK_HOST = {
    MAGAZINE: 'heartfulnessmagazine.com',
};
export const WEEKLY_INSPIRATION_SOCIAL_SHARE = {
    FACEBOOK: 'www.facebook.com',
    TWITTER: 'twitter.com',
    WHATSAPP: 'api.whatsapp.com',
};
export const NOTIFICATION_CHANNEL_ID = {
    SILENT_NOTIFICATION: 'Silent Notification',
    GENERAL: 'General Notification',
    MEDITATION_START: 'Meditation start',
    MEDITATION_END: 'Meditation end',
    TRAINER_INCOMING_SESSION: 'Trainer incoming session',
};

export const MEDITATION_CANCEL_OPTION = {
    HERE_BY_MISTAKE: 'HERE_BY_MISTAKE',
    NOT_READY_YET: 'NOT_READY_YET',
    SOMETHING_ELSE_HAS_COME_UP: 'SOMETHING_ELSE_HAS_COME_UP',
    OTHER_REASONS: 'OTHER_REASONS',
};
export const REMINDER = {
    maxCount: 9,
    morning: 'morning',
    daily: 'day',
    morningImage: 'morning_meditation_reminder_icon',
    eveningImage: 'evening_cleaning_reminder_icon',
    trainerImage: 'meditate_with_trainer_reminder_icon',
    masterClassDay2ReminderContentId: 'day1',
    masterClassDay3ReminderContentId: 'day2',
};
export const SITTING_TYPES = {
    SITTING_GIVEN: 1,
    SITTING_TAKEN: 2,
};
export const SITTING_APP_TYPES = {
    HEARTS_APP: 0,
    WITHOUT_USING_APP: 1,
    ALL: 5,
};

export const LOCATION_CONFIG = {
    GOOGLE_PLACE_API_KEY:
        NativeModules.ApplicationConstants.GOOGLE_PLACE_API_KEY,
    LATITUDE_DELTA: 0.015,
    LONGITUDE_DELTA: 0.0121,
};
export const LOCATION_STATUS = {
    FETCHING: 'FETCHING',
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
};
export const OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS = {
    TRACK_PAST: 'TRACK_PAST',
    TRACK_NOW: 'TRACK_NOW',
    TRACK_NOW_COMPLETED: 'TRACK_NOW_COMPLETED',
};

export const SITTING_HISTORY_FILTER_OPTION = {
    THROUGH_HEARTSAPP: 'THROUGH_HEARTSAPP',
    OUT_SIDE_HEARTSAPP: 'OUT_SIDE_HEARTSAPP',
    ALL: 'ALL',
};
export const OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE = {
    MEDITATION_YET_TO_START: 'MEDITATION_YET_TO_START',
    MEDITATION_IN_PROGRESS: 'MEDITATION_IN_PROGRESS',
    MEDITATION_COMPLETED: 'MEDITATION_COMPLETED',
};

export const MY_SRCM_CITIES_URL =
    NativeModules.ApplicationConstants.MY_SRCM_CITIES_URL;
export const MYSRCM_CLIENT_ID =
    NativeModules.ApplicationConstants.MYSRCM_CLIENT_ID;

export const EVENT_TRACKER_POST_MESSAGE_TYPE = {
    REQUEST_TOKEN: 'REQUEST_TOKEN',
    EXPIRED_TOKEN: 'EXPIRED_TOKEN',
};

export const OFFLINE_SEEKERS_SELECTED_LIMIT = 10;
export const EVENT_TRACKER = 'EVENT_TRACKER';
