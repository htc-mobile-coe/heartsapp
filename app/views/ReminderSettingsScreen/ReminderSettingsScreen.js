import React, { Component } from 'react';
import { View } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import ReminderButton from './ReminderButton';
import { withTranslation } from 'react-i18next';
import { styles as reminderSettingsStyles } from './ReminderSettingsScreen.styles';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import reminderSettingsScreenImages from '../../shared/Images';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { ActivityIndicator } from 'react-native';
import Modal from 'react-native-modal';

class ReminderSettingsScreen extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _renderLoader = () => {
        const { styles, showActivityIndicator } = this.props;
        if (showActivityIndicator) {
            return (
                <Modal
                    testID="modalContaining-timepicker"
                    isVisible={showActivityIndicator}
                    backdropOpacity={0.3}>
                    <ActivityIndicator size="large" style={styles.loader} />
                </Modal>
            );
        }
    };

    render() {
        const {
            t,
            styles,
            images,
            onMorningReminderButtonPress,
            onEveningReminderButtonPress,
            morningReminder,
            eveningReminder,
            onMorningToggleSwitchPress,
            onEveningToggleSwitchPress,
            showTimePicker,
            meditationTime,
            onTimePickerSaveButtonPress,
            onTimePickerCancelButtonPress,
            onChangingTime,
            morningTime,
            eveningTime,
            choosenTime,
            onReminderButtonPress,
            isMeditateWithTrainerReminderToggledOn,
            onMeditationWithTrainerToggleSwitchPress,
            onDaysCountChangeForMeditateWithTrainerReminder,
            daysCountForMeditateWithTrainerReminder,
        } = this.props;
        return (
            <ScreenContainer scrollEnabled={false}>
                <OptionsScreenHeader
                    title={t('reminderSettingsScreen:title')}
                    onBackPress={this._handleBackPress}
                />
                <View>
                    <View style={styles.viewButtonContainer}>
                        {this._renderLoader()}
                        <ReminderButton
                            testID="reminderSettingsScreen__morningMeditation--button"
                            title={t(
                                'reminderSettingsScreen:morningMeditation',
                            )}
                            onReminderButtonPress={onMorningReminderButtonPress}
                            time={morningTime}
                            meridiem={'AM'}
                            subTitle={t('reminderSettingsScreen:daily')}
                            imageSource={images.morning}
                            showDaysInputSpinner={false}
                            isToggledOn={morningReminder}
                            disabled={!morningReminder}
                            imageSourceDisabled={images.morningdisabled}
                            onToggledStatusChange={onMorningToggleSwitchPress}
                            showTimePicker={showTimePicker}
                            meditationTime={meditationTime}
                            selectedTime={choosenTime}
                            onTimePickerSaveButtonPress={
                                onTimePickerSaveButtonPress
                            }
                            onTimePickerCancelButtonPress={
                                onTimePickerCancelButtonPress
                            }
                            onChangingTime={onChangingTime}
                            style={styles.bigButton}
                        />

                        <ReminderButton
                            testID="reminderSettingsScreen__eveningCleaning--button"
                            title={t('reminderSettingsScreen:eveningCleaning')}
                            onReminderButtonPress={onEveningReminderButtonPress}
                            time={eveningTime}
                            meridiem={'PM'}
                            subTitle={t('reminderSettingsScreen:daily')}
                            imageSource={images.evening}
                            imageSourceDisabled={images.eveningdisabled}
                            showDaysInputSpinner={false}
                            isToggledOn={eveningReminder}
                            disabled={!eveningReminder}
                            onToggledStatusChange={onEveningToggleSwitchPress}
                            showTimePicker={showTimePicker}
                            meditationTime={meditationTime}
                            selectedTime={choosenTime}
                            onTimePickerSaveButtonPress={
                                onTimePickerSaveButtonPress
                            }
                            onTimePickerCancelButtonPress={
                                onTimePickerCancelButtonPress
                            }
                            onChangingTime={onChangingTime}
                            style={styles.bigButton}
                        />
                        <ReminderButton
                            testID="reminderSettingsScreen__meditationWithTrainer--button"
                            title={t(
                                'reminderSettingsScreen:meditationWithTrainer',
                            )}
                            onReminderButtonPress={onReminderButtonPress}
                            subTitle={t('reminderSettingsScreen:daysLater')}
                            imageSource={images.trainer}
                            showDaysInputSpinner={true}
                            isToggledOn={isMeditateWithTrainerReminderToggledOn}
                            disabled={true}
                            imageSourceDisabled={images.trainerdisabled}
                            onToggledStatusChange={
                                onMeditationWithTrainerToggleSwitchPress
                            }
                            style={styles.bigButton}
                            daysCount={daysCountForMeditateWithTrainerReminder}
                            onDaysCountChange={
                                onDaysCountChangeForMeditateWithTrainerReminder
                            }
                        />
                    </View>
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(
        ReminderSettingsScreen,
        reminderSettingsStyles,
        reminderSettingsScreenImages,
    ),
);
