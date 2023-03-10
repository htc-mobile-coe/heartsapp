import React, { Component } from 'react';
import { View } from 'native-base';
import { isEmpty, isNil } from 'lodash';
import moment from 'moment';
import { withTranslation } from 'react-i18next';
import { Textarea, Button } from 'app/views/shared';
import { Text } from 'app/views/shared/Text';
import Input from 'app/views/shared/Input';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as addOfflineSittingDetailsFormSyles } from './AddOfflineSittingDetails.styles';
import FormDatePicker from './FormDatePicker';
import FormTimePicker from './FormTimePicker';
import FormDurationInput from './FormDurationInput';
import MultiSelectionDropDown from './MultiSelectionDropDown';

class AddOfflineSittingDetailsForm extends Component {
    _handleFormChange = (event, name) => {
        const { setFieldValue, onChangeFormValues, values } = this.props;
        setFieldValue(name, event.target.value);
        onChangeFormValues({ ...values, [name]: event.target.value });
    };
    _handleNoOfPeopleChange = value => {
        const { setFieldValue, onChangeFormValues, values } = this.props;
        setFieldValue('numberOfPeople', value);
        onChangeFormValues({ ...values, numberOfPeople: value });
    };
    _handleCommentChange = value => {
        const { setFieldValue, onChangeFormValues, values } = this.props;
        setFieldValue('comments', value);
        onChangeFormValues({ ...values, comments: value });
    };
    _renderSubmitButton = () => {
        const { t, styles, onSubmit, isTrackNowSession } = this.props;
        const buttonTitle = isTrackNowSession
            ? t('addOfflineSittingDetails:save')
            : t('addOfflineSittingDetails:submit');
        return (
            <View style={styles.bottomButtonContainer}>
                <Button
                    rounded={true}
                    style={styles.bottomButton}
                    onPress={onSubmit}
                    text={buttonTitle}
                    testID="addSittingDetails__submit--button"
                />
            </View>
        );
    };
    _renderTimeValidationError = () => {
        const { styles, errors } = this.props;

        if (!isNil(errors.endTime)) {
            return (
                <Text testID="addSittingDetails--errorText" style={styles.validationErrorText}>{errors.endTime}</Text>
            );
        }
        return null;
    };
    _renderMultiSelectionDropDown = () => {
        const {
            styles,
            onRecentSeekerSelected,
            recentSeekersList,
            selectedSeekers,
            onRemoveSeeker,
            onSeekerSelection,
        } = this.props;
        return (
            <View style={styles.formInputComponentContainer}>
                <MultiSelectionDropDown
                    seekersList={recentSeekersList}
                    selectedSeekers={selectedSeekers}
                    onRecentSeekerSelected={onRecentSeekerSelected}
                    onRemoveSeeker={onRemoveSeeker}
                    onSeekerSelection={onSeekerSelection}
                />
            </View>
        );
    };
    _renderFormComponents = () => {
        const {
            isDatePickerDisable,
            isStartTimeAndEndTimeDisabled,
            errors,
            values,
            styles,
            t,
        } = this.props;

        const numberOfPeopleTextInputStyle = isEmpty(values.numberOfPeople)
            ? styles.numberOfPeopleTextInput
            : styles.numberOfPeopleTextInputSelected;
        return (
            <View>
                <View style={styles.formInputComponentContainer}>
                    <FormDatePicker
                        disabled={isDatePickerDisable}
                        onDateChange={this._handleFormChange}
                        format="DD/MM/YYYY"
                        name="date"
                        minimumDate={moment()
                            .subtract(90, 'd')
                            .toDate()}
                        maximumDate={moment().toDate()}
                        value={values.date}
                        error={errors.date}
                    />
                </View>
                <View style={styles.timePickerContainer}>
                    <FormTimePicker
                        disabled={isStartTimeAndEndTimeDisabled}
                        testID="addSittingDetails__startTimePicker"
                        onTimeChange={this._handleFormChange}
                        values={values}
                        value={values.startTime}
                        format="hh:mm A"
                        name={'startTime'}
                        label={t('addOfflineSittingDetails:startTime')}
                    />
                    <FormTimePicker
                        disabled={isStartTimeAndEndTimeDisabled}
                        testID="addSittingDetails__endTimePicker"
                        onTimeChange={this._handleFormChange}
                        values={values}
                        value={values.endTime}
                        format="hh:mm A"
                        name={'endTime'}
                        label={t('addOfflineSittingDetails:endTime')}
                    />
                </View>
                {this._renderTimeValidationError()}
                <View style={styles.formInputComponentContainer}>
                    <FormDurationInput
                        values={values}
                        error={errors.duration}
                    />
                </View>
                <View style={styles.formInputComponentContainer}>
                    <Input
                        testID="addSittingDetails__numberOfPeople"
                        placeholder={t(
                            'addOfflineSittingDetails:numberofPeople',
                        )}
                        value={values.numberOfPeople}
                        onChangeText={this._handleNoOfPeopleChange}
                        keyboardType={'numeric'}
                        style={numberOfPeopleTextInputStyle}
                        itemStyle={styles.numberOfPeopleItemStyle}
                        error={errors.numberOfPeople}
                        errorStyle={styles.validationErrorText}
                    />
                </View>
                {this._renderMultiSelectionDropDown()}
                <View style={styles.formInputComponentContainer}>
                    <Textarea
                        testID="addSittingDetails__comments"
                        placeholder={t('addOfflineSittingDetails:comments')}
                        value={values.comments}
                        onChangeText={this._handleCommentChange}
                        itemStyle={styles.commentBoxItem}
                        style={styles.commentBox}
                        error={errors.comments}
                    />
                </View>
            </View>
        );
    };
    render() {
        const { styles } = this.props;

        return (
            <View style={styles.sessionDetailsFormContainer}>
                {this._renderFormComponents()}
                {this._renderSubmitButton()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(AddOfflineSittingDetailsForm, addOfflineSittingDetailsFormSyles),
);
