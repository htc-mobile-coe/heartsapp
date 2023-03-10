import React, { Component } from 'react';
import DonationOptionsScreen from './DonationOptionsScreen';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { withTranslation } from 'react-i18next';
import { citizenshipOptions } from './CitizenshipOptions';
import { getDonationURL } from '../../services/firebase/RemoteConfigService';

export class DonationOptionsScreenContainer extends Component {
    state = {
        citizenship: null,
        showCitizenshipPopup: false,
    };

    _handleBackPress = () => {
        Actions.pop();
    };

    _handleOnOneTimeDonationPress = () => {
        this.setState({ showCitizenshipPopup: true });
    };

    _handleOnRecurringDonationPress = () => {
        Actions.push(Scenes.recurringDonationScreen);
    };

    _handleCloseCitizenshipPopup = () => {
        this.setState({
            showCitizenshipPopup: false,
        });
    };

    _handleCitizenOfIndiaChange = citizenship => {
        this.setState({
            showCitizenshipPopup: false,
            citizenship: null,
        });

        if (citizenship.id) {
            Actions.push(Scenes.donationPromptingMeditation);
        } else {
            Actions.webViewScreen({ uri: getDonationURL() });
        }
    };

    render() {
        return (
            <DonationOptionsScreen
                showCitizenshipPopup={this.state.showCitizenshipPopup}
                citizenship={this.state.citizenship}
                citizenshipOptions={citizenshipOptions}
                onBackPress={this._handleBackPress}
                onOneTimeDonationPress={this._handleOnOneTimeDonationPress}
                onRecurringDonationPress={this._handleOnRecurringDonationPress}
                onCloseCitizenshipPopup={this._handleCloseCitizenshipPopup}
                onCitizenRadioPress={this._handleCitizenOfIndiaChange}
            />
        );
    }
}

const mapDispatchToProps = {
    handleGoBack: goBack,
};

export default connect(
    null,
    mapDispatchToProps,
)(withTranslation()(DonationOptionsScreenContainer));
