import { saveUserPreferences } from '../../services/grpc/ProfileService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';

export const handleSaveUserPreferences = async params => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();

    const userPreferences = {
        shouldPlayRelaxationAudioBeforeMeditation:
            params.shouldPlayRelaxationAudioBeforeMeditation,
        language: params.language,
        isSubscribedToWeeklyInspiration: params.isSubscribedToWeeklyInspiration,
        isMorningMeditationReminderEnabled: params.morningReminder,
        morningMeditationTime: params.morningMeditationTime,
        isEveningMeditationReminderEnabled: params.eveningReminder,
        eveningCleaningTime: params.eveningCleaningTime,
        isReminderForNextSittingEnabled: params.isReminderForNextSittingEnabled,
        nextSittingReminderIntervalInDays:
            params.nextSittingReminderIntervalInDays,
    };

    if (canDoNetworkCalls) {
        await saveUserPreferences(userPreferences);
    }
};
