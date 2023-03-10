import React from 'react';
import { NotificationSettingsScreenContainer, mapStateToProps } from './index';
import NotificationSettingsScreen from './NotificationSettingsScreen';
import * as NotificationSettingsService from './index.service';
import operation from '../../state/operations';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { render, fireEvent } from '../../utils/TestUtils';
import { Scenes } from '../../shared/Constants';

describe('NotificationSettingsScreenContainer', () => {
    const Component = (props) => {
        return render(<NotificationSettingsScreenContainer {...props} />);
    };
    const updateWeeklyInspirationNotificationMock = jest
        .spyOn(
            NotificationSettingsService,
            'updateWeeklyInspirationNotificationSubscription',
        )
        .mockImplementation(() => {});

    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => {});

    afterEach(() => {
        updateWeeklyInspirationNotificationMock.mockClear();
        logEventMock.mockClear();
    });

    it('should handle goBack event, when back button is pressed', async () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({ goBack: onBackPressMock });
        fireEvent(
            container.findByType(NotificationSettingsScreen),
            'BackPress',
        );
        expect(onBackPressMock).toHaveBeenCalled();
    });
    it('should call switch toggle on Weekly Inspiration toggle change to On', async () => {
        const { container } = Component({
            hasUserSubscribedToWeeklyInspirationNotification: false,
        });
        await fireEvent(
            container.findByType(NotificationSettingsScreen),
            'WeeklyInspirationNotificationToggled',
        );
        expect(updateWeeklyInspirationNotificationMock.mock.calls).toEqual([
            [true, { hasUserSubscribedToWeeklyInspirationNotification: false }],
        ]);
        expect(logEventMock).toBeCalledWith(
            'profile_notify_weeklyInspiration_on',
            Scenes.notificationSettingsScreen,
        );
    });
    it('should call switch toggle on Weekly Inspiration toggle change to Off', async () => {
        const { container } = Component({
            hasUserSubscribedToWeeklyInspirationNotification: true,
        });
        await fireEvent(
            container.findByType(NotificationSettingsScreen),
            'WeeklyInspirationNotificationToggled',
        );
        expect(updateWeeklyInspirationNotificationMock.mock.calls).toEqual([
            [false, { hasUserSubscribedToWeeklyInspirationNotification: true }],
        ]);
        expect(logEventMock).toBeCalledWith(
            'profile_notify_weeklyInspiration_off',
            Scenes.notificationSettingsScreen,
        );
    });

    it('should able to map state To Props from redux', async () => {
        const state = {
            hasUserSubscribedToWeeklyInspirationNotification:
                operation.user
                    .updateWeeklyInspirationNotificationSubscriptionStatus,
            user: {
                isWeeklyInspirationNotificationSubscribed: true,
                shouldPlayGuidedRelaxationAudio: true,
                meditationRemindersSettings: {
                    eveningCleaningTime: 68700,
                    isEveningMeditationReminderEnabled: true,
                    isMorningMeditationReminderEnabled: true,
                    morningMeditationTime: 33240,
                },
            },
        };
        expect(mapStateToProps(state)).toEqual({
            hasUserSubscribedToWeeklyInspirationNotification: true,
            shouldPlayGuidedRelaxationAudio: true,
            meditationRemindersSettings: {
                eveningCleaningTime: 68700,
                isEveningMeditationReminderEnabled: true,
                isMorningMeditationReminderEnabled: true,
                morningMeditationTime: 33240,
            },
        });
    });
});
