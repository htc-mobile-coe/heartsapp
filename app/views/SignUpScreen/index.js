import React from 'react';
import SignUpScreen from './SignUpScreen';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { onSignUp, doLoginAnonymously } from './index.service';
import { isNil, isUndefined } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { operations } from '../../state';

export class SignUpScreenContainer extends React.Component {
    state = {
        errorMessage: null,
        showSuccessMessage: false,
    };

    onSubmit = async values => {
        const errorMessage = await onSignUp(values, this.props);

        if (isNil(errorMessage)) {
            this.setState({ showSuccessMessage: true, errorMessage: null });
        } else {
            this.setState({ errorMessage });
        }
    };

    handleBackPress = () => {
        this.setState({ showSuccessMessage: false, errorMessage: null });
        Actions.replace(Scenes.signIn);
    };

    handleGoToLoginScreenPress = () => {
        this.setState({ showSuccessMessage: false, errorMessage: null });
        Actions.replace(Scenes.signIn);
    };

    render() {
        return (
            <SignUpScreen
                onSubmit={this.onSubmit}
                errorMessage={this.state.errorMessage}
                onBackPress={this.handleBackPress}
                showSuccessMessage={this.state.showSuccessMessage}
                onGoToLoginScreenPress={this.handleGoToLoginScreenPress}
            />
        );
    }
}

export const mapStateToProps = state => {
    return state.onboardingStatus;
};

const mapDispatchToProps = {
    ...operations.onboardingStatus,
    ...operations.appBusyStatus,
    ...operations.user,
    goBack,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(SignUpScreenContainer);
