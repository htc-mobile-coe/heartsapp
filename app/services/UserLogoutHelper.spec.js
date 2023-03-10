import UserLogoutHelper from './UserLogoutHelper';
import { ZeroPreceptorNotificationSubscriptionMachine } from '../machines/ZeroPreceptorNotificationSubscription';
import * as MessagingService from '../services/firebase/MessagingService';
import * as userOperations from '../state/user/operations';
import * as preceptorMeditationOperations from '../state/preceptorMeditation/operations';
import { getMeditationRemindersSettingsConfig } from '../services/firebase/RemoteConfigService';
import ReminderNotificationService from './ReminderNotificationService';
import { Toast } from 'native-base';
import * as AnalyticsService from './firebase/AnalyticsService';

describe('UserLogoutHelper', () => {
    const dispatchMock = jest.fn();
    const getStateMock = jest.fn().mockImplementation(() => ({
        onboardingStatus: { roleDeclaredByUser: true },
    }));
    const zeroPreceptorNotificationSubscriptionMachineMock = jest
        .spyOn(ZeroPreceptorNotificationSubscriptionMachine, 'reset')
        .mockImplementation(() => ({}));
    const unsubscribeFromWeeklyInspirationNotificationeMock = jest
        .spyOn(MessagingService, 'unsubscribeFromWeeklyInspirationNotification')
        .mockImplementation(() => ({}));
    const unsubscribeFromZeroPreceptorConditionNotificationMock = jest
        .spyOn(
            MessagingService,
            'unsubscribeFromZeroPreceptorConditionNotification',
        )
        .mockImplementation(() => ({}));
    const setMeditationRemindersSettingsMock = jest
        .spyOn(userOperations, 'setMeditationRemindersSettings')
        .mockImplementation(() => jest.fn());
    const setOptedPostMeditationExperienceRecordingMock = jest
        .spyOn(
            preceptorMeditationOperations,
            'setOptedPostMeditationExperienceRecording',
        )
        .mockImplementation(() => jest.fn());
    const cancelReminderNotificationsMock = jest
        .spyOn(ReminderNotificationService, 'cancelReminderNotifications')
        .mockImplementation(() => jest.fn());
    const logSessionExpiredMock = jest
        .spyOn(AnalyticsService, 'logSessionExpired')
        .mockImplementation(() => ({}));
    const logDeactivateAccountMock = jest
        .spyOn(AnalyticsService, 'logDeactivateAccount')
        .mockImplementation(() => ({}));
    afterEach(() => {
        dispatchMock.mockClear();
        getStateMock.mockClear();
        zeroPreceptorNotificationSubscriptionMachineMock.mockClear();
        unsubscribeFromWeeklyInspirationNotificationeMock.mockClear();
        unsubscribeFromZeroPreceptorConditionNotificationMock.mockClear();
        setMeditationRemindersSettingsMock.mockClear();
        setOptedPostMeditationExperienceRecordingMock.mockClear();
        cancelReminderNotificationsMock.mockClear();
        logSessionExpiredMock.mockClear();
        logDeactivateAccountMock.mockClear();
    });

    it('should able to logout and reset state Machine', async () => {
        UserLogoutHelper.initialize(dispatchMock, getStateMock);

        UserLogoutHelper.onLogout();

        expect(zeroPreceptorNotificationSubscriptionMachineMock).toBeCalled();
        expect(unsubscribeFromWeeklyInspirationNotificationeMock).toBeCalled();
    });

    it('should able to logout and set meditationRemindersSettings value to default', async () => {
        UserLogoutHelper.initialize(dispatchMock, getStateMock);

        UserLogoutHelper.onLogout();

        expect(setMeditationRemindersSettingsMock).toBeCalledWith(
            getMeditationRemindersSettingsConfig(),
        );
        expect(zeroPreceptorNotificationSubscriptionMachineMock).toBeCalled();
        expect(unsubscribeFromWeeklyInspirationNotificationeMock).toBeCalled();
    });

    it('should able to logout and cancel the Reminder notification service', async () => {
        UserLogoutHelper.initialize(dispatchMock, getStateMock);
        UserLogoutHelper.onLogout();
        expect(cancelReminderNotificationsMock).toBeCalled();
    });

    it('should able to logout and set optedPostMeditationExperienceRecording value to true', async () => {
        UserLogoutHelper.initialize(dispatchMock, getStateMock);

        UserLogoutHelper.onLogout();

        expect(setOptedPostMeditationExperienceRecordingMock).toBeCalledWith(
            true,
        );
    });

    it('should able to unsubscribe from ZeroPreceptorNotification when user is preceptor', async () => {
        const isPreceptorMock = jest
            .spyOn(userOperations, 'isPreceptor')
            .mockImplementation(() => true);

        UserLogoutHelper.initialize(dispatchMock, getStateMock);
        UserLogoutHelper.onLogout();

        expect(isPreceptorMock).toBeCalled();
        expect(
            unsubscribeFromZeroPreceptorConditionNotificationMock,
        ).toBeCalled();
    });

    it('should able to show toast message, when session expired', async () => {
        const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
        UserLogoutHelper.initialize(dispatchMock, getStateMock);

        UserLogoutHelper.onSessionExpire();

        expect(setOptedPostMeditationExperienceRecordingMock).toBeCalledWith(
            true,
        );
        expect(toastMock).toHaveBeenCalledWith({description: 'Session expired.',
        duration: 6000,});
        expect(logSessionExpiredMock).toHaveBeenCalled();
    });

    it('should able to clear data & deactivate account, when account deactivate triggered', async () => {
        const toastMock = jest.spyOn(Toast, 'show').mockImplementation(() => {});
        UserLogoutHelper.initialize(dispatchMock, getStateMock);

        UserLogoutHelper.onDeactivate();

        expect(setOptedPostMeditationExperienceRecordingMock).toBeCalledWith(
            true,
        );
        expect(logDeactivateAccountMock).toHaveBeenCalled();
    });
});
