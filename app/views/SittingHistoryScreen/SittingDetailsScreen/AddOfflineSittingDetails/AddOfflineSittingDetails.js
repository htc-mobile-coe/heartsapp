import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import { styles as addOfflineSittingDetailsStyle } from './AddOfflineSittingDetails.styles';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { gt } from 'lodash';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { IsIOS } from 'app/shared/Constants';
import AddOfflineSittingDetailsForm from './AddOfflineSittingDetailsForm';
import {
    checkIfTimeIsSameOrBeforeAnotherTime,
    checkIfTimeIsSameOrAfterAnotherTime,
    checkIfDurationIsLessThanOneHour,
} from 'app/utils/date-utils';
import SittingDetailsHeader from '../SittingDetailsHeader';
class AddOfflineSittingDetails extends React.Component {
    _handleSubmitPress = (values, { resetForm }) => {
        const { onSubmit } = this.props;
        onSubmit({ ...values, resetForm });
    };

    _renderHeader = () => {
        const { t, onBackPress, styles, hideBackButton } = this.props;
        return (
            <SittingDetailsHeader
                onBackPress={onBackPress}
                title={t('addOfflineSittingDetails:heading')}
                containerStyle={styles.headerContainer}
                showRightIcon={false}
                hideBackButton={hideBackButton}
            />
        );
    };

    _renderForm = formikProps => {
        const {
            values,
            handleSubmit,
            handleChange,
            setFieldValue,
            errors,
        } = formikProps;

        const {
            onSeekerSelection,
            onRecentSeekerSelected,
            recentSeekersList,
            selectedSeekers,
            isTrackNowSession,
            isDatePickerDisable,
            isStartTimeAndEndTimeDisabled,
            onRemoveSeeker,
            offlineSessionDetails,
            onChangeFormValues,
        } = this.props;

        return (
            <AddOfflineSittingDetailsForm
                isTrackNowSession={isTrackNowSession}
                isDatePickerDisable={isDatePickerDisable}
                isStartTimeAndEndTimeDisabled={isStartTimeAndEndTimeDisabled}
                handleChange={handleChange}
                onSubmit={handleSubmit}
                errors={errors}
                values={values}
                recentSeekersList={recentSeekersList}
                selectedSeekers={selectedSeekers}
                setFieldValue={setFieldValue}
                onSeekerSelection={onSeekerSelection}
                onRecentSeekerSelected={onRecentSeekerSelected}
                onRemoveSeeker={onRemoveSeeker}
                offlineSessionDetails={offlineSessionDetails}
                onChangeFormValues={onChangeFormValues}
            />
        );
    };

    getValidationSchema = () => {
        const { t, shouldValidateStartAndEndTime } = this.props;

        return Yup.object().shape({
            date: Yup.object().required(t('validations:required')),
            startTime: Yup.object()
                .required(t('validations:required'))
                .test(
                    'startTimeValidation',
                    t('addOfflineSittingDetails:timeValidation'),
                    function(value) {
                        const { endTime } = this.parent;
                        return checkIfTimeIsSameOrBeforeAnotherTime(
                            value,
                            endTime,
                        );
                    },
                ),
            endTime: Yup.object()
                .required(t('validations:required'))
                .test(
                    'endTimeValidation',
                    t('addOfflineSittingDetails:timeValidation'),
                    function(value) {
                        const { startTime } = this.parent;
                        return checkIfTimeIsSameOrAfterAnotherTime(
                            value,
                            startTime,
                        );
                    },
                ),
            duration: Yup.string().test(
                'durationValidation',
                t('addOfflineSittingDetails:durationValidation'),
                function() {
                    if (!shouldValidateStartAndEndTime) {
                        return true;
                    }
                    const { startTime, endTime } = this.parent;
                    return checkIfDurationIsLessThanOneHour(startTime, endTime);
                },
            ),
            numberOfPeople: Yup.number()
                .required(t('validations:required'))
                .min(0, t('validations:invalidValue'))
                .max(10, t('validations:invalidValue'))
                .typeError(t('validations:invalidValue'))
                .integer(t('validations:invalidValue'))
                .test(
                    'numberOfPeopleValidation',
                    t('addOfflineSittingDetails:numberOfPeopleValidation'),
                    function(value) {
                        return gt(value, 0);
                    },
                ),

            comments: Yup.string().max(
                2000,
                t('validations:maxAllowedCharacters', { max: 2000 }),
            ),
        });
    };

    _renderFormikForm = () => {
        const { offlineSessionDetails } = this.props;

        return (
            <Formik
                testID="addOfflineSittingDetails__form"
                children={this._renderForm}
                initialValues={offlineSessionDetails}
                onSubmit={this._handleSubmitPress}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={true}
            />
        );
    };
    render() {
        const { styles } = this.props;
        const behavior = IsIOS ? 'padding' : null;
        return (
            <KeyboardAvoidingView
                style={styles.container}
                behavior={behavior}
                keyboardVerticalOffset={0}>
                <ScrollView
                    contentContainerStyle={styles.contentContainer}
                    keyboardShouldPersistTaps="handled">
                    {this._renderHeader()}
                    <View style={styles.bodyContainer}>
                        {this._renderFormikForm()}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

export default withTranslation()(
    withTheme(AddOfflineSittingDetails, addOfflineSittingDetailsStyle),
);
