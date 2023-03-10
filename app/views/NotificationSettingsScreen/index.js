import React, { Component } from 'react';
import NotificationSettingsScreen from './NotificationSettingsScreen';
import { connect } from 'react-redux';
import { goBack } from '../../services/BackButtonService';
import { withTranslation } from 'react-i18next';
import operation from '../../state/operations';
import { updateWeeklyInspirationNotificationSubscription } from './index.service';
import { get } from 'lodash';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';

export class NotificationSettingsScreenContainer extends Component {
    _handleBackPress = () => {
        this.props.goBack();
    };
    _onChangeWeeklyInspirationNotification = async () => {
        const { hasUserSubscribedToWeeklyInspirationNotification } = this.props;
        await updateWeeklyInspirationNotificationSubscription(
            !hasUserSubscribedToWeeklyInspirationNotification,
            this.props,
        );

        const event = hasUserSubscribedToWeeklyInspirationNotification
            ? 'profile_notify_weeklyInspiration_off'
            : 'profile_notify_weeklyInspiration_on';
        logEvent(event, Scenes.notificationSettingsScreen);
    };
    render() {
        const { hasUserSubscribedToWeeklyInspirationNotification } = this.props;
        return (
            <NotificationSettingsScreen
                onBackPress={this._handleBackPress}
                hasUserSubscribedToWeeklyInspirationNotification={
                    hasUserSubscribedToWeeklyInspirationNotification
                }
                onWeeklyInspirationNotificationToggled={
                    this._onChangeWeeklyInspirationNotification
                }
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        shouldPlayGuidedRelaxationAudio:
            state.user.shouldPlayGuidedRelaxationAudio,
        hasUserSubscribedToWeeklyInspirationNotification:
            state.user.isWeeklyInspirationNotificationSubscribed,
        meditationRemindersSettings: get(
            state.user,
            'meditationRemindersSettings',
        ),
    };
};

const mapDispatchToProps = {
    goBack,
    updateWeeklyInspirationNotificationSubscriptionStatus:
        operation.user.updateWeeklyInspirationNotificationSubscriptionStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(NotificationSettingsScreenContainer));
