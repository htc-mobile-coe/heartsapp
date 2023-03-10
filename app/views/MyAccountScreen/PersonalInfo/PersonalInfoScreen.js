import React, { Fragment } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as personalStyle } from './PersonalInfoScreen.styles';
import ScreenContainer from '../../shared/ScreenContainer';
import OptionsScreenHeader from '../../shared/OptionsScreenHeader';
import { Modal } from 'react-native';
import { get } from 'lodash';
import { Formik } from 'formik';
import * as Yup from 'yup';
import {
    internationalPhoneRegExp,
    specialCharactersRegExp,
} from '../../../shared/Validations';
import { ScrollView, KeyboardAvoidingView } from 'react-native';
import SuccessPopup from '../../shared/SuccessPopup/SuccessPopup';
import { IsIOS } from '../../../shared/Constants';
import PersonalInfoForm from './PersonalInfoForm';
import { withTheme } from '../../../styles/theme/WithThemeHOC';

class PersonalInfoScreen extends React.Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    _handleSubmitPress = (values, { resetForm }) => {
        const { onUpdatePress } = this.props;
        onUpdatePress(values);
    };

    _renderForm = formikProps => {
        const { values, handleChange, handleSubmit, errors } = formikProps;

        return (
            <View>
                <Fragment>
                    <PersonalInfoForm
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
            city: Yup.object().required(t('validations:required')),
            postalCode: Yup.string()
                .matches(specialCharactersRegExp, t('validations:invalidValue'))
                .required(t('validations:required')),
            phoneNumber: Yup.string()
                .matches(
                    internationalPhoneRegExp,
                    t('validations:invalidMobileNo'),
                )
                .required(t('validations:required')),
        });
    };

    _renderFormikForm = () => {
        const { userProfile } = this.props;
        const description = get(userProfile, 'city');
        const place_id = get(userProfile, 'cityPlaceId');
        const countryName = get(userProfile, 'countryName');

        return (
            <Formik
                children={this._renderForm}
                initialValues={{
                    firstName: get(userProfile, 'firstName'),
                    lastName: get(userProfile, 'lastName'),
                    addressLine1: get(userProfile, 'addressLine1'),
                    addressLine2: get(userProfile, 'addressLine2'),
                    city: {
                        description,
                        place_id,
                        terms: [{ value: countryName }],
                    },
                    postalCode: get(userProfile, 'postalCode'),
                    phoneNumber: get(userProfile, 'phone'),
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this._getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
                enableReinitialize
            />
        );
    };

    _renderSuccessModal = () => {
        const { t } = this.props;
        return (
            <SuccessPopup
                successMessage={t('personalInfoScreen:successMessage')}
            />
        );
    };

    render() {
        const { t, showSuccessModal, styles } = this.props;
        const keyboardVerticalOffset = IsIOS ? 70 : null;
        const behavior = IsIOS ? 'padding' : null;
        return (
            <ScreenContainer enableScroll={false}>
                <KeyboardAvoidingView
                    behavior={behavior}
                    keyboardVerticalOffset={keyboardVerticalOffset}>
                    <ScrollView keyboardShouldPersistTaps="handled">
                        <OptionsScreenHeader
                            title={t('personalInfoScreen:heading')}
                            onBackPress={this._handleBackPress}
                        />

                        <View style={styles.bodyContainer}>
                            {this._renderFormikForm()}
                        </View>

                        <Modal
                            animationType="slide"
                            transparent
                            visible={showSuccessModal}>
                            {this._renderSuccessModal()}
                        </Modal>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(withTheme(PersonalInfoScreen, personalStyle));
