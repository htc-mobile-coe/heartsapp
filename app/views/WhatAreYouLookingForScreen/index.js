import React from 'react';
import WhatAreYouLookingForScreen from './WhatAreYouLookingForScreen';
import { whatAreYouLookingForData } from './WhatAreYouLookingForData';
import { Scenes } from '../../shared/Constants';
import { findIndex, find, set } from 'lodash';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { operations } from '../../state';
import { connect } from 'react-redux';

export class WhatAreYouLookingForScreenContainer extends React.Component {
    state = {
        contents: whatAreYouLookingForData,
    };

    _handleTileButtonPress = (id, isSelected) => {
        const contents = this.state.contents;
        const option = find(contents, { id });
        set(option, 'isSelected', !isSelected);

        logEvent(
            `lookingFor_${contents[id - 1].firebaseEvent}`,
            Scenes.whatAreYouLookingForScreen,
        );
        this.setState({ contents });
    };
    _isContinueButtonDisabled = () =>
        findIndex(this.state.contents, 'isSelected') < 0;

    _handleSkipButtonPress = () => {
        this._onNavigateToScreen('lookingFor_skip', Scenes.home);
    };
    _handleContinueButtonPress = () => {
        this._onNavigateToScreen(
            'lookingFor_continue',
            Scenes.experienceInMeditationScreen,
        );
    };
    _onNavigateToScreen = async (eventId, screen) => {
        const { roleDeclaredByUser, saveOnboardingStatus } = this.props;
        logEvent(eventId, Scenes.whatAreYouLookingForScreen);
        await saveOnboardingStatus(screen, roleDeclaredByUser, true);
    };

    render() {
        return (
            <WhatAreYouLookingForScreen
                contents={this.state.contents}
                onTileButtonPress={this._handleTileButtonPress}
                onSkipButtonPress={this._handleSkipButtonPress}
                onContinueButtonPress={this._handleContinueButtonPress}
                isContinueButtonDisabled={this._isContinueButtonDisabled()}
            />
        );
    }
}

export const mapStateToProps = state => {
    return state.onboardingStatus;
};
const mapDispatchToProps = {
    ...operations.onboardingStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WhatAreYouLookingForScreenContainer);
