import React from 'react';
import { View, Stack } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as personalStyle } from './PersonalInfoScreen.styles';
import { get, isEmpty, isEqual, isNull } from 'lodash';
import { Button, Text, MediumBoldText, Input } from '../../shared';
import CityPicker, { CityPickerType } from '../../shared/CityPicker';
import { withTheme } from '../../../styles/theme/WithThemeHOC';

class PersonalInfoForm extends React.Component {
    _renderSubmitButton = handleSubmit => {
        const { t, styles } = this.props;

        return (
            <Button
                rounded={true}
                style={styles.updateButton}
                onPress={handleSubmit}
                text={t('personalInfoScreen:update')}
                testID="personalInfoScreen__update--button"
            />
        );
    };

    renderErrorMessage = () => {
        const { errorMessage, styles } = this.props;

        if (!isEmpty(errorMessage)) {
            return (
                <Text
                    testID="personalInfoScreen__errorMessage--text"
                    style={styles.validationErrorText}>
                    {errorMessage}
                </Text>
            );
        }

        return null;
    };
    _getEmailText = () => {
        const { userProfile } = this.props;
        const email = get(userProfile, 'email');
        if (isEqual(email, 'null') || isNull(email)) {
            return null;
        } else {
            return <MediumBoldText>{email}</MediumBoldText>;
        }
    };

    render() {
        const {
            t,
            values,
            handleChange,
            handleSubmit,
            errors,
            styles,
        } = this.props;
        return (
            <View>
                <View style={styles.whiteContainer}>
                    {this.renderErrorMessage()}
                    {this._getEmailText()}
                    <Stack space={styles.stackSpace} style={styles.stackContainer}>
                        <Input
                            placeholder={t('personalInfoScreen:firstName')}
                            value={values.firstName}
                            onChangeText={handleChange('firstName')}
                            itemStyle={styles.inputBorder}
                            error={errors.firstName}
                            errorStyle={styles.errorStyle}
                        />
                        <Input
                            placeholder={t('personalInfoScreen:lastName')}
                            value={values.lastName}
                            onChangeText={handleChange('lastName')}
                            itemStyle={styles.inputBorder}
                            errorStyle={styles.errorStyle}
                        />
                        <Input
                            placeholder={t('personalInfoScreen:addressLine1')}
                            value={values.addressLine1}
                            onChangeText={handleChange('addressLine1')}
                            itemStyle={styles.inputBorder}
                            error={errors.addressLine1}
                            errorStyle={styles.errorStyle}
                        />
                        <Input
                            placeholder={t('personalInfoScreen:addressLine2')}
                            value={values.addressLine2}
                            onChangeText={handleChange('addressLine2')}
                            itemStyle={styles.inputBorder}
                            errorStyle={styles.errorStyle}
                        />
                        <CityPicker
                            type={CityPickerType.GOOGLE_PLACES}
                            id="city"
                            placeholder={t('personalInfoScreen:selectCityTown')}
                            error={errors.city}
                            value={values.city}
                        />
                        <Input
                            placeholder={t('personalInfoScreen:postalCode')}
                            value={values.postalCode}
                            onChangeText={handleChange('postalCode')}
                            itemStyle={styles.inputBorder}
                            error={errors.postalCode}
                            errorStyle={styles.errorStyle}
                        />
                        <Input
                            placeholder={t('personalInfoScreen:phoneNumber')}
                            value={values.phoneNumber}
                            onChangeText={handleChange('phoneNumber')}
                            itemStyle={styles.inputBorder}
                            error={errors.phoneNumber}
                            errorStyle={styles.errorStyle}
                        />
                        <Text style={styles.phoneHintText} testID="personalInfoScreen__phoneNumberHint--text">
                            {t('validations:phoneNumberHint')}
                        </Text>
                    </Stack>
                </View>
                {this._renderSubmitButton(handleSubmit)}
            </View>
        );
    }
}

export default withTranslation()(withTheme(PersonalInfoForm, personalStyle));
