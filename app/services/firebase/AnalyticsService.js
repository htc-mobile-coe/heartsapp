import analytics from '@react-native-firebase/analytics';
import { AbhyasStage } from '../../shared/Constants';
import { isEmpty } from 'lodash';
import { logEvent as logForFBAnalytics } from '../FacebookAppEventsService';

export const logLogin = method => {
    analytics()
        .logLogin({
            method,
        })
        .catch(() => {});

    logForFBAnalytics(`${method}_login`);
};

export const logSignUp = () => {
    analytics()
        .logSignUp({
            method: 'emailPassword',
        })
        .catch(() => {});
    logForFBAnalytics(`signUp`);
};

export const setUserIdForAnalytics = userId => {
    analytics()
        .setUserId(userId)
        .catch(() => {});
};

export const setUserStageForAnalytics = stage => {
    let _stage = 'anonymous';

    if (isEmpty(stage)) {
        analytics()
            .setUserProperty('user_stage', 'anonymous')
            .catch(() => {});
    }

    switch (stage) {
        case AbhyasStage.SEEKER:
            _stage = 'seeker';
            break;

        case AbhyasStage.NEWBIE:
            _stage = 'newbie';
            break;

        case AbhyasStage.ABHYASI:
            _stage = 'abhyasi';
            break;

        case AbhyasStage.PRECEPTOR:
            _stage = 'preceptor';
            break;

        default:
            _stage = 'anonymous';
            break;
    }

    analytics()
        .setUserProperty('user_stage', _stage)
        .catch(() => {});
};

export const setCurrentSceneForAnalytics = sceneName => {
    analytics()
        .setCurrentScreen(sceneName, sceneName)
        .catch(() => {});
    logForFBAnalytics(`navigate_to_scene_${sceneName}`);
};

export const setAppLocale = locale => {
    analytics()
        .setUserProperty('app_locale', locale)
        .catch(() => {});
};

export const logLogout = async () => {
    try {
        await analytics().logEvent('logout');
        await analytics().setUserProperty('user_stage', null);
        setUserIdForAnalytics(null);
        logForFBAnalytics('logout');
    } catch (e) {}
};

export const logSessionExpired = async () => {
    try {
        await analytics().logEvent('sessionExpired');
        await analytics().setUserProperty('user_stage', null);
        setUserIdForAnalytics(null);
        logForFBAnalytics('session_expired');
    } catch (e) {}
};

export const logDeactivateAccount = async () => {
    try {
        await analytics().logEvent('deactivate_account');
        await analytics().setUserProperty('user_stage', null);
        setUserIdForAnalytics(null);
        logForFBAnalytics('deactivate_account');
    } catch (e) {}
};

export const logProfilePress = scene => {
    logEvent('profile_press', scene);
    logForFBAnalytics('profile_press');
};

export const logHelpDeskPress = scene => {
    logEvent('help_desk_press', scene);
    logForFBAnalytics('help_desk_press');
};

export const logPrivacyPolicyPress = scene => {
    logEvent('privacy_policy_press', scene);
    logForFBAnalytics('privacy_policy_press');
};

export const logTermsAndConditionPress = scene => {
    logEvent('terms_conditions_press', scene);
    logForFBAnalytics('terms_conditions_press');
};

export const logEvent = (eventId, scene, params) => {
    analytics()
        .logEvent(eventId, { scene, ...params })
        .catch(() => {});
    logForFBAnalytics(eventId);
};

export const logVideoPlayPress = (screenName, videoId, scene, language) => {
    logEvent(`${screenName}_${videoId}_play_press_${language}`, scene, {
        video_name: videoId,
        language,
    });
    logForFBAnalytics(`${screenName}_${videoId}_play_press_${language}`);
};

export const logVideoBackPress = (screenName, videoId, scene, language) => {
    logEvent(`${screenName}_${videoId}_play_back_${language}`, scene, {
        video_name: videoId,
        language,
    });
    logForFBAnalytics(`${screenName}_${videoId}_play_back_${language}`);
};

export const logVideoPlayEnd = (screenName, videoId, scene, language) => {
    logEvent(`${screenName}_${videoId}_play_end_${language}`, scene, {
        video_name: videoId,
        language,
    });
    logForFBAnalytics(`${screenName}_${videoId}_play_end_${language}`);
};

export const logSeekerMeditationCancellationReason = (scene, reason) => {
    logEvent(`seeker_exitMeditate_reason_${reason}`, scene);
    logForFBAnalytics(`seeker_exitMeditate_reason_${reason}`);
};

export const logExceptionOccurredWhileInitialization = () => {
    try {
        analytics().logEvent('exception_occurred_while_initializing');
    } catch (e) {}
};
