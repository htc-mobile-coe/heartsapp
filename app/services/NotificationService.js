import PushNotification from 'react-native-push-notification';
import { get, isEqual, includes } from 'lodash';
import {
    IsAndroid,
    IsIOS,
    NOTIFICATION_CHANNEL_ID,
    NotificationCategory,
    NotificationSubCategory,
} from '../shared/Constants';
import Application from './Application';
import { NativeModules } from 'react-native';
import ApplicationEventHandlers from './ApplicationEventHandlers';

class NotificationService {
    //onNotificaitn is a function passed in that is to be called when a
    //notification is to be emitted.
    constructor() {
        this.lastId = 0;
    }

    configure = () => {
        PushNotification.configure({
            onRegister: this.onRegister,

            onNotification: this.onNotification,

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            senderID:
                NativeModules.ApplicationConstants.PUSH_NOTIFICATION_SENDER_ID,
            popInitialNotification: false,
        });

        if (IsAndroid) {
            this._createChannel(
                NOTIFICATION_CHANNEL_ID.SILENT_NOTIFICATION,
                'Silent meditate session',
                'Silent meditate session',
                undefined,
                false,
            );
            this._createChannel(
                NOTIFICATION_CHANNEL_ID.GENERAL,
                'Meditation session',
                'Meditation session',
                'default',
            );
            this._createChannel(
                NOTIFICATION_CHANNEL_ID.MEDITATION_START,
                'Meditation start',
                'Please start meditation',
                'psm_m.mp3',
            );
            this._createChannel(
                NOTIFICATION_CHANNEL_ID.MEDITATION_END,
                'Meditation end',
                'Meditation ended',
                'tha_m.mp3',
            );
            this._createChannel(
                NOTIFICATION_CHANNEL_ID.TRAINER_INCOMING_SESSION,
                'Meditation incoming session',
                'Trainer incoming session request ',
                'apple_ring.mp3',
            );
        }
    };

    _createChannel = (
        channelId,
        channelName,
        channelDescription,
        soundName,
        playSound = true,
    ) => {
        PushNotification.channelExists(channelId, exists => {
            if (!exists) {
                PushNotification.createChannel({
                    channelId,
                    channelName,
                    channelDescription,
                    soundName,
                    playSound,
                });
            }
        });
    };
    onRegister = registration => {
        this.token = registration.token;
    };

    //Appears right away
    localNotification = notif => {
        this.lastId++;
        const idString = this.lastId + '';
        PushNotification.localNotification({
            ...notif,
            id: idString,
            userInfo: { ...notif.userInfo, id: idString },
        });

        return this.lastId;
    };

    //Appears after a specified time. App does not have to be open.
    scheduleNotification = notif => {
        this.lastId++;
        const idString = this.lastId + '';
        PushNotification.localNotificationSchedule({
            ...notif,
            id: idString,
            allowWhileIdle: false,
            userInfo: { ...notif.userInfo, id: idString },
        });
        return this.lastId;
    };

    onNotification = notif => {
        const category = get(notif, 'data.category');
        const categorySubType = get(notif, 'data.categorySubType');
        const userInteraction = get(notif, 'userInteraction');
        if (
            isEqual(category, NotificationCategory.SCHEDULED_CONTENT_SERVICE) &&
            isEqual(userInteraction, true) &&
            includes(
                [
                    NotificationSubCategory.MORNING_MEDITATION_REMINDER_SUBCATEGORY,
                    NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
                    NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                    NotificationSubCategory.WEEKLY_INSPIRATION_TOPIC_SUBCATEGORY,
                    NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                ],
                categorySubType,
            )
        ) {
            ApplicationEventHandlers.onNotificationOpenedAppInBackground(notif);
            notif.finish();
            return;
        }
        if (IsAndroid) {
            if (get(notif, 'userInfo.isPreceptorNeededNotification')) {
                notif.finish();
                Application.showPreceptorsNeededAlert();
                PushNotification.cancelLocalNotifications({
                    id: get(notif, 'userInfo.id'),
                });
            }

            if (get(notif, 'userInfo.isZeroPreceptorNotification')) {
                notif.finish();
                Application.showZeroPreceptorsAlert();
                PushNotification.cancelLocalNotifications({
                    id: get(notif, 'userInfo.id'),
                });
            }
        }

        if (IsIOS) {
            if (
                category === NotificationCategory.MEDITATION_SERVICE &&
                categorySubType ===
                    NotificationSubCategory.LOW_PRECEPTOR_CONDITION
            ) {
                notif.finish();
                Application.showPreceptorsNeededAlert();
            }

            if (
                category === NotificationCategory.MEDITATION_SERVICE &&
                categorySubType ===
                    NotificationSubCategory.ZERO_PRECEPTOR_CONDITION
            ) {
                notif.finish();
                Application.showZeroPreceptorsAlert();
            }
        }
    };

    checkPermission = cbk => {
        return PushNotification.checkPermissions(cbk);
    };

    cancelNotificationById = notificationId => {
        PushNotification.cancelLocalNotifications({ id: notificationId + '' });
    };

    cancelAll = () => {
        PushNotification.cancelAllLocalNotifications();
    };
}

export default new NotificationService();
