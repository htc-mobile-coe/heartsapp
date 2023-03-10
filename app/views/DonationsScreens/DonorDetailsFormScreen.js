import React, { Component, Fragment } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import {
    ScrollView,
    KeyboardAvoidingView,
    TouchableOpacity,
} from 'react-native';
import { styles as DonorDetailsFormStyles } from './DonorDetailsFormScreen.styles';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import ScreenContainer from '../shared/ScreenContainer';
import { Text, MediumBoldText, Button } from '../shared';
import { trim, get, isUndefined, isEqual, isEmpty } from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    specialCharactersRegExp,
    internationalPhoneRegExp,
} from '../../shared/Validations';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { IsIOS } from '../../shared/Constants';
import DonationForm from './DonationForm';
import Modal from 'react-native-modal';
import { Exclamation } from '../shared/Icon';

class DonorDetailsFormScreen extends Component {
    _handleSubmitPress = (values, { resetForm }) => {
        const { onConfirmDonationPress } = this.props;
        onConfirmDonationPress({
            ...values,
            resetForm,
            email: trim(values.email),
        });
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _getCountryNameText = () => {
        const { userProfile } = this.props;
        const country = get(userProfile, 'countryName');
        if (isEmpty(country)) {
            return undefined;
        }
        return country;
    };

    _getEmailValue = () => {
        const { userProfile } = this.props;
        const email = get(userProfile, 'email');
        if (!isEqual(email, '') || !isUndefined(email)) {
            if (!isEqual(email, 'null')) {
                return email;
            }
        }
    };

    _handleDonationURLPress = () => {
        const { onDonationURLPress } = this.props;
        onDonationURLPress();
    };

    _handleCloseButtonPress = () => {
        const { foreignCurrencyRestrictionPopupCloseButtonPress } = this.props;
        foreignCurrencyRestrictionPopupCloseButtonPress(false);
    };

    renderForeignCurrencyRestrictionPopup = () => {
        const {
            showForeignCurrencyRestrictionPopup,
            donationURL,
            styles,
            t,
        } = this.props;

        if (showForeignCurrencyRestrictionPopup) {
            return (
                <Modal isVisible={true}>
                    <View style={styles.popupView}>
                        <View style={styles.redIconCircle}>
                            <Exclamation style={styles.redIcon} />
                        </View>
                        <MediumBoldText style={styles.popupHeadingText}>
                            {t('donationFormScreen:weAreSorry')}
                        </MediumBoldText>
                        <Text style={styles.popupContentText} testID="DonorDetailsFormScreen__ForeignCurrencyRestrictionPopup_currentlyWeAreUnableToCollectDonations--Text" >
                            {t(
                                'donationFormScreen:currentlyWeAreUnableToCollectDonations',
                            )}
                        </Text>
                        <Text testID="DonorDetailsFormScreen__ForeignCurrencyRestrictionPopup_useBelowLinkToDonate--Text"
                        >
                            {t('donationFormScreen:useBelowLinkToDonate')}
                        </Text>
                        <TouchableOpacity
                            onPress={this._handleDonationURLPress}
                            testID="DonationForm__ForeignCurrencyRestrictionPopup_donationURL--TouchableOpacity">
                            <Text style={styles.popupDonationURLText} testID="DonorDetailsFormScreen__ForeignCurrencyRestrictionPopup_donationURL--Text">
                                {donationURL}
                            </Text>
                        </TouchableOpacity>
                        <Button
                            rounded={true}
                            style={styles.popupCloseButton}
                            onPress={this._handleCloseButtonPress}
                            text={t('donationFormScreen:close')}
                            testID="DonationForm__ForeignCurrencyRestrictionPopup_close--button"
                        />
                    </View>
                </Modal>
            );
        }

        return null;
    };

    _renderForm = formikProps => {
        const { styles } = this.props;
        const { values, handleChange, handleSubmit, errors } = formikProps;

        return (
            <View style={styles.donateFormContainer}>
                <Fragment>
                    <DonationForm
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
    _getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            firstName: Yup.string()
                .required(t('validations:required'))
                .max(255, t('validations:maxAllowedCharacters', { max: 255 })),
            lastName: Yup.string().max(
                255,
                t('validations:maxAllowedCharacters', { max: 255 }),
            ),
            addressLine1: Yup.string()
                .required(t('validations:required'))
                .max(750, t('validations:maxAllowedCharacters', { max: 750 })),
            addressLine2: Yup.string().max(
                255,
                t('validations:maxAllowedCharacters', { max: 255 }),
            ),
            phoneNumber: Yup.string()
                .matches(
                    internationalPhoneRegExp,
                    t('validations:invalidMobileNo'),
                )
                .required(t('validations:required')),
            email: Yup.string()
                .transform(value => trim(value))
                .email(t('validations:invalidEmail'))
                .required(t('validations:required'))
                .max(750, t('validations:maxAllowedCharacters', { max: 750 })),
            country: Yup.object()
                .transform((value, originalValue) => {
                    if (
                        isUndefined(value) ||
                        isEqual(value, '') ||
                        isEqual(originalValue, 'Country')
                    ) {
                        return undefined;
                    }
                    if (isEqual(originalValue, { title: undefined })) {
                        return undefined;
                    }
                    return value;
                })
                .required(t('validations:required')),
            city: Yup.string()
                .required(t('validations:required'))
                .max(255, t('validations:maxAllowedCharacters', { max: 255 })),
            postalCode: Yup.string()
                .matches(specialCharactersRegExp, t('validations:invalidValue'))
                .required(t('validations:required')),
            panNumber: Yup.string().matches(
                specialCharactersRegExp,
                t('validations:invalidValue'),
            ),
            convertedDonationAmount: Yup.string().required(
                t('validations:required'),
            ),
        });
    };
    _renderFormikForm = () => {
        const {
            selectedCurrency,
            donationAmount,
            userProfile,
            convertedDonationAmount,
            stateName,
        } = this.props;
        return (
            <Formik
                children={this._renderForm}
                initialValues={{
                    firstName: get(userProfile, 'firstName'),
                    lastName: get(userProfile, 'lastName'),
                    addressLine1: get(userProfile, 'addressLine1'),
                    addressLine2: get(userProfile, 'addressLine2'),
                    country: { title: this._getCountryNameText() },
                    state: stateName,
                    city: '',
                    postalCode: get(userProfile, 'postalCode'),
                    email: this._getEmailValue(),
                    phoneNumber: get(userProfile, 'phone'),
                    panNumber: '',
                    currency: selectedCurrency,
                    amount: donationAmount,
                    convertedDonationAmount: convertedDonationAmount,
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this._getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize
                testID="DonorDetailsFormScreen--formik"
            />
        );
    };

    renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isEmpty(errorMessage)) {
            return (
                <Text
                    testID="DonationFormScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };

    render() {
        const { t } = this.props;
        const keyboardVerticalOffset = IsIOS ? 70 : null;
        const behavior = IsIOS ? 'padding' : null;
        return (
            <ScreenContainer noBackground={true} enableScroll={false}>
                <KeyboardAvoidingView
                    behavior={behavior}
                    keyboardVerticalOffset={keyboardVerticalOffset}>
                    <ScrollView>
                        <OptionsScreenHeader
                            title={t('donationFormScreen:heading')}
                            onBackPress={this._handleBackPress}
                        />
                        {this.renderForeignCurrencyRestrictionPopup()}
                        {this.renderErrorMessage()}
                        <View>{this._renderFormikForm()}</View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(DonorDetailsFormScreen, DonorDetailsFormStyles),
);
