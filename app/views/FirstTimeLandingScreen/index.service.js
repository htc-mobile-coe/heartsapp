import { loginAnonymously } from '../../services/firebase/AuthService';
import { EXISTING_PRACTITIONER, NEW_TO_HEARTFULNESS, TRAINER } from './Options';
import { Scenes } from '../../shared/Constants';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import moment from 'moment';
import i18n from 'i18next';
import { saveUserPreferences } from '../../services/grpc/ProfileService';
import StorageService from '../../services/native/AppStorageService';
import { isUndefined } from 'lodash';

const _signIn = async (props, timeStamp) => {
    const { isUserLoggedIn, setHfnProfile } = props;
    if (!isUserLoggedIn) {
        const hfnProfile = await loginAnonymously();
        setHfnProfile(hfnProfile);
    }
    if (!isUndefined(timeStamp)) {
        await _handleSaveUserPreferences(props, timeStamp);
    }
};

const _handleSaveUserPreferences = async (props, timeStamp) => {
    const {
        shouldPlayGuidedRelaxationAudio,
        isWeeklyInspirationNotificationSubscribed,
        meditationRemindersSettings,
    } = props;

    const params = {
        timeOfConsent: timeStamp,
        shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudio,
        language: i18n.language,
        isSubscribedToWeeklyInspiration: isWeeklyInspirationNotificationSubscribed,
        isMorningMeditationReminderEnabled:
            meditationRemindersSettings.isMorningMeditationReminderEnabled,
        morningMeditationTime:
            meditationRemindersSettings.morningMeditationTime,
        isEveningMeditationReminderEnabled:
            meditationRemindersSettings.isEveningMeditationReminderEnabled,
        eveningCleaningTime: meditationRemindersSettings.eveningCleaningTime,
        isReminderForNextSittingEnabled:
            meditationRemindersSettings.isReminderForNextSittingEnabled,
        nextSittingReminderIntervalInDays:
            meditationRemindersSettings.nextSittingReminderIntervalInDays,
    };

    await saveUserPreferences(params);
};

export const onUserRoleSelected = async (props, selectedRole) => {
    const { saveOnboardingStatus, setBusy } = props;

    setBusy(true);
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    if (canDoNetworkCalls) {
        try {
            const timeStamp = moment().unix();
            switch (selectedRole) {
                case EXISTING_PRACTITIONER:
                    await _signIn(props);
                    await StorageService.hasHomeSpotLightDisplayedOnce.setValue(
                        true,
                    );
                    saveOnboardingStatus(
                        Scenes.home,
                        EXISTING_PRACTITIONER,
                        true,
                    );
                    break;

                case TRAINER:
                    await StorageService.hasHomeSpotLightDisplayedOnce.setValue(
                        true,
                    );
                    saveOnboardingStatus(Scenes.signIn, TRAINER, false);
                    break;

                default:
                    await StorageService.ageConsentTimeStamp.setValue(
                        timeStamp,
                    );
                    _signIn(props, timeStamp);
                    saveOnboardingStatus(
                        Scenes.newToHeartfulness,
                        NEW_TO_HEARTFULNESS,
                        false,
                        true,
                    );
                    break;
            }
        } catch (err) {}
    }

    setBusy(false);
};
