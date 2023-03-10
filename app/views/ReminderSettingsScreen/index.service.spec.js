import { handleSaveUserPreferences } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as ProfileService from '../../services/grpc/ProfileService';
import moment from 'moment';

describe('ReminderSettingsService', () => {
    let determineNetworkConnectivityStatusMock;

    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };

    const saveUserPreferencesMock = jest
        .spyOn(ProfileService, 'saveUserPreferences')
        .mockImplementation(() => {});

    afterEach(() => {
        saveUserPreferencesMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
    });

    it('should handle SaveUserPreferences from ProfileService and save the User Preferences data on server', async () => {
        const languageMock = 'en';
        const shouldPlayGuidedRelaxationAudioMock = false;
        const isWeeklyInspirationNotificationSubscribedMock = false;
        const morningReminderMock = false;
        const morningMeditationTimeMock = moment().unix();
        const eveningReminderMock = false;
        const eveningCleaningTimeMock = moment().unix();
        const isMeditateWithTrainerEnabledMock = false;
        const meditateWithTrainerDaysMock = 3;

        updateDetermineNetworkConnectivityStatus(true);

        const params = {
            shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudioMock,
            language: languageMock,
            isSubscribedToWeeklyInspiration: isWeeklyInspirationNotificationSubscribedMock,
            morningReminder: morningReminderMock,
            morningMeditationTime: morningMeditationTimeMock,
            eveningReminder: eveningReminderMock,
            eveningCleaningTime: eveningCleaningTimeMock,
            isReminderForNextSittingEnabled: isMeditateWithTrainerEnabledMock,
            nextSittingReminderIntervalInDays: meditateWithTrainerDaysMock,
        };

        await handleSaveUserPreferences(params);

        expect(saveUserPreferencesMock).toHaveBeenCalledWith({
            shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudioMock,
            language: languageMock,
            isSubscribedToWeeklyInspiration: isWeeklyInspirationNotificationSubscribedMock,
            isMorningMeditationReminderEnabled: morningReminderMock,
            morningMeditationTime: morningMeditationTimeMock,
            isEveningMeditationReminderEnabled: eveningReminderMock,
            eveningCleaningTime: eveningCleaningTimeMock,
            isReminderForNextSittingEnabled: isMeditateWithTrainerEnabledMock,
            nextSittingReminderIntervalInDays: meditateWithTrainerDaysMock,
        });
    });

    it('should not call SaveUserPreferences when internet is not available', async () => {
        const languageMock = 'en';
        const shouldPlayGuidedRelaxationAudioMock = false;
        const isWeeklyInspirationNotificationSubscribedMock = false;
        const morningReminderMock = false;
        const morningMeditationTimeMock = moment().unix();
        const eveningReminderMock = false;
        const eveningCleaningTimeMock = moment().unix();
        const isMeditateWithTrainerEnabledMock = false;
        const meditateWithTrainerDaysMock = 3;

        updateDetermineNetworkConnectivityStatus(false);

        const params = {
            shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudioMock,
            language: languageMock,
            isSubscribedToWeeklyInspiration: isWeeklyInspirationNotificationSubscribedMock,
            morningReminder: morningReminderMock,
            morningMeditationTime: morningMeditationTimeMock,
            eveningReminder: eveningReminderMock,
            eveningCleaningTime: eveningCleaningTimeMock,
            isReminderForNextSittingEnabled: isMeditateWithTrainerEnabledMock,
            nextSittingReminderIntervalInDays: meditateWithTrainerDaysMock,
        };

        await handleSaveUserPreferences(params);

        expect(saveUserPreferencesMock).not.toHaveBeenCalled();
    });
});
