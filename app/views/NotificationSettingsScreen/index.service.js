import {
    subscribeToWeeklyInspirationNotification,
    unsubscribeFromWeeklyInspirationNotification,
} from '../../services/firebase/MessagingService';
import i18n from 'i18next';
import { saveUserPreferences } from '../../services/grpc/ProfileService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import StorageService from '../../services/native/AppStorageService';

export const updateWeeklyInspirationNotificationSubscription = async (
    value,
    props,
) => {
    const { updateWeeklyInspirationNotificationSubscriptionStatus } = props;
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    const localAgeConsentTimeStamp = await StorageService.ageConsentTimeStamp.getValue();

    if (canDoNetworkCalls) {
        updateWeeklyInspirationNotificationSubscriptionStatus(value);
        try {
            value
                ? await subscribeToWeeklyInspirationNotification()
                : await unsubscribeFromWeeklyInspirationNotification();

            const meditationRemindersSettings =
                props.meditationRemindersSettings;

            await saveUserPreferences({
                shouldPlayRelaxationAudioBeforeMeditation:
                    props.shouldPlayGuidedRelaxationAudio,
                language: i18n.language,
                isSubscribedToWeeklyInspiration: value,
                timeOfConsent: localAgeConsentTimeStamp,
                isMorningMeditationReminderEnabled:
                    meditationRemindersSettings.isMorningMeditationReminderEnabled,
                morningMeditationTime:
                    meditationRemindersSettings.morningMeditationTime,
                isEveningMeditationReminderEnabled:
                    meditationRemindersSettings.isEveningMeditationReminderEnabled,
                eveningCleaningTime:
                    meditationRemindersSettings.eveningCleaningTime,
                isReminderForNextSittingEnabled:
                    meditationRemindersSettings.isReminderForNextSittingEnabled,
                nextSittingReminderIntervalInDays:
                    meditationRemindersSettings.nextSittingReminderIntervalInDays,
            });
        } catch (e) {}
    }
};
