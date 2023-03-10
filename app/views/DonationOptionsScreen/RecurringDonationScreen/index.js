import React, { Component } from 'react';
import RecurringDonationScreen from './RecurringDonationScreen';
import { connect } from 'react-redux';
import { goBack } from '../../../services/BackButtonService';
import { withTranslation } from 'react-i18next';
import { isNil, isEqual, get } from 'lodash';
import { Actions } from 'react-native-router-flux';
import {
    getRecurringDonationSource,
    getLocateTrainerErrorHTMLContent,
} from '../../../services/firebase/RemoteConfigService';
import { DONATION, Scenes } from '../../../shared/Constants';
import { operations } from '../../../state';

export class RecurringDonationScreenContainer extends Component {
    state = {
        canGoBack: false,
        isPaymentSuccess: false,
        isPaymentInProgress: true,
        showActivityIndicator: true,
        showEmailTransactionMessage: false,
    };

    _onDonationPaymentSuccess = () => {
        this.setState({
            isPaymentInProgress: false,
            isPaymentSuccess: true,
        });
    };
    _onDonationPaymentFailed = () => {
        this.setState({
            isPaymentInProgress: false,
            isPaymentSuccess: false,
        });
    };

    _handleOnWebPageLoadStart = () => {
        this.setState({
            showActivityIndicator: true,
        });
    };
    _handleOnWebPageLoadEnd = () => {
        this.setState({
            showActivityIndicator: false,
        });
    };
    _getTransactionTitleText = () => {
        const { t } = this.props;
        if (!this.state.isPaymentInProgress) {
            return this.state.isPaymentSuccess
                ? t('recurringDonationScreen:thankYou')
                : null;
        }
    };
    _getTransactionMessageText = () => {
        const { t } = this.props;
        if (!this.state.isPaymentInProgress) {
            if (this.state.isPaymentSuccess) {
                return this.state.showEmailTransactionMessage
                    ? t(
                          'recurringDonationScreen:organizationBankAccountDetailsHasBeenSent',
                      )
                    : t('recurringDonationScreen:receiptEmail');
            } else {
                return this.state.showEmailTransactionMessage
                    ? t(
                          'recurringDonationScreen:weAreGettingRespectiveErrorMessage',
                      )
                    : t('recurringDonationScreen:paymentFailed');
            }
        }
    };
    _handleGoToHomePress = () => {
        Actions.replace(Scenes.home);
    };

    _handleNavigationStateChange = webViewState => {
        this.setState({ canGoBack: webViewState.canGoBack });

        if (webViewState.url.includes(DONATION.RECURRING_DONATION_URL)) {
            if (webViewState.url.includes(DONATION.STATUS_SUCCESS)) {
                this._onDonationPaymentSuccess();
            } else if (
                webViewState.url.includes(DONATION.STATUS_EMAIL_SUCCESS)
            ) {
                this.setState({ showEmailTransactionMessage: true });
                this._onDonationPaymentSuccess();
            } else if (webViewState.url.includes(DONATION.STATUS_FAILURE)) {
                this._onDonationPaymentFailed();
            } else if (
                webViewState.url.includes(DONATION.STATUS_EMAIL_FAILURE)
            ) {
                this.setState({ showEmailTransactionMessage: true });
                this._onDonationPaymentFailed();
            }
        }
    };
    _getHTMLSource = () => {
        const {
            isApplicationServerReachable,
            isAnonymousUser,
            addressLine1,
            addressLine2,
            email,
            firstName,
            lastName,
            phone,
            cityPlaceId,
            city,
            postalCode,
            countryName,
        } = this.props;

        if (isEqual(isApplicationServerReachable, true)) {
            if (isEqual(isAnonymousUser, true)) {
                return { uri: getRecurringDonationSource() };
            }
            const phoneNumber = encodeURIComponent(phone);
            const params = encodeURI(
                `addressLine1=${addressLine1}&addressLine2=${addressLine2}&email=${email}&firstName=${firstName}&lastName=${lastName}` +
                    `&postalCode=${postalCode}&cityPlaceId=${cityPlaceId}&city=${city}&countryName=${countryName}`,
            );
            const uri = `${getRecurringDonationSource()}?${params}&phone=${phoneNumber}`;
            return { uri };
        }

        return { html: getLocateTrainerErrorHTMLContent() };
    };
    _handleBackNavigation = webView => {
        if (!isNil(webView.current) && this.state.canGoBack) {
            webView.current.goBack();
        } else {
            Actions.pop();
        }
    };

    render() {
        return (
            <RecurringDonationScreen
                isPaymentSuccess={this.state.isPaymentSuccess}
                isPaymentInProgress={this.state.isPaymentInProgress}
                showActivityIndicator={this.state.showActivityIndicator}
                uri={this._getHTMLSource()}
                onBackPress={this._handleBackNavigation}
                onNavigationStateChange={this._handleNavigationStateChange}
                transactionTitle={this._getTransactionTitleText()}
                transactionMessage={this._getTransactionMessageText()}
                onWebPageLoadStart={this._handleOnWebPageLoadStart}
                onWebPageLoadEnd={this._handleOnWebPageLoadEnd}
                onGoToHomePress={this._handleGoToHomePress}
            />
        );
    }
}
export const mapStateToProps = state => {
    return {
        isApplicationServerReachable: get(
            state,
            'deviceState.isApplicationServerReachable',
        ),
        firstName: get(state.user, 'hfnProfile.firstName'),
        lastName: get(state.user, 'hfnProfile.lastName'),
        email: get(state.user, 'hfnProfile.email'),
        phone: get(state.user, 'hfnProfile.phone'),
        cityPlaceId: get(state.user, 'hfnProfile.cityPlaceId'),
        city: get(state.user, 'hfnProfile.city'),
        postalCode: get(state.user, 'hfnProfile.postalCode'),
        addressLine1: get(state.user, 'hfnProfile.addressLine1'),
        addressLine2: get(state.user, 'hfnProfile.addressLine2'),
        countryName: get(state.user, 'hfnProfile.countryName'),
        isAnonymousUser: operations.user.isAnonymous(state),
    };
};
const mapDispatchToProps = {
    goBack,
};
export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(RecurringDonationScreenContainer));
