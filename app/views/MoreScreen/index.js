import React, { Component } from 'react';
import MoreScreen from './MoreScreen';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { Actions } from 'react-native-router-flux';
import {
    getTermsAndConditions,
    getPrivacyPolicy,
} from '../../services/firebase/RemoteConfigService';
import { get } from 'lodash';
import { operations } from '../../state';
import { Scenes, SITTING_HISTORY_FILTER_OPTION } from '../../shared/Constants';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { withTranslation } from 'react-i18next';
import MasterClassProgressService from '../../services/MasterClassProgressService';

export class MoreScreenContainer extends Component {
    _handleBackPress = () => {
        Actions.pop();
    };

    _handleProfilePress = () => {
        logEvent('more_profile', Scenes.more);
        Actions.profileScreen();
    };

    _handleHelpAndSupportPress = () => {
        Actions.helpDesk();
        logEvent('more_help_desk', Scenes.more);
    };

    _handlePrivacyPolicyPress = () => {
        Actions.webViewScreen({ html: getPrivacyPolicy() });
        logEvent('more_privacy_policy', Scenes.more);
    };

    _handleTermsAndConditionsPress = () => {
        Actions.webViewScreen({ html: getTermsAndConditions() });
        logEvent('more_terms_conditions', Scenes.more);
    };

    _handleReminderPress = () => {
        Actions.reminderSettingsScreen();
        logEvent('more_reminders', Scenes.more);
    };

    _handleMicroDonationPress = () => {
        Actions.donationOptionsScreen();
    };
    _handleSessionHistoryPress = () => {
        Actions.push(Scenes.sittingHistoryScreen, {
            selectedFilter: SITTING_HISTORY_FILTER_OPTION.ALL,
        });
    };
    _handleTrainerSectionPress = () => {
        Actions.push(Scenes.trainersSectionScreen);
    };
    _handleThreeDaysMasterPress = () => {
        logEvent('more_master_classes', Scenes.more);
        MasterClassProgressService.start(Scenes.more);
        Actions.push(Scenes.masterClassesScreen);
    };
    render() {
        const { isAnonymousUser, isUserPreceptor } = this.props;
        return (
            <MoreScreen
                onBackPress={this._handleBackPress}
                isAnonymousUser={isAnonymousUser}
                isUserPreceptor={isUserPreceptor}
                onProfilePress={this._handleProfilePress}
                onHelpAndSupportPress={this._handleHelpAndSupportPress}
                onPrivacyPolicyPress={this._handlePrivacyPolicyPress}
                onTermsAndConditionsPress={this._handleTermsAndConditionsPress}
                onReminderPress={this._handleReminderPress}
                onMicroDonationPress={this._handleMicroDonationPress}
                onMasterClassPress={this._handleThreeDaysMasterPress}
                onSessionHistoryPress={this._handleSessionHistoryPress}
                onTrainersSectionPress={this._handleTrainerSectionPress}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        roleDeclaredByUser: state.onboardingStatus.roleDeclaredByUser,
        authenticated: get(state.user, 'authenticated'),
        isAnonymousUser: operations.user.isAnonymous(state),
        isUserPreceptor: operations.user.isPreceptor(state),
    };
};

const mapDispatchToProps = {
    handleGoBack: goBack,
    ...operations.onboardingStatus,
    ...operations.appBusyStatus,
    ...operations.preceptorDashboard,
    ...operations.user,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(MoreScreenContainer));
