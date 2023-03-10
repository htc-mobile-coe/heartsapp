import React from 'react';
import SeekerMeditationCancellationReasonScreen from './SeekerMeditationCancellationReasonScreen';
import { Scenes } from '../../shared/Constants';
import { Actions } from 'react-native-router-flux';
import { withTranslation } from 'react-i18next';
import { logSeekerMeditationCancellationReason } from '../../services/firebase/AnalyticsService';
import { isUndefined, isEmpty } from 'lodash';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { SeekerMeditationCancellationReasonOptions } from './SeekerMeditationCancellationReasonOptions';

export class SeekerMeditationCancellationReasonScreenContainer extends React.Component {
    state = {
        sessionCancellationReason: '',
    };

    _handleCancelReasonRadioPress = option => {
        this.setState({
            sessionCancellationReason: option,
        });
    };
    _handleCancelReasonSubmitPress = async () => {
        const { sessionCancellationReason } = this.state;
        const { firebaseEvent } = sessionCancellationReason;
        const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
        if (canDoNetworkCalls) {
            logSeekerMeditationCancellationReason(
                Scenes.seekerMeditationCancellationReasonScreen,
                firebaseEvent,
            );
            Actions.replace(Scenes.home);
        }
    };
    _shouldDisableSubmitButton = () => {
        return (
            isUndefined(this.state.sessionCancellationReason) ||
            isEmpty(this.state.sessionCancellationReason)
        );
    };

    render() {
        return (
            <SeekerMeditationCancellationReasonScreen
                sessionCancellationReason={this.state.sessionCancellationReason}
                onCancellationReasonRadioPress={
                    this._handleCancelReasonRadioPress
                }
                onCancellationReasonSubmitPress={
                    this._handleCancelReasonSubmitPress
                }
                disableSubmitButton={this._shouldDisableSubmitButton()}
                radioButtonOptions={SeekerMeditationCancellationReasonOptions}
            />
        );
    }
}

export default withTranslation()(
    SeekerMeditationCancellationReasonScreenContainer,
);
