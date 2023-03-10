import React, { Component } from 'react';
import { View } from 'native-base';
import Modal from 'react-native-modal';
import { Image, TouchableOpacity, Switch } from 'react-native';
import { styles } from './ReminderButton.styles';
import { MediumBoldText, Text, BoldText } from '../shared/Text';
import { REMINDER } from '../../shared/Constants';
import DaysInputSpinner from './DaysInputSpinner';
import TimePicker from './TimePicker';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { convertTimeto12HourFormat } from '../../utils/TimePickerUtils';
export default class ReminderButton extends Component {
    _renderImage = () => {
        const { imageSource, isToggledOn, imageSourceDisabled } = this.props;
        const imageStyle = isToggledOn ? imageSource : imageSourceDisabled;
        return (
            <View style={styles.imageContainer}>
                <Image
                    testID="reminderButton__icon--image"
                    source={imageStyle}
                    resizeMode={'stretch'}
                    style={styles.image}
                />
            </View>
        );
    };

    _renderReminderOnOffButton = () => {
        const { isToggledOn, onToggledStatusChange } = this.props;
        return (
            <View style={styles.onOffSwitchContainer}>
                <Switch
                    testID="switchReminder--button"
                    onChange={onToggledStatusChange}
                    value={isToggledOn}
                />
            </View>
        );
    };
    _renderTimePicker = () => {
        const {
            showTimePicker,
            meditationTime,
            onTimePickerSaveButtonPress,
            onTimePickerCancelButtonPress,
            onChangingTime,
            selectedTime,
        } = this.props;

        return (
            <Modal
                testID="modalContaining-timepicker"
                isVisible={showTimePicker}
                onBackdropPress={onTimePickerCancelButtonPress}
                style={styles.timePickerContainerStyle}>
                <TimePicker
                    onChangeTime={onChangingTime}
                    onSaveButtonPress={onTimePickerSaveButtonPress}
                    meditationTime={meditationTime}
                    selectedTime={selectedTime}
                />
            </Modal>
        );
    };
    getValidationSchema = () => {
        return Yup.object().shape({
            additionalCount: Yup.number()
                .min(1, 'validations:invalidValue')
                .max(REMINDER.maxCount, 'validations:invalidValue')
                .integer('validations:invalidValue'),
        });
    };

    _renderForm = formikProps => {
        const { isToggledOn, onDaysCountChange } = this.props;
        const { values, setFieldValue } = formikProps;

        return (
            <DaysInputSpinner
                values={values}
                disabled={!isToggledOn}
                setFieldValue={setFieldValue}
                onDaysCountChange={onDaysCountChange}
            />
        );
    };
    _renderFormikForm = () => {
        const { daysCount } = this.props;
        return (
            <Formik
                initialValues={{
                    additionalCount: daysCount,
                    maximumCountAllowed: REMINDER.maxCount,
                }}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                testID="FormikForm__submit"
                children={this._renderForm}
            />
        );
    };
    _renderTime = () => {
        const { time, meridiem, isToggledOn } = this.props;
        const timeChoosen = convertTimeto12HourFormat(time);
        const titleStyle = isToggledOn
            ? styles.timeTitle
            : styles.timeTitleDisbled;
        const subTitleStyle = isToggledOn
            ? styles.timeSubTitle
            : styles.timeSubTitleDisabled;
        return (
            <View style={styles.timeContainer}>
                <BoldText
                    testID="timeDisplay_container--text"
                    style={titleStyle}>
                    {timeChoosen}
                </BoldText>
                <MediumBoldText style={subTitleStyle}>
                    {meridiem}
                </MediumBoldText>
            </View>
        );
    };

    _renderText = () => {
        const {
            testID,
            onReminderButtonPress,
            title,
            subTitle,
            isToggledOn,
            showDaysInputSpinner,
            disabled,
        } = this.props;
        const containerStyle = [styles.textContainer];
        const titleStyle = isToggledOn ? styles.title : styles.titleDisabled;
        const subTitleStyle = isToggledOn
            ? styles.subTitle
            : styles.subTitleDisabled;
        const renderComponent = showDaysInputSpinner
            ? this._renderFormikForm()
            : this._renderTime();
        return (
            <View style={containerStyle}>
                <TouchableOpacity
                    style={styles.button}
                    testID={testID}
                    disabled={disabled}
                    onPress={onReminderButtonPress}>
                    <Text style={titleStyle}>{title}</Text>
                    {renderComponent}

                    <Text style={subTitleStyle}>{subTitle}</Text>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { style } = this.props;

        return (
            <View style={[styles.container, style]}>
                {this._renderImage()}
                {this._renderText()}
                {this._renderReminderOnOffButton()}
                {this._renderTimePicker()}
            </View>
        );
    }
}
