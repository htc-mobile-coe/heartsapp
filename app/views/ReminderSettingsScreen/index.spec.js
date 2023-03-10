import React from 'react';
import { ReminderSettingsContainer, mapStateToProps } from './index';
import ReminderSettingsScreen from './ReminderSettingsScreen';
import { render, fireEvent } from '../../utils/TestUtils';
import { findByProps, spyOnProperty } from '../../utils/TestUtils';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import * as Service from './index.service';
import NotificationService from '../../services/NotificationService';
import StorageService from '../../services/native/AppStorageService';
import { InteractionManager } from 'react-native';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';

describe('ReminderSettingsContainer', () => {
    let eveningCleaningSchedulingNotificationIdMock;
    let morningMeditationSchedulingNotificationIdMock;
    let meditateWithTrainerReminderSchedulingNotificationIdMock;
    let cancelAndscheduleMeditateWithTrainerReminderNotificationsMock;
    const Component = (props) => render(<ReminderSettingsContainer {...props} />)
    afterAll(() => {
        cancelAndscheduleMeditateWithTrainerReminderNotificationsMock = undefined;
    });
    const prepareEveningCleaningSchedulingNotificationId = eveningNotificationId => {
        eveningCleaningSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => eveningNotificationId);

        spyOnProperty(
            StorageService,
            'eveningCleaningSchedulingNotificationId',
            {
                getValue: eveningCleaningSchedulingNotificationIdMock,
            },
        );
    };
    const prepareMorningMeditationSchedulingNotificationId = morningNotificationId => {
        morningMeditationSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => morningNotificationId);

        spyOnProperty(
            StorageService,
            'morningMeditationSchedulingNotificationId',
            {
                getValue: morningMeditationSchedulingNotificationIdMock,
            },
        );
    };

    const handleSaveUserPreferencesMock = jest
        .spyOn(Service, 'handleSaveUserPreferences')
        .mockImplementation(() => { });

    const scheduleEveningCleaningReminderNotificationMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleEveningCleaningReminderNotification',
        )
        .mockImplementation(() => ({}));
    const scheduleMorningMeditationReminderNotificationMock = jest
        .spyOn(
            ReminderNotificationService,
            'scheduleMorningMeditationReminderNotification',
        )
        .mockImplementation(() => ({}));
    const cancelAndscheduleMeditateWithTrainerReminderNotificationsMockResponse = response => {
        cancelAndscheduleMeditateWithTrainerReminderNotificationsMock = jest
            .spyOn(ReminderNotificationService, 'cancelAndScheduleMeditateWithTrainerReminderNotifications')
            .mockImplementation(() => response);
    };
    const cancelNotificationByIdMock = jest
        .spyOn(NotificationService, 'cancelNotificationById')
        .mockImplementation(() => ({}));

    const runAfterInteractionsMock = jest
        .spyOn(InteractionManager, 'runAfterInteractions')
        .mockImplementation(callback => callback());
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => { });

    afterEach(() => {
        runAfterInteractionsMock.mockClear();
        if (morningMeditationSchedulingNotificationIdMock) {
            morningMeditationSchedulingNotificationIdMock.mockClear();
            morningMeditationSchedulingNotificationIdMock = undefined;
        }
        if (eveningCleaningSchedulingNotificationIdMock) {
            eveningCleaningSchedulingNotificationIdMock.mockClear();
            eveningCleaningSchedulingNotificationIdMock = undefined;
        }
        if (meditateWithTrainerReminderSchedulingNotificationIdMock) {
            meditateWithTrainerReminderSchedulingNotificationIdMock.mockClear();
            meditateWithTrainerReminderSchedulingNotificationIdMock = undefined;
        }
        handleSaveUserPreferencesMock.mockClear();
        cancelNotificationByIdMock.mockClear();
        scheduleEveningCleaningReminderNotificationMock.mockClear();
        scheduleMorningMeditationReminderNotificationMock.mockClear();
        logEventMock.mockClear();
        if (cancelAndscheduleMeditateWithTrainerReminderNotificationsMock) {
            cancelAndscheduleMeditateWithTrainerReminderNotificationsMock.mockClear();
            cancelAndscheduleMeditateWithTrainerReminderNotificationsMock = undefined;

        }
    });

    it('Should exist', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });

    it('Should call go back on back button press event', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({ goBack: onBackPressMock });
        fireEvent(container.findByType(ReminderSettingsScreen), 'BackPress');
        expect(onBackPressMock).toHaveBeenCalled();
    });

    it('Should show the timepicker when user clicks on morning reminder button', async () => {
        const { container } = Component({});
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MorningReminderButtonPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningReminderButtonPress');
        expect(findByProps(container, 'showTimePicker', true)).toBeDefined();
        expect(findByProps(container, 'choosenTime', '06:00')).toBeDefined();

        expect(logEventMock).toBeCalledWith(
            'reminders_morning_notification_open',
            Scenes.remindersSettings,
        );
    });

    it('Should show the timepicker when user clicks on evening reminder button', async () => {
        const { container } = Component({});
        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningReminderButtonPress');
        expect(findByProps(container, 'showTimePicker', true)).toBeDefined();
        expect(findByProps(container, 'choosenTime', '19:00')).toBeDefined();
        expect(logEventMock).toBeCalledWith(
            'reminders_evening_notification_open',
            Scenes.remindersSettings,
        );
    });

    it('Should hide the timepicker when user clicks on reminder button', () => {
        const { container } = Component({});
        fireEvent(container.findByType(ReminderSettingsScreen), 'ReminderButtonPress');
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
    });

    it('Should hide the timepicker when user clicks on save button for morning reminder', async () => {
        prepareMorningMeditationSchedulingNotificationId(1);
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MorningReminderButtonPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'TimePickerSaveButtonPress');
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).toHaveBeenCalledWith('06:00');
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
        expect(
            findByProps(container, 'showActivityIndicator', false),
        ).toBeDefined();
        expect(
            findByProps(container, 'choosenTime', '06:00'),
        ).toBeDefined();
    });
    it('Should hide the timepicker when user clicks on save button for morning reminder and morningNotificationId is undefined', async () => {
        prepareMorningMeditationSchedulingNotificationId(null);
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'TimePickerSaveButtonPress');
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).toHaveBeenCalledWith('06:00');
        expect(
            findByProps(container, 'showActivityIndicator', false),
        ).toBeDefined();
        expect(
            findByProps(container, 'choosenTime', '06:00'),
        ).toBeDefined();
    });
    it('Should hide the timepicker when user clicks on save button for evening reminder', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };

        prepareEveningCleaningSchedulingNotificationId(1);
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningReminderButtonPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'TimePickerSaveButtonPress');
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).toHaveBeenCalledWith('19:00');
        expect(
            findByProps(container, 'showActivityIndicator', false),
        ).toBeDefined();
        expect(
            findByProps(container, 'choosenTime', '06:00'),
        ).toBeDefined();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: true,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: true,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });
    it('Should hide the timepicker when user clicks on save button for evening reminder and eveningNotificationId is undefined', async () => {
        prepareEveningCleaningSchedulingNotificationId(null);
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningReminderButtonPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'TimePickerSaveButtonPress');
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).toHaveBeenCalledWith('19:00');
        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
        expect(
            findByProps(container, 'showActivityIndicator', false),
        ).toBeDefined();
        expect(
            findByProps(container, 'choosenTime', '06:00'),
        ).toBeDefined();
    });
    it('Should hide the timepicker when user clicks on cancel button', () => {
        const { container } = Component({});
        fireEvent(container.findByType(ReminderSettingsScreen), 'TimePickerCancelButtonPress');
        expect(findByProps(container, 'showTimePicker', false)).toBeDefined();
    });

    it('Should handle MorningToggleSwitchPress event when user clicks on morning reminder toggle switch to off', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();

        prepareMorningMeditationSchedulingNotificationId(1);

        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        fireEvent(container.findByType(ReminderSettingsScreen), 'MorningToggleSwitchPress');
        fireEvent(container.findByType(ReminderSettingsScreen), 'MorningToggleSwitchPress');
        expect(findByProps(container, 'morningReminder', true)).toBeDefined();
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).not.toBeCalled();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: true,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: true,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
        expect(logEventMock).toBeCalledWith(
            'reminders_Morning_notification_off',
            Scenes.remindersSettings,
        );
    });

    it('Should handle MorningToggleSwitchPress event when user clicks on morning reminder toggle switch to off and when no notification has scheduled previously', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: false,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();

        prepareMorningMeditationSchedulingNotificationId(undefined);

        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MorningToggleSwitchPress');

        await fireEvent(container.findByType(ReminderSettingsScreen), 'MorningToggleSwitchPress');

        expect(findByProps(container, 'morningReminder', true)).toBeDefined();

        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: true,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: false,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });

    it('Should handle MorningToggleSwitchPress event and cancel scheduled notifications when user clicks on morning reminder toggle switch', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: false,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();

        prepareMorningMeditationSchedulingNotificationId(1);

        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MorningToggleSwitchPress');

        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).not.toBeCalled();
        expect(findByProps(container, 'morningReminder', false)).toBeDefined();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: true,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: false,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });

    it('Should handle EveningToggleSwitchPress  event and schedule notification  and cancel previous notification when user clicks on evening cleaning toggle switch to off', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();

        prepareEveningCleaningSchedulingNotificationId(1);

        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningToggleSwitchPress');

        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(findByProps(container, 'eveningReminder', true)).toBeDefined();
        expect(
            scheduleEveningCleaningReminderNotificationMock,
        ).not.toBeCalled();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: false,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: true,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });

    it('Should handle EveningToggleSwitchPress  event and schedule notification when user clicks on evening cleaning toggle switch', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        prepareEveningCleaningSchedulingNotificationId(undefined);

        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningToggleSwitchPress');

        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningToggleSwitchPress');

        expect(cancelNotificationByIdMock).not.toBeCalled();
        expect(findByProps(container, 'eveningReminder', true)).toBeDefined();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: false,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: true,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });
    it('Should handle EveningToggleSwitchPress event when user clicks on evening cleaning toggle switch', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: false,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();

        prepareEveningCleaningSchedulingNotificationId(1);

        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });

        await fireEvent(container.findByType(ReminderSettingsScreen), 'EveningToggleSwitchPress');

        expect(cancelNotificationByIdMock).toHaveBeenCalledWith(1);
        expect(findByProps(container, 'eveningReminder', false)).toBeDefined();
        expect(
            scheduleMorningMeditationReminderNotificationMock,
        ).not.toBeCalled();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: false,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: true,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });

    it('Should handle Meditate with trainer event and schedule notification when user clicks on meditate with trainer toggle switch', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        cancelAndscheduleMeditateWithTrainerReminderNotificationsMockResponse(7)

        await fireEvent(container.findByType(ReminderSettingsScreen), 'MeditationWithTrainerToggleSwitchPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MeditationWithTrainerToggleSwitchPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MeditationWithTrainerToggleSwitchPress');

        expect(cancelNotificationByIdMock).not.toHaveBeenCalled();
        expect(
            findByProps(container, 'meditationWithTrainerReminder', true),
        ).toBeDefined();
        expect(handleSaveUserPreferencesMock).toHaveBeenCalledWith({
            eveningCleaningTime: 68400,
            eveningReminder: true,
            isSubscribedToWeeklyInspiration: true,
            language: undefined,
            morningMeditationTime: 21600,
            morningReminder: true,
            shouldPlayRelaxationAudioBeforeMeditation: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        });
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
    });

    it('Should handle Meditate with trainer event when user clicks on meditate with trainer toggle switch', async () => {
        const remindersSettings = {
            eveningCleaningTime: 68400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            morningMeditationTime: 21600,
            isReminderForNextSittingEnabled: false,
            nextSittingReminderIntervalInDays: 7,
        };
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MeditationWithTrainerToggleSwitchPress');

        await fireEvent(container.findByType(ReminderSettingsScreen), 'MeditationWithTrainerToggleSwitchPress');

        expect(
            findByProps(container, 'meditationWithTrainerReminder', false),
        ).toBeDefined();
        expect(setMeditationRemindersSettingsMock).toHaveBeenCalledWith(
            remindersSettings,
        );
        expect(cancelNotificationByIdMock).not.toHaveBeenCalled();
    });

    it('Should handle Time change event when user changing the reminder time', async () => {
        const { container } = Component({})
        const datePassed = new Date();
        datePassed.setHours(7);
        datePassed.setMinutes(59);
        datePassed.setMilliseconds(0);
        await fireEvent(container.findByType(ReminderSettingsScreen), 'ChangingTime', datePassed);
        expect(findByProps(container, 'choosenTime', '07:59')).toBeDefined();

    });

    it('Should populate whether user profile details from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    authenticated: true,
                },
                onboardingStatus: {
                    roleDeclaredByUser: 'Seeker',
                },
            }),
        ).toEqual({
            roleDeclaredByUser: 'Seeker',
            authenticated: true,
            isWeeklyInspirationNotificationSubscribed: false,
            shouldPlayGuidedRelaxationAudio: false,
        });
    });

    it('Should check meditationRemindersSettings value in getDerivedStateFromProps and set the initial values', () => {
        const meditationRemindersSettingsMock = {
            eveningCleaningTime: 75600,
            morningMeditationTime: 32400,
            isEveningMeditationReminderEnabled: true,
            isMorningMeditationReminderEnabled: true,
            isReminderForNextSittingEnabled: true,
            nextSittingReminderIntervalInDays: 7,
        };

        const { container } = Component({
            meditationRemindersSettings: meditationRemindersSettingsMock,
        });

        expect(findByProps(container, 'morningTime', '09:00')).toBeDefined();
        expect(findByProps(container, 'eveningTime', '21:00')).toBeDefined();
        expect(findByProps(container, 'morningReminder', true)).toBeDefined();
        expect(findByProps(container, 'eveningReminder', true)).toBeDefined();
    });
    it('Should handle days count for meditate with trainer reminder change event when user changing the days count', async () => {
        const { container } = Component({})
        await fireEvent(container.findByType(ReminderSettingsScreen), 'DaysCountChangeForMeditateWithTrainerReminder', 7);

        expect(
            findByProps(container, 'daysCountForMeditateWithTrainerReminder', 7),
        ).toBeDefined();
        expect(
            findByProps(container, 'meditationWithTrainerReminder', true),
        ).toBeDefined();

        expect(
            findByProps(container, 'showActivityIndicator', false),
        ).toBeDefined();
    });
    it('Should not schedule the notification if meditate with trainer toggle is off', async () => {
        const setMeditationRemindersSettingsMock = jest.fn();
        const { container } = Component({
            setMeditationRemindersSettings: setMeditationRemindersSettingsMock,
            shouldPlayGuidedRelaxationAudio: true,
            isWeeklyInspirationNotificationSubscribed: true,
        });
        await fireEvent(container.findByType(ReminderSettingsScreen), 'MeditationWithTrainerToggleSwitchPress');
        await fireEvent(container.findByType(ReminderSettingsScreen), 'DaysCountChangeForMeditateWithTrainerReminder', 8);

        expect(
            findByProps(container, 'meditationWithTrainerReminder', false),
        ).toBeDefined();
        expect(cancelNotificationByIdMock).not.toHaveBeenCalled();
    });


});
