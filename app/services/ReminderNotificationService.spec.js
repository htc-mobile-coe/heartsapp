import NotificationService from './NotificationService';
import StorageService from './native/AppStorageService';
import ReminderNotificationService from './ReminderNotificationService';
import { getSelectedDate } from '../utils/TimePickerUtils';
import {
    NotificationCategory,
    NotificationSubCategory,
} from '../shared/Constants';
import * as Constants from '../shared/Constants';
import { REMINDER } from '../shared/Constants';
import { spyOnProperty } from '../utils/TestUtils';
import moment from 'moment';

describe('ReminderNotification', () => {
    let scheduleNotificationMock;
    let meditateWithTrainerReminderSchedulingNotificationIdMock;
    let meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock;
    let morningMeditationSchedulingNotificationIdMock;
    let eveningCleaningSchedulingNotificationIdMock;
    let day2MasterClassReminderSchedulingNotificationIdMock;
    let day3MasterClassReminderSchedulingNotificationIdMock;
    const getDefaultLanguageToSelectMock = jest
        .fn()
        .mockImplementation(() => 'en');

    const meditateWithTrainerReminderNotificationIdSetMock = jest.fn();
    const meditateWithTrainerReminderNotificationIdGetMock = jest
        .fn()
        .mockImplementation(() => 1);
    spyOnProperty(StorageService, 'meditateWithTrainerReminderNotificationId', {
        setValue: meditateWithTrainerReminderNotificationIdSetMock,
        getValue: meditateWithTrainerReminderNotificationIdGetMock,
    });

    const meditateWithTrainerReminderNotificationScheduledDateSetMock = jest.fn();
    const meditateWithTrainerReminderNotificationScheduledDateGetMock = jest.fn();
    spyOnProperty(
        StorageService,
        'meditateWithTrainerReminderNotificationScheduledDate',
        {
            setValue: meditateWithTrainerReminderNotificationScheduledDateSetMock,
            getValue: meditateWithTrainerReminderNotificationScheduledDateGetMock,
        },
    );

    spyOnProperty(
        Constants,
        'getDefaultLanguageToSelect',
        getDefaultLanguageToSelectMock,
    );

    const scheduleNotificationMockResponse = response => {
        scheduleNotificationMock = jest
            .spyOn(NotificationService, 'scheduleNotification')
            .mockImplementation(() => {
                return response;
            });
    };

    const prepareMeditateWithTrainerReminderSchedulingNotificationId = meditateWithTrainerNotificationId => {
        meditateWithTrainerReminderSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => meditateWithTrainerNotificationId);

        spyOnProperty(
            StorageService,
            'meditateWithTrainerReminderSchedulingNotificationId',
            {
                setValue: meditateWithTrainerReminderSchedulingNotificationIdMock,
                getValue: meditateWithTrainerReminderSchedulingNotificationIdMock,
            },
        );
    };

    const prepareMeditateWithTrainerFollowUpReminderSchedulingNotificationId = meditateWithTrainerNotificationId => {
        meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => meditateWithTrainerNotificationId);

        spyOnProperty(
            StorageService,
            'meditateWithTrainerFollowUpReminderSchedulingNotificationId',
            {
                setValue: meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock,
                getValue: meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock,
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

    const prepareDay2MasterClassReminderSchedulingNotificationId = masterClassNotificationId => {
        day2MasterClassReminderSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => masterClassNotificationId);

        spyOnProperty(
            StorageService,
            'day2MasterClassReminderSchedulingNotificationId',
            {
                setValue: day2MasterClassReminderSchedulingNotificationIdMock,
            },
        );
    };
    const prepareDay3MasterClassReminderSchedulingNotificationId = masterClassNotificationId => {
        day3MasterClassReminderSchedulingNotificationIdMock = jest
            .fn()
            .mockImplementation(() => masterClassNotificationId);

        spyOnProperty(
            StorageService,
            'day3MasterClassReminderSchedulingNotificationId',
            {
                setValue: day3MasterClassReminderSchedulingNotificationIdMock,
            },
        );
    };
    const cancelNotificationByIdMock = jest
        .spyOn(NotificationService, 'cancelNotificationById')
        .mockImplementation(() => ({}));
    const dateMock = moment(1572393600000);
    let dateNowSpy;

    beforeAll(() => {
        dateNowSpy = jest.spyOn(Date, 'now').mockImplementation(() => dateMock);
    });

    afterAll(() => {
        dateNowSpy.mockRestore();
    });
    afterEach(() => {
        if (scheduleNotificationMock) {
            scheduleNotificationMock.mockClear();
            scheduleNotificationMock = undefined;
        }
        if (meditateWithTrainerReminderSchedulingNotificationIdMock) {
            meditateWithTrainerReminderSchedulingNotificationIdMock.mockClear();
            meditateWithTrainerReminderSchedulingNotificationIdMock = undefined;
        }
        if (meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock) {
            meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock.mockClear();
            meditateWithTrainerFollowUpReminderSchedulingNotificationIdMock = undefined;
        }
        if (morningMeditationSchedulingNotificationIdMock) {
            morningMeditationSchedulingNotificationIdMock.mockClear();
            morningMeditationSchedulingNotificationIdMock = undefined;
        }
        if (eveningCleaningSchedulingNotificationIdMock) {
            eveningCleaningSchedulingNotificationIdMock.mockClear();
            eveningCleaningSchedulingNotificationIdMock = undefined;
        }
        if (day2MasterClassReminderSchedulingNotificationIdMock) {
            day2MasterClassReminderSchedulingNotificationIdMock.mockClear();
            day2MasterClassReminderSchedulingNotificationIdMock = undefined;
        }
        if (day3MasterClassReminderSchedulingNotificationIdMock) {
            day3MasterClassReminderSchedulingNotificationIdMock.mockClear();
            day3MasterClassReminderSchedulingNotificationIdMock = undefined;
        }
        cancelNotificationByIdMock.mockClear();
        getDefaultLanguageToSelectMock.mockClear();
    });

    describe('#scheduleEveningCleaningReminderNotification', () => {
        it('should able to show evening cleaning local notification', async () => {
            const datepassed = getSelectedDate('16:00');
            scheduleNotificationMockResponse('1');
            await ReminderNotificationService.scheduleEveningCleaningReminderNotification(
                '16:00',
            );

            expect(scheduleNotificationMock).toBeCalledWith({
                channelId: 'General Notification',
                date: datepassed,
                message:
                    'Like a tree needs water and sunlight at every stage of its lifecycle, Heartfulness practices can nourish us at every stage of our journey if we practice them consistently',
                title: "It's time for Evening Cleaning",
                repeatType: 'day',
                image: 'evening_cleaning_reminder_icon',
                largeIcon: 'evening_cleaning_reminder_icon',
                userInfo: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
                },
            });
        });
    });
    describe('#scheduleMorningMeditationReminderNotification', () => {
        it('should able to show morning meditation local notification', async () => {
            const datepassed = getSelectedDate('7:00');
            scheduleNotificationMockResponse('1');
            await ReminderNotificationService.scheduleMorningMeditationReminderNotification(
                '7:00',
            );
            expect(scheduleNotificationMock).toBeCalledWith({
                channelId: 'General Notification',
                date: datepassed,
                message:
                    'Like a tree needs water and sunlight at every stage of its lifecycle, Heartfulness practices can nourish us at every stage of our journey if we practice them consistently',
                title: "It's time for Morning Meditation",
                repeatType: 'day',
                largeIcon: 'morning_meditation_reminder_icon',
                image: 'morning_meditation_reminder_icon',
                userInfo: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MORNING_MEDITATION_REMINDER_SUBCATEGORY,
                },
            });
        });
    });

    describe('#cancelAndScheduleMeditateWithTrainerReminderNotifications', () => {
        it('Should able to schedule meditate with trainer local notification and followup notification', async () => {
            scheduleNotificationMockResponse('1');
            prepareMeditateWithTrainerReminderSchedulingNotificationId(
                undefined,
            );
            prepareMeditateWithTrainerFollowUpReminderSchedulingNotificationId(
                undefined,
            );
            await ReminderNotificationService.cancelAndScheduleMeditateWithTrainerReminderNotifications(
                3,
            );
            expect(cancelNotificationByIdMock).not.toBeCalled();
            expect(scheduleNotificationMock).toBeCalledTimes(2);
        });
        it('Should able to cancel and schedule meditate with trainer local notification and followup notification and last sitting date is undefined', async () => {
            scheduleNotificationMockResponse('3');
            prepareMeditateWithTrainerReminderSchedulingNotificationId(1);
            prepareMeditateWithTrainerFollowUpReminderSchedulingNotificationId(
                2,
            );
            await ReminderNotificationService.cancelAndScheduleMeditateWithTrainerReminderNotifications(
                3,
            );
            expect(cancelNotificationByIdMock).toBeCalledWith(1);
            expect(cancelNotificationByIdMock).toBeCalledWith(2);
            expect(scheduleNotificationMock).toBeCalledTimes(2);
        });
        it('Should able to cancel and schedule meditate with trainer local notification and followup notification', async () => {
            scheduleNotificationMockResponse('3');
            prepareMeditateWithTrainerReminderSchedulingNotificationId(1);
            prepareMeditateWithTrainerFollowUpReminderSchedulingNotificationId(
                2,
            );
            await ReminderNotificationService.cancelAndScheduleMeditateWithTrainerReminderNotifications(
                3,
            );
            expect(cancelNotificationByIdMock).toBeCalledWith(1);
            expect(cancelNotificationByIdMock).toBeCalledWith(2);
            expect(scheduleNotificationMock).toBeCalledTimes(2);
        });
    });

    describe('#cancelReminderNotifications', () => {
        it('Should not able to cancel the reminder notification if reminders are not set', async () => {
            prepareMorningMeditationSchedulingNotificationId(undefined);
            prepareEveningCleaningSchedulingNotificationId(undefined);
            prepareMeditateWithTrainerReminderSchedulingNotificationId(
                undefined,
            );
            prepareMeditateWithTrainerFollowUpReminderSchedulingNotificationId(
                undefined,
            );
            await ReminderNotificationService.cancelReminderNotifications();
            expect(cancelNotificationByIdMock).not.toBeCalled();
        });

        it('Should able to cancel all the reminder notification if reminders are already set', async () => {
            prepareMorningMeditationSchedulingNotificationId(1);
            prepareEveningCleaningSchedulingNotificationId(1);
            prepareMeditateWithTrainerReminderSchedulingNotificationId(1);
            prepareMeditateWithTrainerFollowUpReminderSchedulingNotificationId(
                2,
            );
            await ReminderNotificationService.cancelReminderNotifications();
            expect(cancelNotificationByIdMock).toBeCalledWith(1);
            expect(cancelNotificationByIdMock).toBeCalledWith(1);
            expect(cancelNotificationByIdMock).toBeCalledWith(1);
            expect(cancelNotificationByIdMock).toBeCalledWith(2);
        });
    });
    describe('#scheduleDay2MasterClassReminderNotification', () => {
        it('Should able to schedule day2 master class reminder notification when notification scheduling date is greater than current date', async () => {
            const schedulingDate = new Date(1572422400000);
            scheduleNotificationMockResponse('1');
            prepareDay2MasterClassReminderSchedulingNotificationId(undefined);
            await ReminderNotificationService.scheduleDay2MasterClassReminderNotification(
                dateMock,
                REMINDER.masterClassDay2ReminderContentId,
            );
            expect(scheduleNotificationMock).toBeCalledTimes(1);
            expect(scheduleNotificationMock).toBeCalledWith({
                channelId: 'General Notification',
                date: schedulingDate,
                message:
                    'A guided session to teach you how to detox your mind and help you let go of stress and complex emotions',
                title: 'Masterclasses - Day 2',
                userInfo: {
                    masterClasses: 'day2',
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                },
            });
        });
        it('Should not able to schedule day2 master class reminder notification when notification scheduling date is lesser than current date', async () => {
            const masterClassFinishedDate = '2019-09-30T00:00:00.000Z';
            scheduleNotificationMockResponse('1');
            prepareDay2MasterClassReminderSchedulingNotificationId(undefined);
            await ReminderNotificationService.scheduleDay2MasterClassReminderNotification(
                masterClassFinishedDate,
                REMINDER.masterClassDay2ReminderContentId,
            );
            expect(scheduleNotificationMock).not.toBeCalled();
        });
    });
    describe('#scheduleDay3MasterClassReminderNotification', () => {
        it('Should able to schedule day3 master class reminder notification when notification scheduling date is greater than current date', async () => {
            const schedulingDate = new Date(1572422400000);
            scheduleNotificationMockResponse('1');
            prepareDay3MasterClassReminderSchedulingNotificationId(undefined);
            await ReminderNotificationService.scheduleDay3MasterClassReminderNotification(
                dateMock,
                REMINDER.masterClassDay3ReminderContentId,
            );
            expect(scheduleNotificationMock).toBeCalledTimes(1);
            expect(scheduleNotificationMock).toBeCalledWith({
                channelId: 'General Notification',
                date: schedulingDate,
                message:
                    'A guided session to help you learn to connect with your inner self and weave your own destiny',
                title: 'Masterclasses - Day 3',
                userInfo: {
                    masterClasses: 'day3',
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                },
            });
        });
        it('Should not able to schedule day3 master class reminder notification when notification scheduling date is lesser than current date', async () => {
            const masterClassFinishedDate = '2019-09-30T00:00:00.000Z';
            scheduleNotificationMockResponse('1');
            prepareDay2MasterClassReminderSchedulingNotificationId(undefined);
            await ReminderNotificationService.scheduleDay3MasterClassReminderNotification(
                masterClassFinishedDate,
                REMINDER.masterClassDay3ReminderContentId,
            );
            expect(scheduleNotificationMock).not.toBeCalled();
        });
    });
});
