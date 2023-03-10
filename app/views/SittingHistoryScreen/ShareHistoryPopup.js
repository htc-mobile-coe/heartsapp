import React, { Component } from 'react';
import { styles as shareHistoryPoupStyles } from './ShareHistoryPopup.styles';
import EmailForm from './EmailForm';
import { View } from 'native-base';
import { Button, Text, MediumBoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { trim } from 'lodash';
import shareHistoryPoupStylesImages from './img';
import { KeyboardAvoidingView, ScrollView } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';
class ShareHistoryPoup extends Component {
    _handleSubmitPress = (values, { resetForm }) => {
        const { onSubmit } = this.props;

        onSubmit({ ...values, resetForm, email: trim(values.email) });
    };

    _renderHeader = () => {
        const { t, styles, onSharePreceptorHistorySkipPress } = this.props;

        return (
            <View style={styles.headerStyle}>
                <Button
                    transparent={true}
                    style={styles.skipButtonStyle}
                    textStyle={styles.skipButtonText}
                    onPress={onSharePreceptorHistorySkipPress}
                    text={t('sharePreceptorHistoryPopup:skip')}
                    testID="shareHistoryPoup__skip--button"
                />

                <MediumBoldText style={styles.heading} testID="shareHistoryPoup__header--text">
                    {t('sharePreceptorHistoryPopup:title')}
                </MediumBoldText>
            </View>
        );
    };

    _renderNoInternetText = () => {
        const { t, isApplicationServerReachable, styles } = this.props;

        if (!isApplicationServerReachable) {
            return (
                <Text style={styles.noInternetText}>
                    {t('offlineNotice:noInternetConnection')}
                </Text>
            );
        }
        return null;
    };
    _renderForm = formikProps => {
        const { showShareHisoryLoader } = this.props;
        const { values, handleChange, handleSubmit, errors } = formikProps;

        return (
            <EmailForm
                email={values.email}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                errors={errors}
                showShareHisoryLoader={showShareHisoryLoader}
            />
        );
    };

    getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            email: Yup.string()
                .email(t('validations:invalidEmail'))
                .required(t('validations:required')),
        });
    };

    _renderFormik = () => {
        const { userEmail, styles } = this.props;

        return (
            <View style={styles.formikContainer}>
                <Formik
                    children={this._renderForm}
                    initialValues={{
                        email: userEmail,
                    }}
                    onSubmit={this._handleSubmitPress}
                    validationSchema={this.getValidationSchema()}
                    validateOnBlur={false}
                    validateOnChange={false}
                />
            </View>
        );
    };
    _renderSucessMessage = () => {
        const {
            styles,
            t,
            onSharePreceptorHistorySkipPress,
            choosenEmail,
        } = this.props;
        return (
            <View style={styles.successMessageContainer}>
                <MediumBoldText style={styles.successMessageTitle} testID="shareHistoryPoup__successMessage--text">
                    {t('sharePreceptorHistoryPopup:emailSentSuccessfully')}
                </MediumBoldText>
                <Text style={styles.successMessageText}>
                    {t('sharePreceptorHistoryPopup:sessionHistoryhasSent', {
                        choosenEmail,
                    })}
                </Text>
                <Button
                    rounded={true}
                    style={styles.submitButton}
                    onPress={onSharePreceptorHistorySkipPress}
                    text={t('sharePreceptorHistoryPopup:ok')}
                    testID="shareHistoryPoup__ok--button"
                />
            </View>
        );
    };
    _renderContainer = () => {
        const { showSuccessMessage } = this.props;
        if (showSuccessMessage) {
            return <View>{this._renderSucessMessage()}</View>;
        }
        return (
            <View>
                {this._renderHeader()}
                {this._renderFormik()}
            </View>
        );
    };

    render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                <KeyboardAvoidingView
                    behavior="height"
                    keyboardVerticalOffset={0}>
                    <ScrollView keyboardShouldPersistTaps={'handled'}>
                        {this._renderContainer()}
                        {this._renderNoInternetText()}
                    </ScrollView>
                </KeyboardAvoidingView>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        ShareHistoryPoup,
        shareHistoryPoupStyles,
        shareHistoryPoupStylesImages,
    ),
);
