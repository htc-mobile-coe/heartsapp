import React from 'react';
import BenefitsOfMeditatingWithTrainerScreen from './BenefitsOfMeditatingWithTrainerScreen';
import { benefitsCarouselCardData } from './BenefitsCarouselCardData';
import { Scenes } from '../../shared/Constants';

import { operations } from '../../state';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import { logEvent } from '../../services/firebase/AnalyticsService';
import { wait } from '../../utils/AsyncUtils';
import { goBack } from '../../services/BackButtonService';
import { Actions } from 'react-native-router-flux';

export class BenefitsOfMeditatingWithTrainerScreenContainer extends React.Component {
    state = {
        selectedIndex: 0,
        enableContinueButton: false,
    };

    _getSerialNo = () => `${this.state.selectedIndex + 1}`.padStart(2, 0);

    _getContent = () => benefitsCarouselCardData[this.state.selectedIndex];

    _onPressCarouselCard = async () => {
        const index =
            benefitsCarouselCardData.length - 1 > this.state.selectedIndex
                ? this.state.selectedIndex + 1
                : 0;
        const enableContinueButton = !this.state.enableContinueButton
            ? isEqual(benefitsCarouselCardData.length - 1, index)
            : true;
        await wait(200); // for animation and avoid frequency read more measurement changes issue
        this.setState({
            selectedIndex: index,
            enableContinueButton,
        });
        logEvent(
            `AboutHFN_Carosel_${index + 1}`,
            Scenes.benefitsOfMeditatingWithTrainer,
        );
    };

    _onPressContinueButton = () => {
        logEvent(
            'BenefitsOfMeditatingWithTrainer_Continue',
            Scenes.benefitsOfMeditatingWithTrainer,
        );
        Actions.push(Scenes.additionalAbhyasisMeditatingInputScreen);
    };

    _onSkipPress = () => {
        logEvent(
            'BenefitsOfMeditatingWithTrainer_Skip',
            Scenes.benefitsOfMeditatingWithTrainer,
        );
        Actions.push(Scenes.additionalAbhyasisMeditatingInputScreen);
    };

    _onBackPress = () => this.props.goBack();

    render() {
        return (
            <BenefitsOfMeditatingWithTrainerScreen
                content={this._getContent()}
                enableContinueButton={this.state.enableContinueButton}
                serialNo={this._getSerialNo()}
                selectedIndex={this.state.selectedIndex}
                totalContent={benefitsCarouselCardData.length}
                onPressCarouselCard={this._onPressCarouselCard}
                onPressContinueButton={this._onPressContinueButton}
                onSkipPress={this._onSkipPress}
                onBackPress={this._onBackPress}
            />
        );
    }
}

export const mapStateToProps = state => {
    return state.onboardingStatus;
};

const mapDispatchToProps = {
    goBack,
    ...operations.onboardingStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(BenefitsOfMeditatingWithTrainerScreenContainer);
