import React, { Component } from 'react';
import { View, Stack } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as DonorDetailsFormStyles } from './DonorDetailsFormScreen.styles';
import { ActivityIndicator } from 'react-native';
import { Button, Text, MediumBoldText, Input } from '../shared';
import { get, isUndefined, isEqual } from 'lodash';
import FormPicker from './FormPicker';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class DonationForm extends Component {
    _handleCountryCodeItemSelected = (item, handleChange) => {
        const { onCountryItemSelected } = this.props;
        onCountryItemSelected(item);
        handleChange('state', undefined);
    };
    _handleDismissPicker = () => {
        const {
            onCountryVisibilityChange,
            onStateListVisibilityChange,
        } = this.props;
        onCountryVisibilityChange(false);
        onStateListVisibilityChange(false);
    };
    _handleOpenCountryPicker = () => {
        const { onCountryVisibilityChange } = this.props;
        onCountryVisibilityChange(true);
    };

    _handleOpenStatePicker = () => {
        const { onStateListVisibilityChange } = this.props;
        onStateListVisibilityChange(true);
    };
    _renderSubmitButton = handleSubmit => {
        const { t, showActivityIndicator, styles } = this.props;
        if (showActivityIndicator) {
            return <ActivityIndicator size="large" />;
        }
        return (
            <Button
                rounded={true}
                style={styles.confirmDonateButton}
                onPress={handleSubmit}
                text={t('donationFormScreen:confirmDonation')}
                testID="DonationForm__confirmDonation--button"
            />
        );
    };
    _renderAmountText = values => {
        const { styles } = this.props;
        if (!isEqual(values.currency, 'INR')) {
            return (
                <View style={styles.donationInformationText}>
                    <MediumBoldText testID="DonationForm__currency__amount--mediumBoldText">
                        {values.currency} {values.amount}
                    </MediumBoldText>
                    <MediumBoldText testID="DonationForm__convertedDonationAmount--mediumBoldText">
                        (INR {values.convertedDonationAmount})
                    </MediumBoldText>
                </View>
            );
        } else {
            return (
                <View style={styles.donationInformationText}>
                    <MediumBoldText>
                        INR {values.convertedDonationAmount}
                    </MediumBoldText>
                </View>
            );
        }
    };

    _getCountryText = item => {
        return get(item, 'title');
    };
    _getStatesInCountryText = item => {
        return get(item, 'title');
    };

    _checkDisableUpdate = result => {
        return isUndefined(result);
    };
    _checkEmailValue = () => {
        const { userProfile } = this.props;
        const email = get(userProfile, 'email');
        return !(
            isEqual(email, '') ||
            isEqual(email, 'null') ||
            isUndefined(email)
        );
    };

    render() {
        const {
            t,
            values,
            handleChange,
            handleSubmit,
            errors,
            stateList,
            countries,
            visibleCountryPicker,
            showStatePickerList,
            styles,
        } = this.props;
        return (
            <View>
                <Stack space={styles.stackSpace}>
                    <Input
                        placeholder={t('donationFormScreen:firstName')}
                        value={values.firstName}
                        onChangeText={handleChange('firstName')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.firstName}
                        errorStyle={styles.errorStyle}
                    />
                    <Input
                        placeholder={t('donationFormScreen:lastName')}
                        value={values.lastName}
                        onChangeText={handleChange('lastName')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.lastName}
                        errorStyle={styles.errorStyle}
                    />
                    <Input
                        placeholder={t('donationFormScreen:address')}
                        value={values.addressLine1}
                        onChangeText={handleChange('addressLine1')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.addressLine1}
                        errorStyle={styles.errorStyle}
                    />
                    <Input
                        placeholder={t('donationFormScreen:addressLine2')}
                        value={values.addressLine2}
                        onChangeText={handleChange('addressLine2')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.addressLine2}
                        errorStyle={styles.errorStyle}
                    />
                    <FormPicker
                        testID="DonationForm__countryPicker--FormPicker"
                        name="country"
                        placeholder={t('donationFormScreen:country')}
                        heading={t('donationFormScreen:selectACountry')}
                        style={styles.boxContainer}
                        items={countries}
                        show={visibleCountryPicker}
                        onPickerItemSelected={
                            this._handleCountryCodeItemSelected
                        }
                        getDisplayText={this._getCountryText}
                        onDismissPicker={this._handleDismissPicker}
                        onOpenPicker={this._handleOpenCountryPicker}
                    />
                    <FormPicker
                        testID="DonationForm__statePicker--FormPicker"
                        name="state"
                        placeholder={t('donationFormScreen:state')}
                        heading={t('donationFormScreen:selectAState')}
                        style={styles.boxContainer}
                        items={stateList}
                        show={showStatePickerList}
                        getDisplayText={this._getStatesInCountryText}
                        onDismissPicker={this._handleDismissPicker}
                        onOpenPicker={this._handleOpenStatePicker}
                        disableClick={this._checkDisableUpdate(
                            get(values, 'country.title'),
                        )}
                    />
                    <Input
                        placeholder={t('donationFormScreen:city')}
                        value={values.city}
                        onChangeText={handleChange('city')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.city}
                        errorStyle={styles.errorStyle}
                    />
                    <Input
                        placeholder={t('donationFormScreen:postalCode')}
                        value={values.postalCode}
                        onChangeText={handleChange('postalCode')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.postalCode}
                        errorStyle={styles.errorStyle}
                    />
                    <Input
                        placeholder={t('donationFormScreen:emailId')}
                        value={values.email}
                        onChangeText={handleChange('email')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.email}
                        errorStyle={styles.errorStyle}
                        disabled={this._checkEmailValue()}
                    />
                    <Input
                        placeholder={t('personalInfoScreen:phoneNumber')}
                        value={values.phoneNumber}
                        onChangeText={handleChange('phoneNumber')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.phoneNumber}
                        errorStyle={styles.errorStyle}
                    />
                    <Text style={styles.phoneHintText} testID="DonationForm--phoneNumberHint">
                        {t('validations:phoneNumberHint')}
                    </Text>
                    <Input
                        placeholder={t('donationFormScreen:panNumber')}
                        value={values.panNumber}
                        onChangeText={handleChange('panNumber')}
                        itemStyle={styles.inputItem}
                        style={styles.inputBorder}
                        error={errors.panNumber}
                        errorStyle={styles.errorStyle}
                    />
                    <View style={styles.donationInformationView}>
                        <Text testID="DonationForm--donationInformation">
                            {t('donationFormScreen:donationInformation')}
                        </Text>
                        {this._renderAmountText(values)}
                    </View>

                    {this._renderSubmitButton(handleSubmit)}
                </Stack>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(DonationForm, DonorDetailsFormStyles),
);