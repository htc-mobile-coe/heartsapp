import React, { Component } from 'react';
import PaymentScreen from './PaymentScreen';
import { get, isNil, isEqual } from 'lodash';
import { operations } from '../../../state';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../../shared/Constants';
import { withTranslation } from 'react-i18next';
import { DONATION } from '../../../shared/Constants';

export class PaymentScreenContainer extends Component {
    state = {
        isPaymentSuccess: false,
        isPaymentInProgress: true,
        showActivityIndicator: true,
        showOptionsScreenHeader: false,
    };

    componentDidMount = () => {
        this._checkForPayuURL();
    };

    _checkForPayuURL = () => {
        const { donationPaymentURL } = this.props;
        if (donationPaymentURL.includes('payu')) {
            this.setState({ showOptionsScreenHeader: false });
        } else {
            this.setState({ showOptionsScreenHeader: true });
        }
    };

    _handleActivityIndicatorVisibilityChange = visibility => {
        this.setState({
            showActivityIndicator: visibility,
        });
    };
    _getTransactionTitleText = () => {
        const { t } = this.props;
        if (!this.state.isPaymentInProgress) {
            return this.state.isPaymentSuccess
                ? t('paymentScreen:thankYou')
                : null;
        }
    };
    _getTransactionMessageText = () => {
        const { t } = this.props;
        if (!this.state.isPaymentInProgress) {
            return this.state.isPaymentSuccess
                ? t('paymentScreen:receiptEmail')
                : t('paymentScreen:paymentFailed');
        }
    };

    _onBackButtonPress = () => {
        const { setDonationPaymentURL } = this.props;
        setDonationPaymentURL(undefined);
        this.setState({
            isPaymentInProgress: true,
            isPaymentSuccess: false,
        });
        Actions.replace(Scenes.donationFormScreen);
    };
    onBackPress = (webViewState, webView) => {
        if (this.state.isPaymentInProgress) {
            const canGoBack = get(webViewState, 'canGoBack', false);
            if (!isNil(webView.current) && canGoBack) {
                webView.current.goBack();
                if (webView.current.state.lastErrorEvent) {
                    this._onBackButtonPress();
                }
            } else {
                this._onBackButtonPress();
            }
        }
    };

    _handleGoToHomePress = () => {
        const {
            saveDonationAmount,
            saveCurrency,
            saveAmountSuggestions,
        } = this.props;
        saveDonationAmount('');
        saveCurrency('INR');
        saveAmountSuggestions(['50', '100', '150']);
        this.setState({
            isPaymentInProgress: true,
            isPaymentSuccess: false,
        });
        Actions.replace(Scenes.home);
    };
    _handleRetryPaymentPress = () => {
        Actions.replace(Scenes.donationFormScreen);
    };

    onDonationPaymentSuccess = () => {
        const {
            setDonationPaymentURL,
            saveCurrency,
            saveAmountSuggestions,
        } = this.props;
        saveCurrency('INR');
        saveAmountSuggestions(['50', '100', '150']);
        setDonationPaymentURL(undefined);
        this.setState({
            isPaymentInProgress: false,
            isPaymentSuccess: true,
        });
    };
    onDonationPaymentFailed = () => {
        const {
            setDonationPaymentURL,
            saveCurrency,
            saveAmountSuggestions,
            saveDonationAmount,
        } = this.props;
        saveDonationAmount('');
        saveCurrency('INR');
        saveAmountSuggestions(['50', '100', '150']);
        setDonationPaymentURL(undefined);
        this.setState({
            isPaymentInProgress: false,
            isPaymentSuccess: false,
        });
    };

    onNavigationStateChange = webViewState => {
        if (webViewState.url.includes(DONATION.DONATION_URL)) {
            if (webViewState.url.includes(DONATION.STATUS_SUCCESS)) {
                this.onDonationPaymentSuccess();
            } else if (webViewState.url.includes(DONATION.STATUS_FAILURE)) {
                this.onDonationPaymentFailed();
            }
        } else {
            if (
                webViewState.url.includes(
                    DONATION.STATUS_AUTHENTICATION_FAILED,
                ) ||
                webViewState.url.includes(DONATION.CANCEL) ||
                webViewState.url.includes(DONATION.UNDEFINED)
            ) {
                this.onDonationPaymentFailed();
            }
        }
    };

    _getSourceType = () => {
        const { paymentGatewayRequestMethod, donationPaymentURL } = this.props;
        if (isEqual(paymentGatewayRequestMethod, 'POST')) {
            return { html: donationPaymentURL };
        } else if (isEqual(paymentGatewayRequestMethod, 'GET')) {
            return { uri: donationPaymentURL };
        }
    };

    render() {
        const { userEmail } = this.props;
        return (
            <PaymentScreen
                source={this._getSourceType()}
                transactionTitle={this._getTransactionTitleText()}
                transactionMessage={this._getTransactionMessageText()}
                userEmail={userEmail}
                isPaymentSuccess={this.state.isPaymentSuccess}
                isPaymentInProgress={this.state.isPaymentInProgress}
                showActivityIndicator={this.state.showActivityIndicator}
                showOptionsScreenHeader={this.state.showOptionsScreenHeader}
                onGoToHomePress={this._handleGoToHomePress}
                onRetryPaymentPress={this._handleRetryPaymentPress}
                onNavigationStateChange={this.onNavigationStateChange}
                onBackButtonPress={this.onBackPress}
                onActivityIndicatorVisibilityChange={
                    this._handleActivityIndicatorVisibilityChange
                }
            />
        );
    }
}
export const mapStateToProps = state => {
    return {
        paymentGatewayRequestMethod: get(
            state.donation,
            'paymentGatewayRequestMethod',
        ),
        donationPaymentURL: get(state.donation, 'donationPaymentURL'),
        currency: get(state.donation, 'currency'),
        donationAmount: get(state.donation, 'donationAmount'),
        userEmail: get(state.donation, 'userEmail'),
    };
};

const mapDispatchToProps = {
    ...operations.donation,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(PaymentScreenContainer));
