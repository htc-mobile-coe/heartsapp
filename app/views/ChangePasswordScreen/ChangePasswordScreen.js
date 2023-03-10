import React, { Component, Fragment } from 'react';
import { View, Modal } from 'react-native';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import { Text } from '../shared';
import { styles as changePasswordStyle } from './ChangePasswordScreen.styles';
import SuccessPopup from '../shared/SuccessPopup/SuccessPopup';
import { Formik } from 'formik';
import { isNil } from 'lodash';
import * as Yup from 'yup';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import ChangePasswordForm from './ChangePasswordForm';

class ChangePasswordScreen extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _handleSubmitPress = (values, { resetForm }) => {
        const { onSubmit } = this.props;
        onSubmit({ ...values, resetForm });
    };

    _getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            currentPassword: Yup.string().required(t('validations:required')),
            newPassword: Yup.string().required(t('validations:required')),
        });
    };

    _renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isNil(errorMessage)) {
            return (
                <Text
                    testID="changePasswordScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };

    _renderForm = formikProps => {
        const { values, handleChange, handleSubmit, errors } = formikProps;
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                <Fragment>
                    <ChangePasswordForm
                        {...this.props}
                        values={values}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        errors={errors}
                    />
                </Fragment>
            </View>
        );
    };

    _renderFormikForm = () => {
        return (
            <Formik
                children={this._renderForm}
                initialValues={{
                    currentPassword: '',
                    newPassword: '',
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this._getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                testID="changePasswordScreen__form"
            />
        );
    };

    render = () => {
        const { t, showSuccessMessage, styles } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <OptionsScreenHeader
                    style={styles.header}
                    title={t('changePasswordScreen:title')}
                    onBackPress={this._handleBackPress}
                />
                {this._renderErrorMessage()}
                {this._renderFormikForm()}
                <Modal
                    animationType="slide"
                    transparent
                    visible={showSuccessMessage}>
                    <SuccessPopup
                        successMessage={t(
                            'changePasswordScreen:successMessage',
                        )}
                    />
                </Modal>
            </ScreenContainer>
        );
    };
}

export default withTranslation()(
    withTheme(ChangePasswordScreen, changePasswordStyle),
);
