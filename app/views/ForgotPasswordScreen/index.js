import React from 'react';
import ForgotPasswordScreen from './ForgotPasswordScreen';
import { connect } from 'react-redux';
import { send } from './index.service';
import { isNil, isUndefined } from 'lodash';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { operations } from '../../state';

export class ForgotPasswordScreenContainer extends React.Component {
    state = {
        errorMessage: null,
        showSuccessMessage: false,
    };

    onSubmit = async values => {
        const errorMessage = await send(values, this.props);

        if (isNil(errorMessage)) {
            this.setState({ showSuccessMessage: true, errorMessage: null });
        } else if (!isUndefined(errorMessage)) {
            this.setState({ errorMessage, showSuccessMessage: false });
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
            <ForgotPasswordScreen
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
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(ForgotPasswordScreenContainer);
