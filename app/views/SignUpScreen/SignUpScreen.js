import React, { Fragment } from 'react';
import { View, Stack } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as signUpScreenStyle } from './SignUpScreen.styles';
import { KeyboardAvoidingView } from 'react-native';
import { isNil, trim } from 'lodash';
import {
    date as dateValidation,
    dateWithoutDay,
    match,
    phoneRegExp,
} from '../../shared/Validations';
import ScreenContainer from '../shared/ScreenContainer';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { PasswordInput, Input, Text, Button } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { IsIOS } from '../../shared/Constants';
import SignUpSuccessPopup from './SignUpSuccessPopup';

class SignUpScreen extends React.Component {
    _handleSubmitPress = (values, { resetForm }) => {
        const { onSubmit } = this.props;
        onSubmit({ ...values, resetForm, email: trim(values.email) });
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        this.handleReset();
        onBackPress();
    };

    _handleGoToLoginScreenPress = () => {
        const { onGoToLoginScreenPress } = this.props;
        this.handleReset();
        onGoToLoginScreenPress();
    };

    _renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isNil(errorMessage)) {
            return (
                <Text
                    testID="signUpScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };

    _renderSuccessModal = () => {
        const { showSuccessMessage } = this.props;
        return (
            <SignUpSuccessPopup
                show={showSuccessMessage}
                onLoginPress={this._handleGoToLoginScreenPress}
                onBackPress={this._handleBackPress}
            />
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
                <Stack space={styles.stackSpace}>
                    <Input
                        placeholder={t('signUpScreen:name')}
                        value={values.name}
                        onChangeText={handleChange('name')}
                        error={errors.name}
                    />
                    <Input
                        placeholder={t('signUpScreen:email')}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        error={errors.email}
                    />
                    <Input
                        placeholder={t('signUpScreen:mobileNo')}
                        value={values.mobileNo}
                        onChangeText={handleChange('mobileNo')}
                        error={errors.mobileNo}
                    />
                    <PasswordInput
                        placeholder={t('signUpScreen:password')}
                        value={values.password}
                        onChangeText={handleChange('password')}
                        error={errors.password}
                    />
                    <PasswordInput
                        placeholder={t('signUpScreen:rePassword')}
                        value={values.rePassword}
                        onChangeText={handleChange('rePassword')}
                        itemStyle={styles.inputItem}
                        error={errors.rePassword}
                    />
                    <Input
                        placeholder={t('signUpScreen:scrmId')}
                        value={values.scrmId}
                        onChangeText={handleChange('scrmId')}
                        error={errors.scrmId}
                    />
                    <Input
                        placeholder={t('signUpScreen:dob')}
                        value={values.dob}
                        onChangeText={handleChange('dob')}
                        error={errors.dob}
                    />
                    <Input
                        placeholder={t('signUpScreen:doj')}
                        value={values.doj}
                        onChangeText={handleChange('doj')}
                        error={errors.doj}
                    />

                    <Button
                        rounded={true}
                        style={styles.loginButton}
                        onPress={handleSubmit}
                        text={t('signUpScreen:submit')}
                        testID="signUpScreen__submit--button"
                    />
                    </Stack>
                </Fragment>
            </View>
        );
    };

    getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            name: Yup.string().required(t('validations:required')),
            email: Yup.string()
                .transform(value => trim(value))
                .email(t('validations:invalidEmail'))
                .required(t('validations:required')),
            dob: Yup.string().test(
                'dobValidation',
                t('signUpScreen:dobValidationMsg'),
                dateValidation,
            ),
            doj: Yup.string().test(
                'dojValidation',
                t('signUpScreen:dojValidationMsg'),
                dateWithoutDay,
            ),
            mobileNo: Yup.string().matches(
                phoneRegExp,
                t('validations:invalidMobileNo'),
            ),
            password: Yup.string()
                .required(t('validations:required'))
                .test(
                    'passwordValidation',
                    t('signUpScreen:passwordsDidNotMatch'),
                    function(value) {
                        const { rePassword } = this.parent;
                        return match(value, rePassword);
                    },
                ),
            rePassword: Yup.string()
                .required(t('validations:required'))
                .test(
                    'rePasswordValidation',
                    t('signUpScreen:passwordsDidNotMatch'),
                    function(value) {
                        const { password } = this.parent;
                        return match(value, password);
                    },
                ),
        });
    };

    _renderFormikForm = () => {
        return (
            <Formik
                children={this._renderForm}
                initialValues={{
                    name: '',
                    scrmid: '',
                    dob: '',
                    doj: '',
                    email: '',
                    mobileNo: '',
                    password: '',
                    rePassword: '',
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                testID = 'signUpScreen__form'
            />
        );
    };

    render() {
        const { t, styles } = this.props;
        const keyboardVerticalOffset = IsIOS ? 70 : null;
        const behavior = IsIOS ? 'padding' : null;
        return (
            <ScreenContainer noBackground={true} enableScroll={true}>
                <KeyboardAvoidingView
                    behavior={behavior}
                    keyboardVerticalOffset={keyboardVerticalOffset}>
                    <OptionsScreenHeader
                        title={t('signUpScreen:heading')}
                        onBackPress={this._handleBackPress}
                        style={styles.header}
                        headerTextStyle={styles.headerText}
                        testID="signUpScreen__header"
                    />
                    <Text style={styles.subTitle}>
                        {t('signUpScreen:subHeading')}
                    </Text>
                    <View style={styles.bodyContainer}>
                        {this._renderSuccessModal()}
                        {this._renderErrorMessage()}
                        {this._renderFormikForm()}
                    </View>
                </KeyboardAvoidingView>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(withTheme(SignUpScreen, signUpScreenStyle));
