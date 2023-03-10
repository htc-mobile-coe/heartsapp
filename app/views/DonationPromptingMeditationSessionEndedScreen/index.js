import React from 'react';
import DonationPromptingMeditationSessionEndedScreen from './DonationPromptingMeditationSessionEndedScreen';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Scenes } from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
import { operations } from '../../state';
import { get, isEmpty, toNumber, find } from 'lodash';
import { isUndefined } from 'lodash';
import { getConversion } from '../../services/CurrencyConversionService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { goBack, backButtonHandlers } from '../../services/BackButtonService';
import { getMicroDonationCurrencyConfig } from '../../services/firebase/RemoteConfigService';

export class MeditationSessionEndedScreenContainer extends React.Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setDonationPromptingMeditationScreenHandler(
            this._handleBackPress,
        );
    }
    TAG = 'MeditationSessionEndedScreenContainer';
    state = {
        showAmountModal: false,
        showCurrenyList: false,
        showErrorText: false,
        amountErrorText: '',
        showMinimumAmountError: false,
        enableModalYesButton: false,
    };

    _handleBackPress = () => {
        const {
            saveDonationAmount,
            saveCurrency,
            saveAmountSuggestions,
        } = this.props;
        this.setState({ showErrorText: false, showMinimumAmountError: false });
        saveDonationAmount('');
        saveCurrency('INR');
        saveAmountSuggestions(
            find(getMicroDonationCurrencyConfig(), { value: 'INR' }).amounts,
        );
        Actions.pop();
    };

    componentDidMount = () => {
        const { setCountries } = this.props;
        setCountries();
    };

    _handleAmountSuggestionsChange = newAmounts => {
        const { saveAmountSuggestions } = this.props;
        saveAmountSuggestions(newAmounts);
    };
    _handleCurrencyChange = newCurrency => {
        const { saveCurrency } = this.props;

        saveCurrency(newCurrency);
    };
    _handleAmountChange = newAmount => {
        const { saveDonationAmount } = this.props;

        saveDonationAmount(newAmount);
    };
    _handleConvertedDonationAmountChange = convertedAmount => {
        const { saveConvertedDonationAmount } = this.props;
        saveConvertedDonationAmount(convertedAmount);
    };
    _handleGetConversion = async () => {
        this.setState({ enableModalYesButton: false });
        this._handleConvertedDonationAmountChange('');
        await getConversion(this.props).then(
            this._handleConvertedDonationAmountChange,
        );
        this.setState({ enableModalYesButton: true });
    };
    _handleDonatePress = async () => {
        const { donationAmount, t, amountSuggestions } = this.props;
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            if (!isUndefined(donationAmount) && !isEmpty(donationAmount)) {
                if (toNumber(donationAmount)) {
                    if (
                        parseFloat(donationAmount, 0) >=
                        parseFloat(amountSuggestions[0], 0)
                    ) {
                        this.setState({
                            showAmountModal: true,
                            showErrorText: false,
                            showMinimumAmountError: false,
                        });
                    } else {
                        this.setState({
                            showMinimumAmountError: true,
                        });
                    }
                } else {
                    this.setState({
                        showErrorText: true,
                        amountErrorText: t('validations:invalidValue'),
                    });
                }
            } else {
                this.setState({
                    showErrorText: true,
                    amountErrorText: t('validations:required'),
                });
            }
        }
    };

    _handleModalYesButtonPress = () => {
        this.setState({ showAmountModal: false });
        Actions.push(Scenes.donationFormScreen);
    };

    _handleModalNoButtonPress = () => {
        this.setState({ showAmountModal: false });
    };

    _handleCurrencyListVisibilityChange = showList => {
        this.setState({ showCurrenyList: showList });
    };

    _handleMinimumAmountErrorVisibilityChange = visibility => {
        this.setState({ showMinimumAmountError: visibility });
    };

    render = () => {
        const {
            currency,
            amountSuggestions,
            donationAmount,
            convertedDonationAmount,
            countries,
        } = this.props;
        return (
            <DonationPromptingMeditationSessionEndedScreen
                onBackPress={this._handleBackPress}
                currency={currency}
                countries={countries}
                amountSuggestions={amountSuggestions}
                onDonationCurrencyChange={this._handleCurrencyChange}
                onAmountSuggestionsChange={this._handleAmountSuggestionsChange}
                donationAmount={donationAmount}
                onDonationAmountChange={this._handleAmountChange}
                convertedDonationAmount={convertedDonationAmount}
                getAmountConversion={this._handleGetConversion}
                onConvertedDonationAmountChange={
                    this._handleConvertedDonationAmountChange
                }
                onModalYesButtonPress={this._handleModalYesButtonPress}
                onModalNoButtonPress={this._handleModalNoButtonPress}
                showErrorText={this.state.showErrorText}
                amountErrorText={this.state.amountErrorText}
                showCurrencyList={this.state.showCurrenyList}
                showAmountModal={this.state.showAmountModal}
                showMinimumAmountError={this.state.showMinimumAmountError}
                enableModalYesButton={this.state.enableModalYesButton}
                onCurrencyListVisibility={
                    this._handleCurrencyListVisibilityChange
                }
                onMinimumAmountErrorVisibilityChange={
                    this._handleMinimumAmountErrorVisibilityChange
                }
                onDonateButtonPress={this._handleDonatePress}
            />
        );
    };
}

export const mapStateToProps = state => {
    return {
        ...state.seekerMeditation,
        currency: get(state.donation, 'currency'),
        amountSuggestions: get(state.donation, 'amountSuggestions'),
        donationAmount: get(state.donation, 'donationAmount'),
        convertedDonationAmount: get(state.donation, 'convertedDonationAmount'),
        countries: get(state.countryStates, 'countries'),
    };
};

const mapDispatchToProps = {
    goBack,
    ...operations.seekerMeditation,
    ...operations.donation,
    ...operations.countryStates,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(MeditationSessionEndedScreenContainer));
