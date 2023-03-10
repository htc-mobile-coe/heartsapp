import React, { Component } from 'react';
import SpotlightScreen from './SpotlightScreen';
import { slice } from 'lodash';
import { SpotLightContent } from './SpotLightContent';
import { operations } from '../../state';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { Scenes } from '../../shared/Constants';

export class SpotlightScreenContainer extends Component {
    state = {
        spotLightContentIndex: 0,
    };
    _getSpotLightContentList = () => {
        const { isUserPreceptor } = this.props;
        const removeIndex = isUserPreceptor ? 1 : 0;
        return slice(SpotLightContent, removeIndex, SpotLightContent.length);
    };

    _getSpotLightImageContent = () =>
        this._getSpotLightContentList()[this.state.spotLightContentIndex];

    _handleOnPressSpotLight = async () => {
        const contents = this._getSpotLightImageContent();
        const currentIndex = this.state.spotLightContentIndex;
        logEvent(
            `instructional_ol_${contents.firebaseEvent}`,
            Scenes.spotlight,
        );
        if (currentIndex < this._getSpotLightContentList().length - 1) {
            const incrementedIndexValue = currentIndex + 1;

            this.setState({
                spotLightContentIndex: incrementedIndexValue,
            });
            logEvent(
                `instructional_ol_${contents.firebaseEventNext}`,
                Scenes.spotlight,
            );
        } else {
            Actions.pop();
        }
    };
    _handleOnPressSkip = () => {
        const contents = this._getSpotLightImageContent();
        logEvent(
            `instructional_ol_${contents.firebaseEventSkip}`,
            Scenes.spotlight,
        );
        Actions.pop();
    };

    render = () => {
        return (
            <SpotlightScreen
                onPressSpotLight={this._handleOnPressSpotLight}
                onSkipPress={this._handleOnPressSkip}
                spotLightImageContent={this._getSpotLightImageContent()}
            />
        );
    };
}

export const mapStateToProps = state => {
    return {
        isUserPreceptor: operations.user.isPreceptor(state),
    };
};

export default connect(
    mapStateToProps,
    {},
)(SpotlightScreenContainer);
