import StorageService from './native/AppStorageService';
import { isNil, isEqual, keys } from 'lodash';
import {
    getEveningCleaningReminderNotificationContent,
    getMorningMeditationReminderNotificationContent,
    getMeditateWithTrainerReminderNotificationContent,
    getMasterClassReminderNotificationContent,
    getTimeGapBetweenMasterClassesInSeconds,
} from './firebase/RemoteConfigService';
import {
    getDefaultLanguageToSelect,
    MASTERCLASS_VIDEOS,
    NOTIFICATION_CHANNEL_ID,
    NotificationCategory,
    NotificationSubCategory,
    REMINDER,
} from '../shared/Constants';
import NotificationService from './NotificationService';
import { getSelectedDate } from '../utils/TimePickerUtils';
import moment from 'moment';
class ReminderNotificationService {
    _getNotificationContent = (config, notificationId) => {
        const selectedLanguage = getDefaultLanguageToSelect(config);
        const configArray = config[selectedLanguage];
        const size = keys(configArray).length;
        const newNotificationId =
            isNil(notificationId) || isEqual(notificationId, size)
                ? 1
                : notificationId + 1;

        const data = config[selectedLanguage][newNotificationId];
        return { data, notificationId: newNotificationId };
    };
    _getCalculatedDate = (noOfDays, lastSittingDate, choosenTime) => {
        const calculatedDate = moment(lastSittingDate)
            .add(noOfDays, 'days')
            .toDate()
            .toDateString();
        return moment(calculatedDate + ' ' + choosenTime).toDate();
    };

    scheduleMorningMeditationReminderNotification = async time => {
        const config = await getMorningMeditationReminderNotificationContent();
        const notificationId = await StorageService.morningMeditationReminderNotificationId.getValue();

        const content = await this._getNotificationContent(
            config,
            notificationId,
        );
        await StorageService.morningMeditationReminderNotificationId.setValue(
            content.notificationId,
        );
        const morningTimeChoosen = getSelectedDate(time);
        const morningMeditationSchedulingNotificationId = NotificationService.scheduleNotification(
            {
                channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
                date: morningTimeChoosen,
                title: content.data.title,
                message: content.data.description,
                repeatType: REMINDER.daily,
                largeIcon: REMINDER.morningImage,
                image: REMINDER.morningImage, // required for iOS bundle image <name>.png
                userInfo: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MORNING_MEDITATION_REMINDER_SUBCATEGORY,
                },
            },
        );
        await StorageService.morningMeditationSchedulingNotificationId.setValue(
            morningMeditationSchedulingNotificationId,
        );
    };

    scheduleEveningCleaningReminderNotification = async time => {
        const config = await getEveningCleaningReminderNotificationContent();
        const notificationId = await StorageService.eveningCleaningReminderNotificationId.getValue();

        const content = await this._getNotificationContent(
            config,
            notificationId,
        );
        await StorageService.eveningCleaningReminderNotificationId.setValue(
            content.notificationId,
        );
        const eveningTimeChoosen = getSelectedDate(time);
        const eveningCleaningReminderNotificationId = NotificationService.scheduleNotification(
            {
                channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
                date: eveningTimeChoosen,
                title: content.data.title,
                message: content.data.description,
                repeatType: REMINDER.daily,
                largeIcon: REMINDER.eveningImage,
                image: REMINDER.eveningImage, // required for iOS bundle image <name>.png
                userInfo: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.EVENING_CLEANING_REMINDER_SUBCATEGORY,
                },
            },
        );

        await StorageService.eveningCleaningSchedulingNotificationId.setValue(
            eveningCleaningReminderNotificationId,
        );
    };

    scheduleMeditateWithTrainerReminderNotification = async (
        noOfDays,
        isFollowUpRemainder,
    ) => {
        const config = await getMeditateWithTrainerReminderNotificationContent();
        const notificationId = await StorageService.meditateWithTrainerReminderNotificationId.getValue();

        const content = await this._getNotificationContent(
            config,
            notificationId,
        );
        await StorageService.meditateWithTrainerReminderNotificationId.setValue(
            content.notificationId,
        );
        const meditateWithTrainerTimeChoosen = this._getCalculatedDate(
            noOfDays,
            new Date(),
            '09:00',
        );
        const meditateWithTrainerReminderNotificationId = NotificationService.scheduleNotification(
            {
                channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
                date: meditateWithTrainerTimeChoosen,
                title: content.data.title,
                message: content.data.description,
                largeIcon: REMINDER.trainerImage,
                image: REMINDER.trainerImage, // required for iOS bundle image <name>.png
                userInfo: {
                    category: NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                    categorySubType:
                        NotificationSubCategory.MEDITATE_WITH_TRAINER_REMINDER_SUBCATEGORY,
                },
            },
        );
        if (isFollowUpRemainder) {
            await StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId.setValue(
                meditateWithTrainerReminderNotificationId,
            );
        } else {
            await StorageService.meditateWithTrainerReminderSchedulingNotificationId.setValue(
                meditateWithTrainerReminderNotificationId,
            );
        }
    };

    cancelAndScheduleMeditateWithTrainerReminderNotifications = async noOfDays => {
        await this.cancelNotificationIfPresentInStorage(
            StorageService.meditateWithTrainerReminderSchedulingNotificationId,
        );
        await this.cancelNotificationIfPresentInStorage(
            StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId,
        );
        await this.scheduleMeditateWithTrainerReminderNotification(
            noOfDays,
            false,
        );
        await this.scheduleMeditateWithTrainerReminderNotification(
            noOfDays + 3,
            true,
        );
    };

    cancelNotificationIfPresentInStorage = async notificationIdInStorage => {
        const notificationId = await notificationIdInStorage.getValue();
        if (!isNil(notificationId)) {
            NotificationService.cancelNotificationById(notificationId);
        }
    };

    cancelReminderNotifications = async () => {
        await this.cancelNotificationIfPresentInStorage(
            StorageService.morningMeditationSchedulingNotificationId,
        );
        await this.cancelNotificationIfPresentInStorage(
            StorageService.eveningCleaningSchedulingNotificationId,
        );
        await this.cancelNotificationIfPresentInStorage(
            StorageService.meditateWithTrainerReminderSchedulingNotificationId,
        );
        await this.cancelNotificationIfPresentInStorage(
            StorageService.meditateWithTrainerFollowUpReminderSchedulingNotificationId,
        );
        await this.cancelNotificationIfPresentInStorage(
            StorageService.day2MasterClassReminderSchedulingNotificationId,
        );
        await this.cancelNotificationIfPresentInStorage(
            StorageService.day3MasterClassReminderSchedulingNotificationId,
        );
    };

    scheduleDay2MasterClassReminderNotification = async (
        masterClassFinishedDate,
        notificationContentId,
    ) => {
        const config = await getMasterClassReminderNotificationContent();
        const selectedLanguage = getDefaultLanguageToSelect(config);
        const content = config[selectedLanguage][notificationContentId];
        const timeGapInSeconds = getTimeGapBetweenMasterClassesInSeconds();
        const masterClassReminderNotificationSchedulingDate = moment(
            masterClassFinishedDate,
        )
            .add(timeGapInSeconds, 'seconds')
            .toDate();

        if (masterClassReminderNotificationSchedulingDate > moment()) {
            const masterClassNotificationId = NotificationService.scheduleNotification(
                {
                    channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
                    date: masterClassReminderNotificationSchedulingDate,
                    title: content.title,
                    message: content.description,
                    userInfo: {
                        masterClasses: MASTERCLASS_VIDEOS.DAY2,
                        category:
                            NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                        categorySubType:
                            NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                    },
                },
            );
            await StorageService.day2MasterClassReminderSchedulingNotificationId.setValue(
                masterClassNotificationId,
            );
        }
    };

    scheduleDay3MasterClassReminderNotification = async (
        masterClassFinishedDate,
        notificationContentId,
    ) => {
        const config = await getMasterClassReminderNotificationContent();
        const selectedLanguage = getDefaultLanguageToSelect(config);
        const content = config[selectedLanguage][notificationContentId];
        const timeGapInSeconds = getTimeGapBetweenMasterClassesInSeconds();
        const masterClassReminderNotificationSchedulingDate = moment(
            masterClassFinishedDate,
        )
            .add(timeGapInSeconds, 'seconds')
            .toDate();
        if (masterClassReminderNotificationSchedulingDate > moment()) {
            const masterClassNotificationId = NotificationService.scheduleNotification(
                {
                    channelId: NOTIFICATION_CHANNEL_ID.GENERAL,
                    date: masterClassReminderNotificationSchedulingDate,
                    title: content.title,
                    message: content.description,
                    userInfo: {
                        masterClasses: MASTERCLASS_VIDEOS.DAY3,
                        category:
                            NotificationCategory.SCHEDULED_CONTENT_SERVICE,
                        categorySubType:
                            NotificationSubCategory.MASTER_CLASS_REMINDER_SUBCATEGORY,
                    },
                },
            );
            await StorageService.day3MasterClassReminderSchedulingNotificationId.setValue(
                masterClassNotificationId,
            );
        }
    };
}
export default new ReminderNotificationService();
