import React, { Fragment } from 'react';
import { View, Stack } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as helpDeskStyle } from './HelpDeskScreen.styles';
import { Linking } from 'react-native';
import {
    phoneRegExp,
    nameRegExp,
    commentSpecialCharactersRegExp,
} from '../../shared/Validations';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { get, isNil, trim } from 'lodash';
import ScreenContainer from '../shared/ScreenContainer';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { MediumBoldText, Textarea, Input, Text, Button } from '../shared';
import ContactInfoIcon from './ContactInfoIcon';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import helpDeskImages from './img';
import CheckBox from './CheckBox';

class HelpDeskScreen extends React.Component {
    _handleSubmitPress = (values, { resetForm }) => {
        const { onSubmit } = this.props;
        onSubmit({ ...values, resetForm, email: trim(values.email) });
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        this.handleReset();
        onBackPress();
    };

    _renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isNil(errorMessage)) {
            return (
                <Text
                    testID="helpDeskScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
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
        const { t, styles, theme } = this.props;

        return (
            <View style={styles.emailLoginContainer}>
                <Fragment>
                    <Stack space={styles.stackSpace}>
                        <Input
                            placeholder={t('helpDeskScreen:name')}
                            value={values.name}
                            onChangeText={handleChange('name')}
                            error={errors.name}
                        />

                        <Input
                            placeholder={t('helpDeskScreen:email')}
                            value={values.email}
                            onChangeText={handleChange('email')}
                            error={errors.email}
                        />
                        <Input
                            placeholder={t('helpDeskScreen:mobileNo')}
                            value={values.mobileNo}
                            onChangeText={handleChange('mobileNo')}
                            error={errors.mobileNo}
                        />
                        <Textarea
                            placeholder={t('helpDeskScreen:issue')}
                            value={values.issue}
                            onChangeText={handleChange('issue')}
                            style={styles.textArea}
                            error={errors.issue}
                        />
                    </Stack>
                    <View style={styles.diagnosticLogContainer}>
                        <CheckBox
                            testID="helpDeskScreen__diagnostic__checkbox"
                            name={'sendDiagnosticLog'}
                            style={styles.diagnosticCheckbox}
                            color={theme.brandPrimary}
                        />
                        <MediumBoldText style={styles.diagnosticLogTitle}>
                            {t('helpDeskScreen:sendDiagnosticLog')}
                        </MediumBoldText>
                    </View>
                    <Button
                        testID="helpDeskScreen__submit--button"
                        rounded={true}
                        style={styles.submitButton}
                        onPress={handleSubmit}
                        text={t('helpDeskScreen:submit')}
                    />
                </Fragment>
            </View>
        );
    };

    getValidationSchema = () => {
        const { t } = this.props;
        return Yup.object().shape({
            name: Yup.string()
                .required(t('validations:required'))
                .matches(nameRegExp, t('validations:invalidValue')),
            email: Yup.string()
                .transform(value => trim(value))
                .email(t('validations:invalidEmail'))
                .required(t('validations:required')),
            mobileNo: Yup.string().matches(
                phoneRegExp,
                t('validations:invalidMobileNo'),
            ),
            issue: Yup.string()
                .required(t('validations:required'))
                .max(5000, t('validations:maxAllowedCharacters', { max: 5000 }))
                .matches(
                    commentSpecialCharactersRegExp,
                    t('validations:invalidCharacters'),
                ),
            sendDiagnosticLog: Yup.boolean(),
        });
    };

    _renderFormikForm = 
    () => {
        const { fullName, userProfile } = this.props;

        return (
            <Formik
                testID="helpDeskScreen__form"
                children={this._renderForm}
                initialValues={{
                    name: fullName,
                    email: get(userProfile, 'email'),
                    mobileNo: get(userProfile, 'phone'),
                    issue: '',
                    sendDiagnosticLog: true,
                }}
                onSubmit={this._handleSubmitPress}
                validationSchema={this.getValidationSchema()}
                validateOnBlur={false}
                validateOnChange={false}
            />
        );
    };

    _handleCallTollFreePress = () => {
        const { contactInfoTollFreeNo } = this.props;
        Linking.openURL(`tel:${contactInfoTollFreeNo}`);
    };

    _handleSendEmailPress = () => {
        const { contactInfoEmail } = this.props;
        Linking.openURL(`mailto:${contactInfoEmail}`);
    };

    _renderContactInfo = () => {
        const { t, styles, images, onWhatsappPress } = this.props;

        return (
            <View style={styles.contactInfoContainer}>
                <View style={styles.contactInfoHeading}>
                    <MediumBoldText style={styles.reachUsText}>
                        {t('helpDeskScreen:reachUsAt')}
                    </MediumBoldText>
                    <Text testID="helpDeskScreen__availableTiming--text">{t('helpDeskScreen:availableTiming')}</Text>
                </View>

                <View style={styles.contactInfoIcons}>
                    <ContactInfoIcon
                        title={t('helpDeskScreen:supportTollFree')}
                        image={images.support}
                        onPress={this._handleCallTollFreePress}
                        testID="helpDeskScreen__contactInfoIcon--tollFree"
                    />
                    <ContactInfoIcon
                        title={t('helpDeskScreen:supportWhatsapp')}
                        image={images.whatsapp}
                        onPress={onWhatsappPress}
                    />
                    <ContactInfoIcon
                        title={t('helpDeskScreen:supportEmail')}
                        image={images.email}
                        onPress={this._handleSendEmailPress}
                        testID="helpDeskScreen__contactInfoIcon--email"
                    />
                </View>
            </View>
        );
    };

    render() {
        const { t, appVersion, styles } = this.props;
        return (
            <ScreenContainer noBackground={true}>
                <OptionsScreenHeader
                    title={t('helpDeskScreen:heading')}
                    onBackPress={this._handleBackPress}
                    style={styles.header}
                    headerTextStyle={styles.headerText}
                />
                <View style={styles.subHeadingContainer}>
                    <Text style={styles.subTitle} testID="helpDeskScreen__subHeading--text">
                        {t('helpDeskScreen:subHeading')}
                    </Text>
                </View>
                <View style={styles.bodyContainer}>
                    {this._renderErrorMessage()}
                    {this._renderFormikForm()}
                    {this._renderContactInfo()}
                    <Text style={styles.appVersionText} testID="helpDeskScreen__appVersion--text">
                        {'Heartsapp - '}
                        {appVersion}
                    </Text>
                </View>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(HelpDeskScreen, helpDeskStyle, helpDeskImages),
);
