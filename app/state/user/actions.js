import {
    SET_AUTH_STATE,
    SET_HFN_PROFILE,
    CLEAR_HFN_PROFILE,
    SET_TAKEN_INTODUCTORY_SITTINGS,
    SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS,
    SET_PLAY_GUIDED_RELAXATION_AUDIO,
    SET_WEEKLY_INSPIRATION_NOTIFICATION_SUBSCRIPTION_STATUS,
    SET_USER_PREFERENCE_SITTINGS,
    SET_AGE_CONSENT_POPUP_VISIBILITY,
    SET_MEDITATION_REMINDERS_SETTINGS,
    SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY,
    SET_COUNT_OF_SITTINGS_TAKEN,
    SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP,
    SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE,
} from './types';

export const setAuthenticated = (authenticated, firebaseUserInfo) => {
    return {
        type: SET_AUTH_STATE,
        payload: {
            authenticated,
            firebaseUserInfo,
        },
    };
};

export const setHfnProfile = hfnProfile => {
    return {
        type: SET_HFN_PROFILE,
        payload: {
            hfnProfile,
        },
    };
};

export const clearHfnProfile = () => {
    return {
        type: CLEAR_HFN_PROFILE,
    };
};

export const setTakenIntroductorySittings = taken => {
    return {
        type: SET_TAKEN_INTODUCTORY_SITTINGS,
        payload: taken,
    };
};

export const setIntroductorySittingsCompletionDetailEnquiryFilledStatus = taken => {
    return {
        type: SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS,
        payload: taken,
    };
};

export const updateShouldPlayGuidedRelaxationAudioSetting = shouldPlayGuidedRelaxationAudio => {
    return {
        type: SET_PLAY_GUIDED_RELAXATION_AUDIO,
        payload: { shouldPlayGuidedRelaxationAudio },
    };
};

export const updateWeeklyInspirationNotificationSubscriptionSetting = isWeeklyInspirationNotificationSubscribed => {
    return {
        type: SET_WEEKLY_INSPIRATION_NOTIFICATION_SUBSCRIPTION_STATUS,
        payload: { isWeeklyInspirationNotificationSubscribed },
    };
};
export const updateUserPreferenceSettings = userPreference => {
    return {
        type: SET_USER_PREFERENCE_SITTINGS,
        payload: userPreference,
    };
};

export const setAgeConsentPopupVisibility = isAgeConsentPopupVisibile => {
    return {
        type: SET_AGE_CONSENT_POPUP_VISIBILITY,
        payload: isAgeConsentPopupVisibile,
    };
};
export const updateMeditationRemindersSettings = meditationRemindersSettings => {
    return {
        type: SET_MEDITATION_REMINDERS_SETTINGS,
        payload: { meditationRemindersSettings },
    };
};

export const setRemindForNextSessionButtonVisibilty = visible => {
    return {
        type: SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY,
        payload: visible,
    };
};

export const setCountOfSittingsTaken = count => {
    return {
        type: SET_COUNT_OF_SITTINGS_TAKEN,
        payload: count,
    };
};

export const setCountOfSittingsGivenThroughHeartsApp = count => {
    return {
        type: SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP,
        payload: count,
    };
};

export const setCountOfSittingsGivenOffline = count => {
    return {
        type: SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE,
        payload: count,
    };
};
