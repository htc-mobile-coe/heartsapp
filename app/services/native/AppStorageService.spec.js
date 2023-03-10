import StorageService from './AppStorageService';
import moment from 'moment';

describe('AppStorageService', () => {
    describe('landingScreen', () => {
        afterEach(() => {
            return StorageService.clearOnboardingStatus();
        });

        it('Should return null first time if nothing saved', () => {
            return StorageService.getOnboardingStatus().then(data =>
                expect(data).toBeUndefined(),
            );
        });

        it('Should return proper saved value', () => {
            const expectedData = {
                scene: 'onboarding',
                roleDeclared: null,
                onboardingFinished: false,
            };

            return StorageService.setOnboardingStatus(expectedData)
                .then(() => StorageService.getOnboardingStatus())
                .then(value => expect(value).toEqual(expectedData));
        });
    });

    describe('masterClass', () => {
        afterEach(() => {
            return StorageService.clearMasterClassProgress();
        });

        it('Should return null first time if nothing saved', () => {
            return StorageService.getMasterClassProgress().then(data =>
                expect(data).toBeNull(),
            );
        });

        it('Should return proper saved value', () => {
            return StorageService.setMasterClassProgress('Day 1')
                .then(() => StorageService.getMasterClassProgress())
                .then(value => expect(value).toEqual('Day 1'));
        });
    });

    describe('ageConsentTimeStamp', () => {
        afterEach(() => {
            return StorageService.ageConsentTimeStamp.clear();
        });

        it('Should return undefined first time if nothing saved', async () => {
            const value = await StorageService.ageConsentTimeStamp.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            const timeStamp = moment().unix();
            await StorageService.ageConsentTimeStamp.setValue(timeStamp);
            const value = await StorageService.ageConsentTimeStamp.getValue();
            expect(value).toEqual(timeStamp);
        });
    });

    describe('meditationRemindersSettings', () => {
        afterEach(() => {
            return StorageService.meditationRemindersSettings.clear();
        });

        it('Should return undefined first time if nothing saved', async () => {
            const value = await StorageService.meditationRemindersSettings.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            const remindersSettings = {
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 21600,
                isEveningMeditationReminderEnabled: true,
                eveningCleaningTime: 57600,
            };

            await StorageService.meditationRemindersSettings.setValue(
                remindersSettings,
            );
            const value = await StorageService.meditationRemindersSettings.getValue();
            expect(value).toEqual(remindersSettings);
        });
    });

    describe('#weeklyInspirationNotificationSubscription', () => {
        afterEach(async () => {
            await StorageService.hasSubscribedToWeeklyInspirationNotification.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.hasSubscribedToWeeklyInspirationNotification.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.hasSubscribedToWeeklyInspirationNotification.setValue(
                true,
            );
            const value = await StorageService.hasSubscribedToWeeklyInspirationNotification.getValue();
            expect(value).toEqual(true);
        });
    });
    describe('#morningReminderNotification', () => {
        afterEach(async () => {
            await StorageService.morningMeditationReminderNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.morningMeditationReminderNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.morningMeditationReminderNotificationId.setValue(
                1,
            );
            const value = await StorageService.morningMeditationReminderNotificationId.getValue();
            expect(value).toEqual(1);
        });
    });
    describe('#eveningReminderNotification', () => {
        afterEach(async () => {
            await StorageService.eveningCleaningReminderNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.eveningCleaningReminderNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.eveningCleaningReminderNotificationId.setValue(
                2,
            );
            const value = await StorageService.eveningCleaningReminderNotificationId.getValue();
            expect(value).toEqual(2);
        });
    });

    describe('#morningMeditationReminderEnabled', () => {
        afterEach(async () => {
            await StorageService.hasMorningMeditationReminderNotificationEnabled.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.hasMorningMeditationReminderNotificationEnabled.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.hasMorningMeditationReminderNotificationEnabled.setValue(
                true,
            );
            const value = await StorageService.hasMorningMeditationReminderNotificationEnabled.getValue();
            expect(value).toEqual(true);
        });
    });
    describe('#morningReminderTime', () => {
        afterEach(async () => {
            await StorageService.morningMeditationReminderTime.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.morningMeditationReminderTime.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.morningMeditationReminderTime.setValue('6:00');
            const value = await StorageService.morningMeditationReminderTime.getValue();
            expect(value).toEqual('6:00');
        });
    });
    describe('#eveningCleaningReminderEnabled', () => {
        afterEach(async () => {
            await StorageService.hasEveningCleaningReminderNotificationEnabled.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.hasEveningCleaningReminderNotificationEnabled.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.hasEveningCleaningReminderNotificationEnabled.setValue(
                true,
            );
            const value = await StorageService.hasEveningCleaningReminderNotificationEnabled.getValue();
            expect(value).toEqual(true);
        });
    });
    describe('#eveningCleaningTime', () => {
        afterEach(async () => {
            await StorageService.eveningCleaningReminderTime.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.eveningCleaningReminderTime.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.eveningCleaningReminderTime.setValue('19:00');
            const value = await StorageService.eveningCleaningReminderTime.getValue();
            expect(value).toEqual('19:00');
        });
    });
    describe('#meditateWithTrainerReminderNotification', () => {
        afterEach(async () => {
            await StorageService.meditateWithTrainerReminderNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.meditateWithTrainerReminderNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.meditateWithTrainerReminderNotificationId.setValue(
                1,
            );
            const value = await StorageService.meditateWithTrainerReminderNotificationId.getValue();
            expect(value).toEqual(1);
        });
    });
    describe('#meditateWithTrainerSchedulingNotification', () => {
        afterEach(async () => {
            await StorageService.meditateWithTrainerReminderSchedulingNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.meditateWithTrainerReminderSchedulingNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.meditateWithTrainerReminderSchedulingNotificationId.setValue(
                1,
            );
            const value = await StorageService.meditateWithTrainerReminderSchedulingNotificationId.getValue();
            expect(value).toEqual(1);
        });
    });
    describe('#meditateWithTrainerSecondReminderSchedulingNotification', () => {
        afterEach(async () => {
            await StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId.setValue(
                1,
            );
            const value = await StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId.getValue();
            expect(value).toEqual(1);
        });
    });
    describe('#spotlightDisplayed', () => {
        afterEach(async () => {
            await StorageService.hasHomeSpotLightDisplayedOnce.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.hasHomeSpotLightDisplayedOnce.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.hasHomeSpotLightDisplayedOnce.setValue(true);
            const value = await StorageService.hasHomeSpotLightDisplayedOnce.getValue();
            expect(value).toEqual(true);
        });
    });
    describe('#day2MasterClassReminderSchedulingNotification', () => {
        afterEach(async () => {
            await StorageService.day2MasterClassReminderSchedulingNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.day2MasterClassReminderSchedulingNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.day2MasterClassReminderSchedulingNotificationId.setValue(
                1,
            );
            const value = await StorageService.day2MasterClassReminderSchedulingNotificationId.getValue();
            expect(value).toEqual(1);
        });
    });
    describe('#day3MasterClassReminderSchedulingNotification', () => {
        afterEach(async () => {
            await StorageService.day3MasterClassReminderSchedulingNotificationId.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.day3MasterClassReminderSchedulingNotificationId.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.day3MasterClassReminderSchedulingNotificationId.setValue(
                1,
            );
            const value = await StorageService.day3MasterClassReminderSchedulingNotificationId.getValue();
            expect(value).toEqual(1);
        });
    });
    describe('#countOfSittingsTaken', () => {
        afterEach(async () => {
            await StorageService.countOfSittingsTaken.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.countOfSittingsTaken.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.countOfSittingsTaken.setValue(100);
            const value = await StorageService.countOfSittingsTaken.getValue();
            expect(value).toEqual(100);
        });
    });
    describe('#countOfSittingsGivenThroughHeartsApp', () => {
        afterEach(async () => {
            await StorageService.countOfSittingsGivenThroughHeartsApp.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.countOfSittingsGivenThroughHeartsApp.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.countOfSittingsGivenThroughHeartsApp.setValue(
                100,
            );
            const value = await StorageService.countOfSittingsGivenThroughHeartsApp.getValue();
            expect(value).toEqual(100);
        });
    });
    describe('#countOfSittingsGivenOffline', () => {
        afterEach(async () => {
            await StorageService.countOfSittingsGivenOffline.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.countOfSittingsGivenOffline.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.countOfSittingsGivenOffline.setValue(100);
            const value = await StorageService.countOfSittingsGivenOffline.getValue();
            expect(value).toEqual(100);
        });
    });
    describe('#preceptorPostMeditationExperienceRecordingOption', () => {
        afterEach(async () => {
            await StorageService.preceptorPostMeditationExperienceRecordingOption.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.preceptorPostMeditationExperienceRecordingOption.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.preceptorPostMeditationExperienceRecordingOption.setValue(
                true,
            );
            const value = await StorageService.preceptorPostMeditationExperienceRecordingOption.getValue();
            expect(value).toEqual(true);
        });
    });
    describe('#hasIntroductorySittingsCompletionDetailEnquiryFilled', () => {
        afterEach(async () => {
            await StorageService.hasIntroductorySittingsCompletionDetailEnquiryFilled.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.hasIntroductorySittingsCompletionDetailEnquiryFilled.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.hasIntroductorySittingsCompletionDetailEnquiryFilled.setValue(
                true,
            );
            const value = await StorageService.hasIntroductorySittingsCompletionDetailEnquiryFilled.getValue();
            expect(value).toEqual(true);
        });
    });
    describe('#versionNumberForWhichWhatsNewPopupShown', () => {
        afterEach(async () => {
            await StorageService.versionNumberForWhichWhatsNewPopupShown.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.versionNumberForWhichWhatsNewPopupShown.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.versionNumberForWhichWhatsNewPopupShown.setValue(
                true,
            );
            const value = await StorageService.versionNumberForWhichWhatsNewPopupShown.getValue();
            expect(value).toEqual(true);
        });
    });

    describe('#offlinePreceptorMeditationStartedTime', () => {
        afterEach(async () => {
            await StorageService.offlinePreceptorMeditationStartedTime.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.offlinePreceptorMeditationStartedTime.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.offlinePreceptorMeditationStartedTime.setValue(
                '2019-10-30T00:00:00.000Z',
            );
            const value = await StorageService.offlinePreceptorMeditationStartedTime.getValue();
            expect(value).toEqual('2019-10-30T00:00:00.000Z');
        });
    });

    describe('#preceptorSearchedSeekerDates', () => {
        afterEach(async () => {
            await StorageService.preceptorSearchedSeekerDates.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.preceptorSearchedSeekerDates.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.preceptorSearchedSeekerDates.setValue([
                '2019-10-30T00:00:00.000Z',
            ]);
            const value = await StorageService.preceptorSearchedSeekerDates.getValue();
            expect(value).toEqual(['2019-10-30T00:00:00.000Z']);
        });
    });

    describe('#showHeartInTuneBanner', () => {
        afterEach(async () => {
            await StorageService.showHeartInTuneBanner.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.showHeartInTuneBanner.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.showHeartInTuneBanner.setValue(true);
            const value = await StorageService.showHeartInTuneBanner.getValue();
            expect(value).toEqual(true);
        });
    });

    describe('#showHeartInTuneAppDownloadPopup', () => {
        afterEach(async () => {
            await StorageService.showHeartInTuneAppDownloadPopup.clear();
        });

        it('Should return undefined first time', async () => {
            const value = await StorageService.showHeartInTuneAppDownloadPopup.getValue();
            expect(value).not.toBeDefined();
        });

        it('Should return proper saved value', async () => {
            await StorageService.showHeartInTuneAppDownloadPopup.setValue(true);
            const value = await StorageService.showHeartInTuneAppDownloadPopup.getValue();
            expect(value).toEqual(true);
        });
    });
});
