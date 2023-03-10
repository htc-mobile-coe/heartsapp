import React, { Component } from 'react';
import ReminderSettingsScreen from './ReminderSettingsScreen';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { get, isEqual, isNil } from 'lodash';
import { operations } from '../../state';
import { withTranslation } from 'react-i18next';
import { handleSaveUserPreferences } from './index.service';
import i18n from 'i18next';
import moment from 'moment';
import { getCalculatedTime } from '../../utils/TimePickerUtils';
import StorageService from '../../services/native/AppStorageService';
import ReminderNotificationService from '../../services/ReminderNotificationService';
import { REMINDER, Scenes } from '../../shared/Constants';
import NotificationService from '../../services/NotificationService';
import { InteractionManager } from 'react-native';
import { logEvent } from '../../services/firebase/AnalyticsService';

export class ReminderSettingsContainer extends Component {
    state = {
        showTimePicker: false,
        morningReminder: true,
        eveningReminder: true,
        meditationWithTrainerReminder: true,
        meditationTime: 'morning',
        choosenTime: '06:00',
        morningTime: '06:00',
        eveningTime: '19:00',
        showActivityIndicator: false,
        daysCountForMeditateWithTrainerReminder: 7,
    };
    _handleBackPress = () => {
        this.props.goBack();
    };

    static getDerivedStateFromProps(props, state) {
        const { meditationRemindersSettings } = props;
        if (
            !isEqual(
                meditationRemindersSettings,
                state.meditationRemindersSettings,
            )
        ) {
            const morningTime =
                meditationRemindersSettings.morningMeditationTime;
            const eveningTime = meditationRemindersSettings.eveningCleaningTime;
            const morningToggle =
                meditationRemindersSettings.isMorningMeditationReminderEnabled;
            const eveningToggle =
                meditationRemindersSettings.isEveningMeditationReminderEnabled;
            const meditationWithTrainerReminder =
                meditationRemindersSettings.isReminderForNextSittingEnabled;
            const nextSittingReminderIntervalInDays =
                meditationRemindersSettings.nextSittingReminderIntervalInDays;

            const morningTimeValue = moment()
                .startOf('day')
                .seconds(morningTime)
                .format('HH:mm');
            const eveningTimeValue = moment()
                .startOf('day')
                .seconds(eveningTime)
                .format('HH:mm');

            return {
                morningTime: morningTimeValue,
                eveningTime: eveningTimeValue,
                morningReminder: morningToggle,
                eveningReminder: eveningToggle,
                meditationWithTrainerReminder: meditationWithTrainerReminder,
                daysCountForMeditateWithTrainerReminder: nextSittingReminderIntervalInDays,
            };
        }
        return null;
    }
    _updateUserPreferences = async values => {
        const {
            shouldPlayGuidedRelaxationAudio,
            isWeeklyInspirationNotificationSubscribed,
            setMeditationRemindersSettings,
        } = this.props;

        handleSaveUserPreferences({
            shouldPlayRelaxationAudioBeforeMeditation: shouldPlayGuidedRelaxationAudio,
            language: i18n.language,
            isSubscribedToWeeklyInspiration: isWeeklyInspirationNotificationSubscribed,
            morningReminder: values.morningReminder,
            eveningReminder: values.eveningReminder,
            morningMeditationTime: values.morningTime,
            eveningCleaningTime: values.eveningTime,
            isReminderForNextSittingEnabled:
                values.meditationWithTrainerReminder,
            nextSittingReminderIntervalInDays:
                values.daysCountForMeditateWithTrainerReminder,
        });

        const remindersSettings = {
            isMorningMeditationReminderEnabled: values.morningReminder,
            isEveningMeditationReminderEnabled: values.eveningReminder,
            morningMeditationTime: values.morningTime,
            eveningCleaningTime: values.eveningTime,
            isReminderForNextSittingEnabled:
                values.meditationWithTrainerReminder,
            nextSittingReminderIntervalInDays:
                values.daysCountForMeditateWithTrainerReminder,
        };

        setMeditationRemindersSettings(remindersSettings);
    };

    _handleMorningReminderButtonPress = () => {
        this.setState({
            meditationTime: 'morning',
            choosenTime: this.state.morningTime,
            showTimePicker: true,
        });
        logEvent(
            'reminders_morning_notification_open',
            Scenes.remindersSettings,
        );
    };
    _handleEveningReminderButtonPress = () => {
        this.setState({
            meditationTime: 'evening',
            choosenTime: this.state.eveningTime,
            showTimePicker: true,
        });
        logEvent(
            'reminders_evening_notification_open',
            Scenes.remindersSettings,
        );
    };
    _handleReminderButtonPress = () => {
        this.setState({
            showTimePicker: false,
        });
        logEvent(
            'reminders_morning_notification_dismiss',
            Scenes.remindersSettings,
        );
        logEvent(
            'reminders_evening_notification_dismiss',
            Scenes.remindersSettings,
        );
    };

    _handleActivityIndicatorVisibilityChange = visible => {
        this.setState({ showActivityIndicator: visible });
    };

    _handleTimePickerSaveButtonPress = async () => {
        this.setState({ showTimePicker: false });
        this._handleActivityIndicatorVisibilityChange(true);
        InteractionManager.runAfterInteractions(async () => {
            const choosenTime = this.state.choosenTime;

            if (isEqual(this.state.meditationTime, REMINDER.morning)) {
                this.setState({ morningTime: choosenTime });
                const morningNotificationId = await StorageService.morningMeditationSchedulingNotificationId.getValue();
                if (!isNil(morningNotificationId)) {
                    NotificationService.cancelNotificationById(
                        morningNotificationId,
                    );
                }
                ReminderNotificationService.scheduleMorningMeditationReminderNotification(
                    choosenTime,
                );

                this._updateUserPreferences({
                    morningReminder: this.state.morningReminder,
                    eveningReminder: this.state.eveningReminder,
                    morningTime: moment.duration(choosenTime).asSeconds(),
                    eveningTime: moment
                        .duration(this.state.eveningTime)
                        .asSeconds(),
                    meditationWithTrainerReminder: this.state
                        .meditationWithTrainerReminder,
                    daysCountForMeditateWithTrainerReminder: this.state
                        .daysCountForMeditateWithTrainerReminder,
                });
                await StorageService.morningMeditationReminderTime.setValue(
                    choosenTime,
                );
            } else {
                const eveningNotificationId = await StorageService.eveningCleaningSchedulingNotificationId.getValue();
                if (!isNil(eveningNotificationId)) {
                    NotificationService.cancelNotificationById(
                        eveningNotificationId,
                    );
                }
                this.setState({ eveningTime: choosenTime });
                ReminderNotificationService.scheduleEveningCleaningReminderNotification(
                    choosenTime,
                );
                this._updateUserPreferences({
                    morningReminder: this.state.morningReminder,
                    eveningReminder: this.state.eveningReminder,
                    morningTime: moment
                        .duration(this.state.morningTime)
                        .asSeconds(),
                    eveningTime: moment.duration(choosenTime).asSeconds(),
                    meditationWithTrainerReminder: this.state
                        .meditationWithTrainerReminder,
                    daysCountForMeditateWithTrainerReminder: this.state
                        .daysCountForMeditateWithTrainerReminder,
                });
                await StorageService.eveningCleaningReminderTime.setValue(
                    choosenTime,
                );
            }
            this._handleActivityIndicatorVisibilityChange(false);
        });
    };

    _handleTimePickerCancelButtonPress = () => {
        this.setState({ showTimePicker: false });
    };

    _handleMorningToggleSwitch = async () => {
        this.setState({ morningReminder: !this.state.morningReminder });
        const event = this.state.morningReminder
            ? 'reminders_Morning_notification_on'
            : 'reminders_Morning_notification_off';
        logEvent(event, Scenes.remindersSettings);
        this._updateUserPreferences({
            morningReminder: !this.state.morningReminder,
            eveningReminder: this.state.eveningReminder,
            morningTime: moment.duration(this.state.morningTime).asSeconds(),
            eveningTime: moment.duration(this.state.eveningTime).asSeconds(),
            meditationWithTrainerReminder: this.state
                .meditationWithTrainerReminder,
            daysCountForMeditateWithTrainerReminder: this.state
                .daysCountForMeditateWithTrainerReminder,
        });

        const morningNotificationId = await StorageService.morningMeditationSchedulingNotificationId.getValue();
        if (!isNil(morningNotificationId)) {
            NotificationService.cancelNotificationById(morningNotificationId);
        }
        await StorageService.hasMorningMeditationReminderNotificationEnabled.setValue(
            !this.state.morningReminder,
        );
        if (this.state.morningReminder) {
            await ReminderNotificationService.scheduleMorningMeditationReminderNotification(
                this.state.morningTime,
            );
        }
    };

    _handleEveningToggleSwitch = async () => {
        this.setState({ eveningReminder: !this.state.eveningReminder });
        const event = this.state.eveningReminder
            ? 'reminders_evening_notification_on'
            : 'reminders_evening_notification_off';

        logEvent(event, Scenes.remindersSettings);
        this._updateUserPreferences({
            morningReminder: this.state.morningReminder,
            eveningReminder: !this.state.eveningReminder,
            morningTime: moment.duration(this.state.morningTime).asSeconds(),
            eveningTime: moment.duration(this.state.eveningTime).asSeconds(),
            meditationWithTrainerReminder: this.state
                .meditationWithTrainerReminder,
            daysCountForMeditateWithTrainerReminder: this.state
                .daysCountForMeditateWithTrainerReminder,
        });

        const eveningNotificationId = await StorageService.eveningCleaningSchedulingNotificationId.getValue();
        if (!isNil(eveningNotificationId)) {
            NotificationService.cancelNotificationById(eveningNotificationId);
        }

        await StorageService.hasEveningCleaningReminderNotificationEnabled.setValue(
            !this.state.eveningReminder,
        );
        if (this.state.eveningReminder) {
            await ReminderNotificationService.scheduleEveningCleaningReminderNotification(
                this.state.eveningTime,
            );
        }
    };

    _handleMeditationWithTrainerToggleSwitch = async () => {
        this.setState({
            meditationWithTrainerReminder: !this.state
                .meditationWithTrainerReminder,
        });
        const event = this.state.meditationWithTrainerReminder
            ? 'reminders_medwithTrainer_notification_on'
            : 'reminders_medwithTrainer_notification_off';
        logEvent(event, Scenes.remindersSettings);

        this._updateUserPreferences({
            morningReminder: this.state.morningReminder,
            eveningReminder: this.state.eveningReminder,
            morningTime: moment.duration(this.state.morningTime).asSeconds(),
            eveningTime: moment.duration(this.state.eveningTime).asSeconds(),
            meditationWithTrainerReminder: !this.state
                .meditationWithTrainerReminder,
            daysCountForMeditateWithTrainerReminder: this.state
                .daysCountForMeditateWithTrainerReminder,
        });
        if (!this.state.meditationWithTrainerReminder) {
            await ReminderNotificationService.cancelAndScheduleMeditateWithTrainerReminderNotifications(
                this.state.daysCountForMeditateWithTrainerReminder,
            );
        }
    };

    _handleTimeChange = date => {
        const calculatedTime = getCalculatedTime(date);
        this.setState({ choosenTime: calculatedTime });
    };

    _handleDayCountForMeditateWithTrainerReminderChange = async days => {
        this.setState({ daysCountForMeditateWithTrainerReminder: days });
        this._handleActivityIndicatorVisibilityChange(true);
        InteractionManager.runAfterInteractions(async () => {
            this._updateUserPreferences({
                morningReminder: this.state.morningReminder,
                eveningReminder: this.state.eveningReminder,
                morningTime: moment
                    .duration(this.state.morningTime)
                    .asSeconds(),
                eveningTime: moment
                    .duration(this.state.eveningTime)
                    .asSeconds(),
                meditationWithTrainerReminder: this.state
                    .meditationWithTrainerReminder,
                daysCountForMeditateWithTrainerReminder: days,
            });
            if (this.state.meditationWithTrainerReminder) {
                await ReminderNotificationService.cancelAndScheduleMeditateWithTrainerReminderNotifications(
                    days,
                );
            }
            this._handleActivityIndicatorVisibilityChange(false);
        });
    };

    render() {
        return (
            <ReminderSettingsScreen
                onBackPress={this._handleBackPress}
                onMorningReminderButtonPress={
                    this._handleMorningReminderButtonPress
                }
                onEveningReminderButtonPress={
                    this._handleEveningReminderButtonPress
                }
                onReminderButtonPress={this._handleReminderButtonPress}
                showTimePicker={this.state.showTimePicker}
                morningReminder={this.state.morningReminder}
                eveningReminder={this.state.eveningReminder}
                isMeditateWithTrainerReminderToggledOn={
                    this.state.meditationWithTrainerReminder
                }
                meditationTime={this.state.meditationTime}
                choosenTime={this.state.choosenTime}
                morningTime={this.state.morningTime}
                eveningTime={this.state.eveningTime}
                showActivityIndicator={this.state.showActivityIndicator}
                daysCountForMeditateWithTrainerReminder={
                    this.state.daysCountForMeditateWithTrainerReminder
                }
                onChangingTime={this._handleTimeChange}
                onTimePickerSaveButtonPress={
                    this._handleTimePickerSaveButtonPress
                }
                onTimePickerCancelButtonPress={
                    this._handleTimePickerCancelButtonPress
                }
                onMorningToggleSwitchPress={this._handleMorningToggleSwitch}
                onEveningToggleSwitchPress={this._handleEveningToggleSwitch}
                onMeditationWithTrainerToggleSwitchPress={
                    this._handleMeditationWithTrainerToggleSwitch
                }
                onDaysCountChangeForMeditateWithTrainerReminder={
                    this._handleDayCountForMeditateWithTrainerReminderChange
                }
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        roleDeclaredByUser: state.onboardingStatus.roleDeclaredByUser,
        authenticated: get(state.user, 'authenticated'),
        shouldPlayGuidedRelaxationAudio: operations.user.shouldPlayGuidedRelaxation(
            state,
        ),
        isWeeklyInspirationNotificationSubscribed: operations.user.hasUserSubscribedToWeeklyInspirationNotification(
            state,
        ),
        meditationRemindersSettings: get(
            state.user,
            'meditationRemindersSettings',
        ),
    };
};

const mapDispatchToProps = {
    goBack,
    ...operations.onboardingStatus,
    ...operations.appBusyStatus,
    ...operations.preceptorDashboard,
    ...operations.user,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(ReminderSettingsContainer));
