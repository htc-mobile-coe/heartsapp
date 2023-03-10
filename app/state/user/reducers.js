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
import { getMeditationRemindersSettingsConfig } from '../../services/firebase/RemoteConfigService';

const initial = {
    authenticated: null,
    firebaseUserInfo: null,
    hfnProfile: null,
    takenIntroductorySittings: false,
    isIntroductorySittingsCompletionDetailEnquiryFilled: false,
    shouldPlayGuidedRelaxationAudio: false,
    isWeeklyInspirationNotificationSubscribed: false,
    isAgeConsentPopupVisibile: false,
    meditationRemindersSettings: getMeditationRemindersSettingsConfig(),
    showRemindForNextSessionButton: true,
    countOfSittingsTaken: 0,
    countOfSittingsGivenThroughHeartsApp: 0,
    countOfSittingsGivenOffline: 0,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_AUTH_STATE:
        case SET_HFN_PROFILE:
        case SET_MEDITATION_REMINDERS_SETTINGS:
            return {
                ...previousState,
                ...action.payload,
            };

        case CLEAR_HFN_PROFILE:
            return {
                ...previousState,
                hfnProfile: null,
            };

        case SET_PLAY_GUIDED_RELAXATION_AUDIO:
            return {
                ...previousState,
                shouldPlayGuidedRelaxationAudio:
                    action.payload.shouldPlayGuidedRelaxationAudio,
            };

        case SET_TAKEN_INTODUCTORY_SITTINGS:
            return {
                ...previousState,
                takenIntroductorySittings: action.payload,
            };

        case SET_INTODUCTORY_SITTINGS_COMPLETION_DETAIL_ENQUIRY_FILLED_STATUS:
            return {
                ...previousState,
                isIntroductorySittingsCompletionDetailEnquiryFilled:
                    action.payload,
            };

        case SET_WEEKLY_INSPIRATION_NOTIFICATION_SUBSCRIPTION_STATUS:
            return {
                ...previousState,
                isWeeklyInspirationNotificationSubscribed:
                    action.payload.isWeeklyInspirationNotificationSubscribed,
            };

        case SET_USER_PREFERENCE_SITTINGS:
            return {
                ...previousState,
                isWeeklyInspirationNotificationSubscribed:
                    action.payload.isWeeklyInspirationNotificationSubscribed,
                shouldPlayGuidedRelaxationAudio:
                    action.payload.shouldPlayGuidedRelaxationAudio,
            };

        case SET_AGE_CONSENT_POPUP_VISIBILITY:
            return {
                ...previousState,
                isAgeConsentPopupVisibile: action.payload,
            };
        case SET_REMIND_FOR_NEXT_SESSION_BUTTON_VISIBILITY:
            return {
                ...previousState,
                showRemindForNextSessionButton: action.payload,
            };
        case SET_COUNT_OF_SITTINGS_TAKEN:
            return {
                ...previousState,
                countOfSittingsTaken: action.payload,
            };
        case SET_COUNT_OF_SITTINGS_GIVEN_THROUGH_HEARTSAPP:
            return {
                ...previousState,
                countOfSittingsGivenThroughHeartsApp: action.payload,
            };
        case SET_COUNT_OF_SITTINGS_GIVEN_OFFLINE:
            return {
                ...previousState,
                countOfSittingsGivenOffline: action.payload,
            };
        default:
            return previousState;
    }
};
