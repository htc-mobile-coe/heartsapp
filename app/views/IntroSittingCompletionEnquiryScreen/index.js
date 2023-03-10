import React, { Component } from 'react';
import IntroSittingCompletionEnquiryScreen from './IntroSittingCompletionEnquiryScreen';
import { goBack } from '../../services/BackButtonService';
import { connect } from 'react-redux';
import { Scenes } from '../../shared/Constants';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Actions } from 'react-native-router-flux';
import MasterClassProgressService from '../../services/MasterClassProgressService';

export class IntroSittingCompletionEnquiryScreenContainer extends Component {
    _handleBackPress = () => this.props.goBack();
    _handleYesButtonPress = () => {
        logEvent(
            'introSittingEnquiry_completed_yes',
            Scenes.introSittingCompletionEnquiryScreen,
        );
        Actions.push(Scenes.introductorySittingCompletionDetailsEnquiryScreen);
    };
    _handleWouldLikeToButtonPress = () => {
        logEvent(
            'introSittingEnquiry_interested_yes',
            Scenes.introSittingCompletionEnquiryScreen,
        );
        MasterClassProgressService.start(
            Scenes.introSittingCompletionEnquiryScreen,
        );
        Actions.push(Scenes.masterClassesScreen);
    };
    render = () => {
        return (
            <IntroSittingCompletionEnquiryScreen
                onYesButtonPress={this._handleYesButtonPress}
                onBackButtonPress={this._handleBackPress}
                onIWouldLikeToButtonPress={this._handleWouldLikeToButtonPress}
            />
        );
    };
}
const mapDispatchToProps = {
    goBack,
};
export default connect(
    null,
    mapDispatchToProps,
)(IntroSittingCompletionEnquiryScreenContainer);
