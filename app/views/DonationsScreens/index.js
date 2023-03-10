import React, { Component } from 'react';
import DonorDetailsFormScreen from './DonorDetailsFormScreen';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { connect } from 'react-redux';
import { operations } from '../../state';
import { get, isNull, find } from 'lodash';
import { Alert } from 'react-native';
import { makeDonation, fetchProfile } from './index.service';
import { isUndefined } from 'lodash';
import { goBack, backButtonHandlers } from '../../services/BackButtonService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { getDonationURL } from '../../services/firebase/RemoteConfigService';

export class DonationContainer extends Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setDonationFormScreenHandler(
            this.screenBackBackButtonHandler,
        );
    }

    screenBackBackButtonHandler = async () => {
        if (!this.state.loadActivityIndicatorVisible) {
            this.setState({ errorMessage: '' });
            Actions.pop();
        }
    };
    state = {
        loadActivityIndicatorVisible: false,
        countryName: '',
        stateName: '',
        showCountryPicker: false,
        showStatePicker: false,
        errorMessage: '',
        showForeignCurrencyRestrictionPopup: false,
    };
    componentDidMount = () => {
        const { setCountries } = this.props;
        fetchProfile(this.props);
        setCountries();
        this._getStatesListFromProfile();
    };

    _getStatesListFromProfile = async () => {
        const { userProfile, countries } = this.props;
        const countryName = get(userProfile, 'countryName');
        const item = await find(countries, {
            title: countryName,
        });
        if (!isUndefined(item)) {
            this._handleCountrySelectionChange(item);
        }
    };

    _handleCountrySelectionChange = item => {
        const { setStateList } = this.props;
        setStateList(item.id);
    };

    _handleCountryCodeVisibilityChange = visible => {
        this.setState({ showCountryPicker: visible });
    };
    _handleStateVisibilityChange = visible => {
        this.setState({ showStatePicker: visible });
    };

    _handlePopupVisibilityChange = visible => {
        this.setState({ showForeignCurrencyRestrictionPopup: visible });
    };

    _handleActivityIndicatorVisibilityChange = visible => {
        this.setState({ loadActivityIndicatorVisible: visible });
    };

    _handleDonationURLPress = () => {
        this.setState({ showForeignCurrencyRestrictionPopup: false });
        Actions.webViewScreen({ uri: getDonationURL() });
    };

    _makeDonation = async formikValues => {
        const { saveUserEmail } = this.props;

        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            saveUserEmail(formikValues.email);
            this._handleActivityIndicatorVisibilityChange(true);
            try {
                const errorMessage = await makeDonation(
                    formikValues,
                    'IN',
                    this.props,
                );

                if (!isNull(errorMessage)) {
                    this.setState({ errorMessage });
                }
            } catch (err) {
                Alert.alert('Error', err.message);
            }
            this._handleActivityIndicatorVisibilityChange(false);
        }
    };

    _confirmDonationPress = formikValues => {
        this._makeDonation(formikValues);
    };
    _navigatePaymentScreenIfDonationAvailable = () => {
        const { donationPaymentURL } = this.props;
        if (!isUndefined(donationPaymentURL)) {
            Actions.replace(Scenes.paymentScreen);
        }
    };

    render() {
        this._navigatePaymentScreenIfDonationAvailable();

        const {
            donationAmount,
            convertedDonationAmount,
            currency,
            countries,
            stateList,
            userProfile,
        } = this.props;
        return (
            <DonorDetailsFormScreen
                userProfile={userProfile}
                countries={countries}
                stateList={stateList}
                selectedCurrency={currency}
                donationAmount={donationAmount}
                convertedDonationAmount={convertedDonationAmount}
                onConfirmDonationPress={this._confirmDonationPress}
                onBackPress={this.screenBackBackButtonHandler}
                showActivityIndicator={this.state.loadActivityIndicatorVisible}
                countryName={this.state.countryName}
                stateName={this.state.stateName}
                errorMessage={this.state.errorMessage}
                onCountryItemSelected={this._handleCountrySelectionChange}
                onCountryVisibilityChange={
                    this._handleCountryCodeVisibilityChange
                }
                visibleCountryPicker={this.state.showCountryPicker}
                onStateListVisibilityChange={this._handleStateVisibilityChange}
                showStatePickerList={this.state.showStatePicker}
                showForeignCurrencyRestrictionPopup={
                    this.state.showForeignCurrencyRestrictionPopup
                }
                foreignCurrencyRestrictionPopupCloseButtonPress={
                    this._handlePopupVisibilityChange
                }
                donationURL={getDonationURL()}
                onDonationURLPress={this._handleDonationURLPress}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        donationPaymentURL: get(state.donation, 'donationPaymentURL'),
        currency: get(state.donation, 'currency'),
        donationAmount: get(state.donation, 'donationAmount'),
        convertedDonationAmount: get(state.donation, 'convertedDonationAmount'),
        userProfile: get(state.user, 'hfnProfile'),
        ...state.countryStates,
    };
};

const mapDispatchToProps = {
    goBack,
    ...operations.donation,
    ...operations.countryStates,
    ...operations.user,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DonationContainer);
