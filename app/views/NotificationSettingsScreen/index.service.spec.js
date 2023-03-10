import { updateWeeklyInspirationNotificationSubscription } from './index.service';
import * as MessagingService from '../../services/firebase/MessagingService';
import * as ProfileService from '../../services/grpc/ProfileService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import AppStorageService from '../../services/native/AppStorageService';
import { spyOnProperty } from '../../utils/TestUtils';
import moment from 'moment';

describe('NotificationSettingsService', () => {
    let determineNetworkConnectivityStatusMock;
    let ageConsentTimeStampGetMock;

    const subscribeToWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'subscribeToWeeklyInspirationNotification')
        .mockImplementation(() => {});
    const unsubscribeFromWeeklyInspirationNotificationMock = jest
        .spyOn(MessagingService, 'unsubscribeFromWeeklyInspirationNotification')
        .mockImplementation(() => {});
    const saveUserPreferencesMock = jest
        .spyOn(ProfileService, 'saveUserPreferences')
        .mockImplementation(() => {});
    const updateWeeklyInspirationNotificationSubscriptionStatusMock = jest.fn();

    const props = {
        updateWeeklyInspirationNotificationSubscriptionStatus: updateWeeklyInspirationNotificationSubscriptionStatusMock,
        meditationRemindersSettings: {
            eveningCleaningTime: 68700,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 33240,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        },
    };
    const timeStampValue = moment().unix();
    afterEach(() => {
        subscribeToWeeklyInspirationNotificationMock.mockClear();
        unsubscribeFromWeeklyInspirationNotificationMock.mockClear();
        updateWeeklyInspirationNotificationSubscriptionStatusMock.mockClear();
        saveUserPreferencesMock.mockClear();
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
        if (ageConsentTimeStampGetMock) {
            ageConsentTimeStampGetMock.mockClear();
            ageConsentTimeStampGetMock = undefined;
        }
    });

    const prepare = (internet = true) => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(internet);
            });
        ageConsentTimeStampGetMock = jest
            .fn()
            .mockImplementation(() => timeStampValue);
        spyOnProperty(AppStorageService, 'ageConsentTimeStamp', {
            getValue: ageConsentTimeStampGetMock,
        });
    };

    it('should not able do subscribe weekly inspiration when internet is not available', async () => {
        prepare(false);
        await updateWeeklyInspirationNotificationSubscription(true, props);
        expect(
            props.updateWeeklyInspirationNotificationSubscriptionStatus,
        ).not.toBeCalled();
    });
    it('should able to subscribe weekly inspiration', async () => {
        prepare();
        await updateWeeklyInspirationNotificationSubscription(true, props);
        expect(
            props.updateWeeklyInspirationNotificationSubscriptionStatus,
        ).toBeCalledWith(true);
        expect(ageConsentTimeStampGetMock).toBeCalled();
        expect(saveUserPreferencesMock).toBeCalledWith({
            shouldPlayRelaxationAudioBeforeMeditation: undefined,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            timeOfConsent: timeStampValue,
            eveningCleaningTime: 68700,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 33240,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
    });
    it('should able to unsubscribe weekly inspiration', async () => {
        prepare();
        await updateWeeklyInspirationNotificationSubscription(false, props);
        expect(
            props.updateWeeklyInspirationNotificationSubscriptionStatus,
        ).toBeCalledWith(false);
        expect(ageConsentTimeStampGetMock).toBeCalled();
        expect(saveUserPreferencesMock).toBeCalledWith({
            shouldPlayRelaxationAudioBeforeMeditation: undefined,
            isSubscribedToWeeklyInspiration: false,
            language: undefined,
            timeOfConsent: timeStampValue,
            eveningCleaningTime: 68700,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 33240,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 3,
        });
    });
});
