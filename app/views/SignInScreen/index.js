import React from 'react';
import SignInScreen from './SignInScreen';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import {
    loginUsingGoogle,
    loginUsingFacebook,
    loginUsingApple,
    loginUsingEmailPassword,
    loginAnonymously,
} from '../../services/firebase/AuthService';
import { operations } from '../../state';
import { onLoginPress, onHelpDeskPress } from './index.service';
import { Actions } from 'react-native-router-flux';
import {
    getPrivacyPolicy,
    getTermsAndConditions,
    getMeditationRemindersSettingsConfig,
} from '../../services/firebase/RemoteConfigService';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Scenes, IsIOS } from '../../shared/Constants';

export class SignInScreenContainer extends React.Component {
    state = {
        errorMessage: null,
    };

    handleBackPress = () => {
        this.props.goBack();
    };

    _handleLoginPress = async (loginHandle, params) => {
        const { setMeditationRemindersSettings } = this.props;

        const errorMessage = await onLoginPress(
            loginHandle,
            params,
            this.props,
        );

        setMeditationRemindersSettings(getMeditationRemindersSettingsConfig());
        this.setState({ errorMessage });
    };

    handleGoogleSignInPress = () => {
        this._handleLoginPress(loginUsingGoogle);
    };

    handleFacebookSignInPress = () => {
        this._handleLoginPress(loginUsingFacebook);
    };

    handleAppleSignInPress = () => {
        this._handleLoginPress(loginUsingApple);
    };

    handleEmailSignInPress = values => {
        this._handleLoginPress(loginUsingEmailPassword, values);
    };

    handleSkipPress = () => {
        this._handleLoginPress(loginAnonymously);
        logEvent('login_skip', Scenes.signIn);
    };

    handleForgotPasswordPress = () => {
        this.setState({ errorMessage: null });
        Actions.forgotPassword();
        logEvent('login_forgot_password', Scenes.signIn);
    };

    handleHelpDeskPress = () => {
        this.setState({ errorMessage: null });
        onHelpDeskPress(loginAnonymously, this.props);
        logEvent('login_help_desk', Scenes.signIn);
    };

    handleCreateAccountPress = () => {
        this.setState({ errorMessage: null });
        Actions.signUp();
        logEvent('login_create_account', Scenes.signIn);
    };

    _handlePrivacyPolicyPress = () => {
        this.setState({ errorMessage: null });
        Actions.webViewScreen({ html: getPrivacyPolicy() });
        logEvent('login_privacy_policy', Scenes.signIn);
    };

    _handleTermsAndConditionsPress = () => {
        this.setState({ errorMessage: null });
        Actions.webViewScreen({ html: getTermsAndConditions() });
        logEvent('login_terms_conditions', Scenes.signIn);
    };

    render() {
        const { onboardingFinished } = this.props;

        return (
            <SignInScreen
                onBackPress={this.handleBackPress}
                onGooglePress={this.handleGoogleSignInPress}
                onFacebookPress={this.handleFacebookSignInPress}
                errorMessage={this.state.errorMessage}
                onEmailPress={this.handleEmailSignInPress}
                onSkipPress={this.handleSkipPress}
                canGoBack={!onboardingFinished}
                onForgotPasswordPress={this.handleForgotPasswordPress}
                onCreateAccountPress={this.handleCreateAccountPress}
                onHelpDeskPress={this.handleHelpDeskPress}
                onTermsAndConditionsPress={this._handleTermsAndConditionsPress}
                onPrivacyPolicyPress={this._handlePrivacyPolicyPress}
                showAppleLogin={IsIOS}
                onApplePress={this.handleAppleSignInPress}
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
)(SignInScreenContainer);
