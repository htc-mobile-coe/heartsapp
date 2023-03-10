import React, { Component } from 'react';
import { connect } from 'react-redux';
import ExperienceInMeditationScreen from './ExperienceInMeditationScreen';
import { withTranslation } from 'react-i18next';
import { Actions } from 'react-native-router-flux';
import { Scenes } from '../../shared/Constants';
import { operations } from '../../state';
import {
    NEVER_MEDITATED,
    FEW_TIMES_MEDITATED,
    REGULARLY_MEDITATED,
} from './Options';
import { logEvent } from '../../services/firebase/AnalyticsService';

export class ExperienceInMeditationScreenContainer extends Component {
    _handleNeverMeditatedPress = () => {
        logEvent('meditation_exp_never', Scenes.experienceInMeditationScreen);
        Actions.meditationExperienceDetailScreen({
            selectedOption: NEVER_MEDITATED,
        });
    };
    _handleFewTimesMeditatedPress = () => {
        logEvent(
            'meditation_exp_fewTimes',
            Scenes.experienceInMeditationScreen,
        );
        Actions.meditationExperienceDetailScreen({
            selectedOption: FEW_TIMES_MEDITATED,
        });
    };
    _handleRegularlyMeditatedPress = () => {
        logEvent('meditation_exp_regular', Scenes.experienceInMeditationScreen);
        Actions.meditationExperienceDetailScreen({
            selectedOption: REGULARLY_MEDITATED,
        });
    };
    _handleSkipPress = async () => {
        const { roleDeclaredByUser, saveOnboardingStatus } = this.props;
        logEvent('meditation_exp_skip', Scenes.experienceInMeditationScreen);
        await saveOnboardingStatus(Scenes.home, roleDeclaredByUser, true);
    };

    render() {
        return (
            <ExperienceInMeditationScreen
                onNeverMeditatedPress={this._handleNeverMeditatedPress}
                onFewTimesMeditatedPress={this._handleFewTimesMeditatedPress}
                onRegularlyMeditatedPress={this._handleRegularlyMeditatedPress}
                onSkipPress={this._handleSkipPress}
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
)(withTranslation()(ExperienceInMeditationScreenContainer));
