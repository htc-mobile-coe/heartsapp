import React from 'react';
import FirstTimeLandingScreen from './FirstTimeLandingScreen';
import { operations } from '../../state';
import { connect } from 'react-redux';
import { onUserRoleSelected } from './index.service';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { get, isEqual } from 'lodash';
import {
    getPrivacyPolicy,
    getTermsAndConditions,
} from '../../services/firebase/RemoteConfigService';
import { NEW_TO_HEARTFULNESS, TRAINER } from './Options';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { withTranslation } from 'react-i18next';
import { Toast } from 'native-base';

export class FirstTimeLandingScreenContainer extends React.Component {
    state = {
        showAgeConsentPopUp: false,
        ageConsentCheckBoxChecked: false,
    };

    static getDerivedStateFromProps(props) {
        const { isAgeConsentPopupVisibile } = props;

        if (isEqual(isAgeConsentPopupVisibile, true)) {
            return {
                showAgeConsentPopUp: true,
            };
        }
        return null;
    }

    _canShowAgeConsentPopUp = () => {
        return (
            isEqual(Actions.currentScene, Scenes.onboarding) &&
            this.state.showAgeConsentPopUp
        );
    };

    handleOptionPress = selectedOption => {
        if (isEqual(selectedOption, NEW_TO_HEARTFULNESS)) {
            logEvent('welcome_new_to_hfn', Scenes.newToHeartfulness);
            this.setState({
                showAgeConsentPopUp: true,
            });
        } else {
            logEvent(
                isEqual(selectedOption, TRAINER)
                    ? 'welcome_trainer'
                    : 'welcome_meditator',
                Scenes.newToHeartfulness,
            );
            onUserRoleSelected(this.props, selectedOption);
        }
    };
    _handleTermsOfUsePress = () => {
        const { setAgeConsentPopupVisibility } = this.props;

        logEvent('welcome_terms_conditions', Scenes.newToHeartfulness);
        this.setState({
            showAgeConsentPopUp: false,
        });
        setAgeConsentPopupVisibility(false);
        Actions.push(Scenes.webViewScreen, { html: getTermsAndConditions() });
    };

    _handlePrivacyPolicyPress = () => {
        const { setAgeConsentPopupVisibility } = this.props;

        logEvent('welcome_privacy_policy', Scenes.newToHeartfulness);
        this.setState({
            showAgeConsentPopUp: false,
        });
        setAgeConsentPopupVisibility(false);
        Actions.push(Scenes.webViewScreen, { html: getPrivacyPolicy() });
    };
    _handleAgeConsentCancelPress = () => {
        const { t, setAgeConsentPopupVisibility } = this.props;

        this.setState({
            showAgeConsentPopUp: false,
            ageConsentCheckBoxChecked: false,
        });
        setAgeConsentPopupVisibility(false);
        Toast.show({
            description: t(
                'HomeScreen:pleaseTryHeartfulnessMeditationAfterMinimumAge',
            ),
            duration: 6000,
        });
    };

    _handleAgeConsentCheckBoxPress = value => {
        this.setState({
            ageConsentCheckBoxChecked: value,
        });
    };
    _handleAgeConsentPopupAcceptPress = () => {
        this.setState({
            showAgeConsentPopUp: false,
        });
        logEvent('welcome_new_to_hfn', Scenes.newToHeartfulness);
        onUserRoleSelected(this.props, NEW_TO_HEARTFULNESS);
    };
    render() {
        return (
            <FirstTimeLandingScreen
                onOptionPress={this.handleOptionPress}
                showAgeConsentPopUp={this._canShowAgeConsentPopUp()}
                ageConsentCheckBoxChecked={this.state.ageConsentCheckBoxChecked}
                onAgeConsentCheckBoxPress={this._handleAgeConsentCheckBoxPress}
                onAgeConsentPopupAcceptPress={
                    this._handleAgeConsentPopupAcceptPress
                }
                onAgeConsentPopupCancelPress={this._handleAgeConsentCancelPress}
                onAgeConsentPopupTermsOfUsePress={this._handleTermsOfUsePress}
                onAgeConsentPopupPrivacyPolicyPress={
                    this._handlePrivacyPolicyPress
                }
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        isUserLoggedIn: operations.user.isLoggedIn(state),
        shouldPlayGuidedRelaxationAudio: operations.user.shouldPlayGuidedRelaxation(
            state,
        ),
        isWeeklyInspirationNotificationSubscribed: operations.user.hasUserSubscribedToWeeklyInspirationNotification(
            state,
        ),
        meditationRemindersSettings: get(
            state.user,
            'meditationRemindersSettings',
        ),
        isAgeConsentPopupVisibile: get(state.user, 'isAgeConsentPopupVisibile'),
    };
};

const mapDispatchToProps = {
    ...operations.onboardingStatus,
    ...operations.appBusyStatus,
    ...operations.user,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(FirstTimeLandingScreenContainer));
