import React, { Fragment } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as forgotPasswordScreenStyle } from './ForgotPasswordScreen.styles';
import { isNil, trim } from 'lodash';
import ScreenContainer from '../shared/ScreenContainer';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { MediumBoldText, Input, Text, Button } from '../shared';
import Modal from 'react-native-modal';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class ForgotPasswordScreen extends React.Component {
    _handleSubmitPress = (values, { resetForm }) => {
        const { onSubmit } = this.props;

        if (onSubmit) {
            onSubmit({ ...values, resetForm, email: trim(values.email) });
        }
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        this.handleReset();

        if (onBackPress) {
            onBackPress();
        }
    };

    _handleGoToLoginScreenPress = () => {
        const { onGoToLoginScreenPress } = this.props;
        this.handleReset();

        if (onGoToLoginScreenPress) {
            onGoToLoginScreenPress();
        }
    };

    _renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isNil(errorMessage)) {
            return (
                <Text
                    testID="forgotPasswordScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };

    _renderSuccessModal = () => {
        const { showSuccessMessage, t, styles } = this.props;

        return (
            <Modal isVisible={showSuccessMessage}>
                <View style={styles.modalContainerStyle}>
                    <MediumBoldText style={styles.modalHeading} testID="forgotPasswordScreen__successModalHeading--text">
                        {t('forgotPasswordScreen:successModalHeading')}
                    </MediumBoldText>
                    <Text style={styles.modalMessage} testID="forgotPasswordScreen__successModalMessage--text">
                        {t(
                            'forgotPasswordScreen:sentResetPasswordEmailMessage',
                        )}
                    </Text>
                    <View style={styles.modalButtonContainer}>
                        <Button
                            rounded={true}
                            style={styles.loginButton}
                            text={t('forgotPasswordScreen:ok')}
                            onPress={this._handleGoToLoginScreenPress}
                            testID="forgotPasswordScreen__successModalOk--button"
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    _renderForm = formikProps => {
        const {
            values,
            handleChange,
            handleSubmit,
            errors,
            handleReset,
        } = formikProps;
        this.handleReset = handleReset;
        const { t, styles } = this.props;

        return (
            <View style={styles.emailLoginContainer}>
                <Fragment>
                    <Input
                        placeholder={t('forgotPasswordScreen:email')}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        itemStyle={styles.inputItem}
                        error={errors.email}
                    />
                    <Button
                        rounded={true}
                        style={styles.loginButton}
                        onPress={handleSubmit}
                        text={t('forgotPasswordScreen:send')}
                        testID="forgotPasswordScreen__submit--button"
                    />
                </Fragment>
            </View>
        );
    };

    getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            email: Yup.string()
                .transform(value => trim(value))
                .email(t('validations:invalidEmail'))
                .required(t('validations:required')),
        });
    };

    _renderFormikForm = () => {
        return (
            <Formik
                testID="forgotPasswordScreen__form--formik"
                children={this._renderForm}
                initialValues={{
                    email: '',
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
            />
        );
    };

    render() {
        const { t, styles } = this.props;
        return (
            <ScreenContainer noBackground={true}>
                <OptionsScreenHeader
                    title={t('forgotPasswordScreen:heading')}
                    onBackPress={this._handleBackPress}
                    style={styles.header}
                    headerTextStyle={styles.headerText}
                />
                <View style={styles.bodyContainer}>
                    {this._renderSuccessModal()}
                    {this._renderErrorMessage()}
                    {this._renderFormikForm()}
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(ForgotPasswordScreen, forgotPasswordScreenStyle),
);
