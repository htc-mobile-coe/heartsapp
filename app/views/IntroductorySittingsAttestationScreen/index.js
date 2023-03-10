import React, { Component } from 'react';
import { connect } from 'react-redux';
import IntroductorySittingsAttestationScreen from './IntroductorySittingsAttestationScreen';
import { withTranslation } from 'react-i18next';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { logEvent } from '../../services/firebase/AnalyticsService';
import {
    IntroductorySittingsAttestationOptions,
    COMPLETED_INTRO_SESSIONS_AT_EVENT,
} from './IntroductorySittingsAttestationOptions';
import { find } from 'lodash';
import { goBack } from '../../services/BackButtonService';
import { selfAttestForIntroSitting } from '../../services/grpc/ProfileService';
import { operations } from '../../state';

export class IntroductorySittingsAttestationScreenContainer extends Component {
    state = {
        introSessionCompletionStatus: COMPLETED_INTRO_SESSIONS_AT_EVENT,
        options: IntroductorySittingsAttestationOptions,
    };
    _handleSubmitPress = () => {
        const { setTakenIntroductorySittings } = this.props;
        logEvent(
            'taken3Sittings_submit',
            Scenes.introductorySittingsAttestationScreen,
        );
        selfAttestForIntroSitting({
            introSessionCompletionStatus: this.state
                .introSessionCompletionStatus,
        });
        setTakenIntroductorySittings(true);
        Actions.push(Scenes.benefitsOfMeditatingWithTrainer);
    };

    _handleBackPress = () => {
        logEvent(
            'taken3Sittings_back',
            Scenes.introductorySittingsAttestationScreen,
        );
        this.props.goBack();
    };

    _handleAttestationRadioPress = option => {
        logEvent(
            find(this.state.options, {
                id: option.id,
            }).firebaseEvent,
            Scenes.introductorySittingsAttestationScreen,
        );
        this.setState({
            introSessionCompletionStatus: option.id,
        });
    };

    render() {
        return (
            <IntroductorySittingsAttestationScreen
                introSessionCompletionStatus={
                    this.state.introSessionCompletionStatus
                }
                options={this.state.options}
                onAttestationRadioPress={this._handleAttestationRadioPress}
                onSubmitPress={this._handleSubmitPress}
                onBackPress={this._handleBackPress}
            />
        );
    }
}

const mapDispatchToProps = {
    ...operations.user,
    goBack,
};
export default connect(
    null,
    mapDispatchToProps,
)(withTranslation()(IntroductorySittingsAttestationScreenContainer));
