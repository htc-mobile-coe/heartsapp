import React, { Component, Fragment } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles as signInScreenStyle } from './SignInScreen.styles';
import { View, Stack } from 'native-base';
import { withTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { trim } from 'lodash';
import { Button, MediumBoldText, Input, PasswordInput } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';

export class EmailLoginForm extends Component {
    _handleLoginPress = (values, { resetForm }) => {
        const { onLoginPress } = this.props;
        onLoginPress({ ...values, resetForm, email: trim(values.email) });
    };

    _handleForgotPasswordPress = () => {
        const { onForgotPasswordPress } = this.props;
        onForgotPasswordPress();
    };

    renderForm = ({ values, handleChange, handleSubmit, errors }) => {
        const { t, styles } = this.props;
        return (
            <View style={styles.emailLoginContainer}>
                <Fragment>
                    <Stack space={styles.stackSpace}>
                        <Input
                            placeholder={t('signInScreen:email')}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            error={errors.email}
                        />
                        <PasswordInput
                            placeholder={t('signInScreen:password')}
                            value={values.password}
                            onChangeText={handleChange('password')}
                            error={errors.password}
                        />
                    </Stack>
                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity
                            onPress={this._handleForgotPasswordPress}>
                            <MediumBoldText style={styles.forgotPasswordText}>
                                {t('signInScreen:forgotPassword')}
                            </MediumBoldText>
                        </TouchableOpacity>
                    </View>
                    <Button
                        rounded={true}
                        style={styles.loginButton}
                        onPress={handleSubmit}
                        text={t('signInScreen:login')}
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
            password: Yup.string().required(t('validations:required')),
        });
    };

    render() {
        return (
            <Formik
                children={formikProps => this.renderForm(formikProps)}
                initialValues={{ login: '', password: '' }}
                onSubmit={this._handleLoginPress}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                testID="emailLoginForm__form"
            />
        );
    }
}

export default withTranslation()(withTheme(EmailLoginForm, signInScreenStyle));
