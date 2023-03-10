import NotificationService from './NotificationService';
import ApplicationEventHandlers from './ApplicationEventHandlers';
import PushNotification from 'react-native-push-notification';
import {
    NOTIFICATION_CHANNEL_ID,
    NotificationCategory,
    NotificationSubCategory,
} from '../shared/Constants';
import { getSelectedTime } from '../utils/TimePickerUtils';

describe('NotificationService', () => {
    const scheduleNotificationMock = jest
        .spyOn(PushNotification, 'localNotificationSchedule')
        .mockImplementation(() => {});
    const onNotificationOpenedAppInBackgroundMock = jest
        .spyOn(ApplicationEventHandlers, 'onNotificationOpenedAppInBackground')
        .mockImplementation(() => {});
    const finishMock = jest.fn();
    afterEach(() => {
        finishMock.mockClear();
        scheduleNotificationMock.mockClear();
        onNotificationOpenedAppInBackgroundMock.mockClear();
    });
    it('Should able to call the schedule local notaification', () => {
        const dateObject = getSelectedTime('16:00');
        NotificationService.scheduleNotification({
            channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
            date: dateObject,
            title: 'mock title',
            message: 'mock message,',
            userInfo: {
                category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                categorySubType:
                    NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
            },
        });
        expect(scheduleNotificationMock).toBeCalledWith({
            allowWhileIdle: false,
            channelId: 'General Notification',
            date: dateObject,
            title: 'mock title',
            message: 'mock message,',
            id: '1',
            userInfo: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'EVENING_CLEANING_REMINDER_SUBCATEGORY',
                id: '1',
            },
        });
    });
    it('should able to open notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
        expect(onNotificationOpenedAppInBackgroundMock).toBeCalledWith({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
    });
    it('Should able to open morning reminder notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MORNING_MEDITATION_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
        expect(onNotificationOpenedAppInBackgroundMock).toBeCalledWith({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MORNING_MEDITATION_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
    });
    it('should not able to open notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: false,
        });
        expect(onNotificationOpenedAppInBackgroundMock).not.toBeCalled();
    });
    it('should not able to open morning reminder notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MORNING_MEDITATION_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: false,
        });
        expect(onNotificationOpenedAppInBackgroundMock).not.toBeCalled();
    });
    it('Should able to open evening reminder notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'EVENING_CLEANING_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
        expect(onNotificationOpenedAppInBackgroundMock).toBeCalledWith({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'EVENING_CLEANING_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
    });
    it('should not able to open evening reminder notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'EVENING_CLEANING_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: false,
        });
        expect(onNotificationOpenedAppInBackgroundMock).not.toBeCalled();
    });
    it('Should able to open meditate with trainer reminder notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
        expect(onNotificationOpenedAppInBackgroundMock).toBeCalledWith({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
    });
    it('should not able to open meditate with trainer reminder notification in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: false,
        });
        expect(onNotificationOpenedAppInBackgroundMock).not.toBeCalled();
    });
    it('Should able to open master class reminder notification, when user has opened the notification while app is in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MASTER_CLASS_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
        expect(onNotificationOpenedAppInBackgroundMock).toBeCalledWith({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MASTER_CLASS_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: true,
        });
    });
    it('should not able to open master class reminder notification, when user has not opened the notification while app is in background', () => {
        NotificationService.onNotification({
            channelId: 'General Notification',
            data: {
                category: 'SCHEDULED_CONTENT_SERVICE',
                categorySubType: 'MASTER_CLASS_REMINDER_SUBCATEGORY',
                id: '1',
            },
            finish: finishMock,
            foreground: true,
            message: 'mock message,',
            playSound: false,
            soundName: 'default',
            title: 'mock title',
            userInteraction: false,
        });
        expect(onNotificationOpenedAppInBackgroundMock).not.toBeCalled();
    });
});
