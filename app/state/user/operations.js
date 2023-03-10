import {
    setAuthenticated,
    setHfnProfile as setHfnProfileAction,
    clearHfnProfile as clearHfnProfileAction,
    setTakenIntroductorySittings as setTakenIntroductorySittingsAction,
    setIntroductorySittingsCompletionDetailEnquiryFilledStatus as setIntroductorySittingsCompletionDetailEnquiryFilledStatusAction,
    updateShouldPlayGuidedRelaxationAudioSetting,
    updateWeeklyInspirationNotificationSubscriptionSetting,
    updateUserPreferenceSettings as updateUserPreferenceSettingsAction,
    setAgeConsentPopupVisibility as setAgeConsentPopupVisibilityAction,
    updateMeditationRemindersSettings as updateMeditationRemindersSettingsAction,
    setRemindForNextSessionButtonVisibilty as setRemindForNextSessionButtonVisibiltyAction,
    setCountOfSittingsTaken as setCountOfSittingsTakenAction,
    setCountOfSittingsGivenThroughHeartsApp as setCountOfSittingsGivenThroughHeartsAppAction,
    setCountOfSittingsGivenOffline as setCountOfSittingsGivenOfflineAction,
} from './actions';
import { isNil, get, isUndefined } from 'lodash';
import { AbhyasStage } from '../../shared/Constants';
import StorageService from '../../services/native/AppStorageService';
import { setUserStageForAnalytics } from '../../services/firebase/AnalyticsService';

export const setAuthenticationInfo = info => {
    return dispatch => {
        dispatch(setAuthenticated(!isNil(info), info));
        saveAuthenticationInfoToStorage(info);
    };
};
export const setUserPreferenceSettings = userPreference => {
    return dispatch => {
        dispatch(updateUserPreferenceSettingsAction(userPreference));
    };
};

const saveMeditationRemindersSettingsInStorage = value => {
    StorageService.meditationRemindersSettings.setValue(value);
};
const saveCountOfSittingsTakenInStorage = value => {
    StorageService.countOfSittingsTaken.setValue(value);
};
const saveCountOfSittingsGivenThroughHeartsAppInStorage = value => {
    StorageService.countOfSittingsGivenThroughHeartsApp.setValue(value);
};
const saveCountOfSittingsGivenOfflineInStorage = value => {
    StorageService.countOfSittingsGivenOffline.setValue(value);
};

export const setMeditationRemindersSettings = meditationRemindersSettings => {
    return dispatch => {
        saveMeditationRemindersSettingsInStorage(meditationRemindersSettings);
        dispatch(
            updateMeditationRemindersSettingsAction(
                meditationRemindersSettings,
            ),
        );
    };
};

export const setRemindForNextSessionButtonVisibility = visible => {
    return dispatch => {
        dispatch(setRemindForNextSessionButtonVisibiltyAction(visible));
    };
};

export const setCountOfSittingsTaken = countOfSittingsTaken => {
    return dispatch => {
        saveCountOfSittingsTakenInStorage(countOfSittingsTaken);
        dispatch(setCountOfSittingsTakenAction(countOfSittingsTaken));
    };
};
export const setCountOfSittingsGivenThroughHeartsApp = countOfSittingsGivenThroughHeartsApp => {
    return dispatch => {
        saveCountOfSittingsGivenThroughHeartsAppInStorage(
            countOfSittingsGivenThroughHeartsApp,
        );
        dispatch(
            setCountOfSittingsGivenThroughHeartsAppAction(
                countOfSittingsGivenThroughHeartsApp,
            ),
        );
    };
};
export const setCountOfSittingsGivenOffline = countOfSittingsGivenOffline => {
    return dispatch => {
        saveCountOfSittingsGivenOfflineInStorage(countOfSittingsGivenOffline);
        dispatch(
            setCountOfSittingsGivenOfflineAction(countOfSittingsGivenOffline),
        );
    };
};

export const loadMeditationRemindersSettingsFromStorage = async dispatch => {
    const meditationRemindersSettings = await StorageService.meditationRemindersSettings.getValue();

    if (!isUndefined(meditationRemindersSettings)) {
        dispatch(
            updateMeditationRemindersSettingsAction(
                meditationRemindersSettings,
            ),
        );
    }
};

const saveAuthenticationInfoToStorage = info => {
    StorageService.setAuthenticationInfo(info).catch(() => {});
};

export const setHfnProfileImage = profileURL => {
    return async (dispatch, getState) => {
        const hfnProfile = await StorageService.getHFNProfile();
        const updatedProfile = { ...hfnProfile, photoURL: profileURL };

        await StorageService.setHFNProfile(updatedProfile);
        setHfnProfile(updatedProfile)(dispatch, getState);
    };
};

export const setHfnProfile = hfnProfile => {
    return (dispatch, getState) => {
        dispatch(setHfnProfileAction(hfnProfile));
        saveHfnProfileToStorage(hfnProfile);

        if (!isUndefined(hfnProfile) && !isNil(hfnProfile)) {
            if (isAnonymous(getState())) {
                setUserStageForAnalytics();
            } else {
                setUserStageForAnalytics(get(hfnProfile, 'stage'));
            }
        } else {
            setUserStageForAnalytics(null);
        }
    };
};

const saveHfnProfileToStorage = hfnProfile => {
    if (isNil(hfnProfile) || isUndefined(hfnProfile)) {
        StorageService.clearHFNProfile();
    } else {
        StorageService.setHFNProfile(hfnProfile).catch(() => {});
    }
};

const saveTakenIntroductorySittingsToStorage = value => {
    StorageService.setUserTakenIntroductorySittings(value).catch(() => {});
};
const saveShouldPlayGuidedRelaxationAudioSettingInStorage = value => {
    StorageService.playGuidedRelaxationAudioBeforeMeditationSetting.setValue(
        value,
    );
};
const saveWeeklyInspirationNotificationSettingInStorage = value => {
    StorageService.hasSubscribedToWeeklyInspirationNotification.setValue(value);
};

const saveIntroductorySittingsCompletionDetailEnquiryFilledStatusInStorage = value => {
    StorageService.hasIntroductorySittingsCompletionDetailEnquiryFilled.setValue(
        value,
    );
};

export const setTakenIntroductorySittings = taken => {
    return dispatch => {
        dispatch(setTakenIntroductorySittingsAction(taken));
        saveTakenIntroductorySittingsToStorage(taken);
    };
};

export const setIntroductorySittingsCompletionDetailEnquiryFilledStatus = status => {
    return dispatch => {
        saveIntroductorySittingsCompletionDetailEnquiryFilledStatusInStorage(
            status,
        );
        dispatch(
            setIntroductorySittingsCompletionDetailEnquiryFilledStatusAction(
                status,
            ),
        );
    };
};

export const updateShouldPlayGuidedRelaxationAudio = audio => {
    return dispatch => {
        dispatch(updateShouldPlayGuidedRelaxationAudioSetting(audio));
        saveShouldPlayGuidedRelaxationAudioSettingInStorage(audio);
    };
};

export const updateWeeklyInspirationNotificationSubscriptionStatus = weeklyInspiration => {
    return dispatch => {
        saveWeeklyInspirationNotificationSettingInStorage(weeklyInspiration);
        dispatch(
            updateWeeklyInspirationNotificationSubscriptionSetting(
                weeklyInspiration,
            ),
        );
    };
};

export const clearUserProfile = () => {
    return dispatch => {
        dispatch(clearHfnProfileAction());
        clearHfnProfileToStorage();
        setAuthenticationInfo(null)(dispatch);
    };
};

const clearHfnProfileToStorage = () => {
    StorageService.clearHFNProfile().catch(() => {});
};

export const loadFromStorage = () => {
    return async dispatch => {
        await _loadAuthenticationInfoFromStorage(dispatch);
        await _loadHFNProfileFromStorage(dispatch);
        await _loadTakenIntroductorySittingsFromStorage(dispatch);
        await _loadIntroductorySittingsCompletionDetailEnquiryFilledFromStorage(
            dispatch,
        );
        await _loadGuidedRelaxationAudioFromStorage(dispatch);
        await _loadWeeklyInspirationNotificationSubscriptionStatusFromStorage(
            dispatch,
        );
        await _loadMeditationSessionCountFromStorage(dispatch);
        await loadMeditationRemindersSettingsFromStorage(dispatch);
    };
};

const _loadAuthenticationInfoFromStorage = async dispatch => {
    try {
        const info = await StorageService.getAuthenticationInfo();

        if (info) {
            setAuthenticationInfo(info)(dispatch);
        }
    } catch (err) {}
};

const _loadHFNProfileFromStorage = async (dispatch, getState) => {
    try {
        const hfnProfile = await StorageService.getHFNProfile();

        if (hfnProfile) {
            setHfnProfile(hfnProfile)(dispatch, getState);
        }
    } catch (err) {}
};

const _loadIntroductorySittingsCompletionDetailEnquiryFilledFromStorage = async dispatch => {
    try {
        const value =
            (await StorageService.hasIntroductorySittingsCompletionDetailEnquiryFilled.getValue()) ??
            false;
        dispatch(
            setIntroductorySittingsCompletionDetailEnquiryFilledStatus(value),
        );
    } catch (err) {}
};
const _loadTakenIntroductorySittingsFromStorage = async dispatch => {
    try {
        const taken = await StorageService.getUserTakenIntroductorySittings();
        setTakenIntroductorySittings(taken === true)(dispatch);
    } catch (err) {}
};
const _loadGuidedRelaxationAudioFromStorage = async dispatch => {
    try {
        const value =
            (await StorageService.playGuidedRelaxationAudioBeforeMeditationSetting.getValue()) ??
            false;
        dispatch(updateShouldPlayGuidedRelaxationAudioSetting(value));
    } catch (err) {}
};

const _loadWeeklyInspirationNotificationSubscriptionStatusFromStorage = async dispatch => {
    try {
        const value =
            (await StorageService.hasSubscribedToWeeklyInspirationNotification.getValue()) ??
            false;
        dispatch(updateWeeklyInspirationNotificationSubscriptionSetting(value));
    } catch (err) {}
};

const _loadMeditationSessionCountFromStorage = async dispatch => {
    try {
        const countOfSittingsTaken =
            (await StorageService.countOfSittingsTaken.getValue()) ?? 0;
        const countOfSittingsGivenThroughHeartsApp =
            (await StorageService.countOfSittingsGivenThroughHeartsApp.getValue()) ??
            0;
        const countOfSittingsGivenOffline =
            (await StorageService.countOfSittingsGivenOffline.getValue()) ?? 0;

        dispatch(setCountOfSittingsTakenAction(countOfSittingsTaken));
        dispatch(
            setCountOfSittingsGivenThroughHeartsApp(
                countOfSittingsGivenThroughHeartsApp,
            ),
        );
        dispatch(setCountOfSittingsGivenOffline(countOfSittingsGivenOffline));
    } catch (err) {}
};

export const isLoggedIn = state => {
    const authenticated = get(state.user, 'authenticated');
    return !isNil(authenticated) && authenticated;
};

export const isPreceptor = state => {
    return get(state.user, 'hfnProfile.stage') === AbhyasStage.PRECEPTOR;
};
export const shouldPlayGuidedRelaxation = state => {
    return state?.user?.shouldPlayGuidedRelaxationAudio ?? false;
};

export const hasUserSubscribedToWeeklyInspirationNotification = state => {
    return get(state, 'user.isWeeklyInspirationNotificationSubscribed', false);
};

export const isAnonymous = state => {
    const val = get(state.user, 'hfnProfile.anonymous');

    return isUndefined(val) || isNil(val) || val;
};

export const isReminderForNextSittingEnabled = state => {
    return get(
        state.user,
        'meditationRemindersSettings.isReminderForNextSittingEnabled',
    );
};

export const nextSittingReminderIntervalInDays = state => {
    return get(
        state.user,
        'meditationRemindersSettings.nextSittingReminderIntervalInDays',
    );
};

export const hasTakenIntroductorySittings = state => {
    if (!get(state.user, 'takenIntroductorySittings')) {
        return (
            get(state.user, 'hfnProfile.stage') === AbhyasStage.SEEKER ||
            get(state.user, 'hfnProfile.stage') === AbhyasStage.ABHYASI ||
            get(state.user, 'hfnProfile.stage') === AbhyasStage.PRECEPTOR
        );
    }

    return true;
};

export const hasIntroductorySittingsCompletionDetailEnquiryFilled = state => {
    if (
        !get(state.user, 'isIntroductorySittingsCompletionDetailEnquiryFilled')
    ) {
        return (
            get(state.user, 'hfnProfile.stage') === AbhyasStage.ABHYASI ||
            get(state.user, 'hfnProfile.stage') === AbhyasStage.PRECEPTOR
        );
    }

    return true;
};

export const setAgeConsentPopupVisibility = isAgeConsentPopupVisibile => {
    return dispatch => {
        dispatch(setAgeConsentPopupVisibilityAction(isAgeConsentPopupVisibile));
    };
};
export const getCountOfSittingsGivenThroughHeartsApp = state => {
    const sessionCount = get(
        state.user,
        'countOfSittingsGivenThroughHeartsApp',
    );
    return sessionCount.toLocaleString('en-IN');
};
export const getCountOfSittingsGivenOffline = state => {
    const sessionCount = get(state.user, 'countOfSittingsGivenOffline');
    return sessionCount.toLocaleString('en-IN');
};
