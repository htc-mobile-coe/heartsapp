import React, { Component } from 'react';
import { TextInput, Modal, TouchableOpacity } from 'react-native';
import { styles as donationPromptingMeditationSessionEndedScreenStyles } from './DonationPromptingMeditationSessionEndedScreen.styles';
import CurrencyConversionPopup from './CurrencyConversionPopup';
import ListScreen from './ListScreen';
import ScreenContainer from '../shared/ScreenContainer';
import { View } from 'native-base';
import { Text, Button } from '../shared';
import { withTranslation } from 'react-i18next';
import QuickAmount from './QuickAmount';
import { MediumBoldText } from '../shared/Text';
import { ArrowDown } from '../shared/Icon';
import { get } from 'lodash';
import { amountRegExp } from '../../shared/Validations';
import { getMicroDonationCurrencyConfig } from '../../services/firebase/RemoteConfigService';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

class DonationPromptingMeditationSessionEndedScreen extends Component {
    _handleCurrencyListVisibility = () => {
        const { onCurrencyListVisibility } = this.props;
        onCurrencyListVisibility(true);
    };
    _handleListItemSelected = item => {
        const {
            onCurrencyListVisibility,
            onAmountSuggestionsChange,
        } = this.props;
        this._handleCurrencyChange(get(item, 'value'));
        onCurrencyListVisibility(false);
        onAmountSuggestionsChange(get(item, 'amounts'));
    };
    _handleListDismiss = () => {
        const { onCurrencyListVisibility } = this.props;
        onCurrencyListVisibility(false);
    };
    _handleCurrencyChange = newCurrency => {
        const {
            onDonationCurrencyChange,
            onDonationAmountChange,
            onMinimumAmountErrorVisibilityChange,
        } = this.props;
        onDonationCurrencyChange(newCurrency);
        onDonationAmountChange('');
        onMinimumAmountErrorVisibilityChange(false);
    };
    _handleAmountChange = newAmount => {
        const { onDonationAmountChange } = this.props;
        if (amountRegExp.test(newAmount)) {
            onDonationAmountChange(newAmount);
        }
    };
    _handleQuickAmountPress = amountvalue => {
        const { onDonationAmountChange } = this.props;
        onDonationAmountChange(amountvalue);
    };

    _handleDonatePress = () => {
        const { onDonateButtonPress } = this.props;
        onDonateButtonPress();
    };

    _handleModalYesButtonPress = () => {
        const { onModalYesButtonPress } = this.props;
        onModalYesButtonPress();
    };

    _handleModalNoButtonPress = () => {
        const { onModalNoButtonPress } = this.props;
        onModalNoButtonPress();
    };

    _renderErrorTextIfApplied = () => {
        const { showErrorText, amountErrorText, styles } = this.props;
        if (showErrorText) {
            return (
                <Text
                    style={styles.errorText}
                    testID="DonationPromptingMeditationSessionEndedScreen__error--text">
                    {amountErrorText}
                </Text>
            );
        }
        return null;
    };

    _renderMinimumAmountErrorTextIfApplied = () => {
        const {
            t,
            currency,
            amountSuggestions,
            showMinimumAmountError,
            styles,
        } = this.props;

        if (showMinimumAmountError) {
            return (
                <View style={styles.minimumAmountErrorView}>
                    <Text
                        style={styles.minimumAmountErrorText}
                        testID="DonationPromptingMeditationSessionEndedScreen__minimumAmountError--text">
                        {t(
                            'donationPromptingMeditationSessionEndedScreen:onlineTransactionCouldBeMinimum',
                        )}{' '}
                        {currency + ' ' + amountSuggestions[0]}.
                    </Text>
                    <Text style={styles.minimumAmountErrorText}
                        testID="DonationPromptingMeditationSessionEndedScreen__minimumAmountError--pleaseAdjustTheAmountAccordingly"
                    >
                        {t(
                            'donationPromptingMeditationSessionEndedScreen:pleaseAdjustTheAmountAccordingly',
                        )}
                    </Text>
                </View>
            );
        }
        return null;
    };

    _renderListScreen = () => {
        const { t } = this.props;
        return (
            <ListScreen
                listHeadingText={t(
                    'donationPromptingMeditationSessionEndedScreen:selectACurrency',
                )}
                data={getMicroDonationCurrencyConfig()}
                onItemSelect={this._handleListItemSelected}
                onBackPress={this._handleListDismiss}
            />
        );
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };

    render = () => {
        const {
            t,
            currency,
            donationAmount,
            convertedDonationAmount,
            showAmountModal,
            amountSuggestions,
            showCurrencyList,
            getAmountConversion,
            enableModalYesButton,
            styles,
        } = this.props;

        return (
            <ScreenContainer noBackground={true}>
                <OptionsScreenHeader
                    title={t(
                        'donationPromptingMeditationSessionEndedScreen:title',
                    )}
                    onBackPress={this._handleBackPress}
                />
                <View style={styles.messageView}>
                    <Text style={styles.messageText}
                        testID="DonationPromptingMeditationSessionEndedScreen--messageText"
                    >
                        {t(
                            'donationPromptingMeditationSessionEndedScreen:message',
                        )}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <MediumBoldText style={styles.amountText}>
                        {t(
                            'donationPromptingMeditationSessionEndedScreen:amount',
                        )}
                    </MediumBoldText>
                    <View style={styles.amountInputContainer}>
                        <View style={styles.amountInputView}>
                            <TouchableOpacity
                                testID="DonationPromptingMeditationSessionEndedScreen__currencyListVisibility"
                                onPress={this._handleCurrencyListVisibility}
                                style={styles.currency}>
                                <ArrowDown />
                                <Text
                                    style={styles.currencyText}
                                    testID="DonationPromptingMeditationSessionEndedScreen--currency"
                                >
                                    {currency}
                                </Text>
                            </TouchableOpacity>

                            <View style={styles.verticalLine} />

                            <TextInput
                                style={styles.amountInput}
                                value={donationAmount}
                                onChangeText={this._handleAmountChange}
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>
                        {this._renderErrorTextIfApplied()}
                    </View>
                    <View style={styles.quickAmountContainer}>
                        <QuickAmount
                            testID="DonationPromptingMeditationSessionEndedScreen__QuickAmount"
                            amount={amountSuggestions[0]}
                            onQuickAmountPress={this._handleQuickAmountPress}
                        />
                        <QuickAmount
                            amount={amountSuggestions[1]}
                            onQuickAmountPress={this._handleQuickAmountPress}
                        />
                        <QuickAmount
                            amount={amountSuggestions[2]}
                            onQuickAmountPress={this._handleQuickAmountPress}
                        />
                    </View>
                </View>
                {this._renderMinimumAmountErrorTextIfApplied()}
                <View style={styles.homeButtonContainer}>
                    <Button
                        text={t(
                            'donationPromptingMeditationSessionEndedScreen:donate',
                        )}
                        rounded={true}
                        onPress={this._handleDonatePress}
                        style={styles.donateButton}
                        testID="DonationPromptingMeditationSessionEndedScreen__donate--button"
                    />
                </View>
                <Modal
                    animationType="slide"
                    transparent
                    visible={showAmountModal}>
                    <CurrencyConversionPopup
                        currency={currency}
                        donationAmount={donationAmount}
                        convertedDonationAmount={convertedDonationAmount}
                        getAmountConversion={getAmountConversion}
                        enableModalYesButton={enableModalYesButton}
                        onModalYesButtonPress={this._handleModalYesButtonPress}
                        onModalNoButtonPress={this._handleModalNoButtonPress}
                    />
                </Modal>
                <Modal
                    testID="DonationPromptingMeditationSessionEndedScreen__listScreen--Modal"
                    visible={showCurrencyList}
                    onRequestClose={this._handleListDismiss}>
                    {this._renderListScreen()}
                </Modal>
            </ScreenContainer>
        );
    };
}

export default withTranslation()(
    withTheme(
        DonationPromptingMeditationSessionEndedScreen,
        donationPromptingMeditationSessionEndedScreenStyles,
    ),
);
