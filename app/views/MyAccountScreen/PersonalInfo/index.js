import React from 'react';
import PersonalInfoScreen from './PersonalInfoScreen';
import {
    goBack,
    backButtonHandlers,
} from '../../../services/BackButtonService';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../../shared/Constants';
import { get, isNull } from 'lodash';
import { operations } from '../../../state';
import { Alert } from 'react-native';
import { fetchProfile, updateProfile } from './index.service';

export class PersonalInfoScreenContainer extends React.Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setPersonalInfoScreenHandler(
            this.screenBackBackButtonHandler,
        );
    }

    screenBackBackButtonHandler = () => {
        Actions.pop();
    };
    state = {
        showCityScreen: false,
        showSuccessModal: false,
        errorMessage: '',
    };
    componentDidMount = () => {
        const { setCountries } = this.props;
        setCountries();
        fetchProfile(this.props);
    };

    _handleUpdatePress = async formikValues => {
        const { setBusy } = this.props;
        setBusy(true);
        try {
            const errorMessage = await updateProfile(formikValues, this.props);
            if (!isNull(errorMessage)) {
                this.setState({ errorMessage });
            } else {
                this.setState({ showSuccessModal: true });
                setTimeout(() => {
                    this.setState({ showSuccessModal: false });
                    Actions.popTo(Scenes.profileScreen);
                }, 3000);
            }
        } catch (err) {
            Alert.alert('Error', err.message);
        }
        setBusy(false);
    };

    _handleCityFieldPress = () => {
        this.setState({ showCityScreen: true });
    };

    _handleCityScreenVisibility = visible => {
        this.setState({ showCityScreen: visible });
    };

    render() {
        const { userProfile } = this.props;
        return (
            <PersonalInfoScreen
                onBackPress={this.screenBackBackButtonHandler}
                userProfile={userProfile}
                onUpdatePress={this._handleUpdatePress}
                onCityFieldPress={this._handleCityFieldPress}
                showCityScreen={this.state.showCityScreen}
                onCityVisibilityChange={this._handleCityScreenVisibility}
                showSuccessModal={this.state.showSuccessModal}
                errorMessage={this.state.errorMessage}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        userProfile: get(state.user, 'hfnProfile'),
        ...state.countryStates,
    };
};

const mapDispatchToProps = {
    goBack,
    ...operations.user,
    ...operations.countryStates,
    ...operations.appBusyStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PersonalInfoScreenContainer);
