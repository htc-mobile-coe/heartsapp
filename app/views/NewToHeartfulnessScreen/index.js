import React from 'react';
import NewToHeartfulnessScreen from './NewToHeartfulnessScreen';
import { CarouselCardData } from './CarouselCardData';
import { Scenes } from '../../shared/Constants';

import { operations } from '../../state';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { wait } from '../../utils/AsyncUtils';

export class NewToHeartfulnessScreenContainer extends React.Component {
    state = {
        selectedIndex: 0,
        enableProceedButton: false,
    };

    _getContent = () => CarouselCardData[this.state.selectedIndex];

    _onPressCarouselCard = async () => {
        const index =
            CarouselCardData.length - 1 > this.state.selectedIndex
                ? this.state.selectedIndex + 1
                : 0;
        const enableProceedButton = !this.state.enableProceedButton
            ? isEqual(CarouselCardData.length - 1, index)
            : true;
        await wait(250); // for animation and avoid frequency read more measurement changes issue
        this.setState({
            selectedIndex: index,
            enableProceedButton,
        });
        logEvent(`about_hfn_carosel_${index + 1}`, Scenes.newToHeartfulness);
    };

    _onPressProceedButton = () => {
        this._onNavigateToScreen(
            'about_hfn_proceed',
            Scenes.whatAreYouLookingForScreen,
        );
    };

    _onSkipPress = () => {
        this._onNavigateToScreen('about_hfn_skip', Scenes.home);
    };

    _onNavigateToScreen = async (eventId, screen) => {
        const { roleDeclaredByUser, saveOnboardingStatus } = this.props;
        logEvent(eventId, Scenes.newToHeartfulness);
        await saveOnboardingStatus(screen, roleDeclaredByUser, true);
    };

    render() {
        return (
            <NewToHeartfulnessScreen
                content={this._getContent()}
                enableProceedButton={this.state.enableProceedButton}
                selectedIndex={this.state.selectedIndex}
                totalContent={CarouselCardData.length}
                onPressCarouselCard={this._onPressCarouselCard}
                onPressProceedButton={this._onPressProceedButton}
                onSkipPress={this._onSkipPress}
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
)(NewToHeartfulnessScreenContainer);
