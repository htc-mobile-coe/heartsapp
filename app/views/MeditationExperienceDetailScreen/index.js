import React, { Component } from 'react';
import { connect } from 'react-redux';
import MeditationExperienceDetailScreen from './MeditationExperienceDetailScreen';
import { withTranslation } from 'react-i18next';
import { Scenes } from '../../shared/Constants';
import { operations } from '../../state';
import { isEqual } from 'lodash';
import { NEVER_MEDITATED } from '../ExperienceInMeditationScreen/Options';
import { logEvent } from '../../services/firebase/AnalyticsService';

export class MeditationExperienceDetailScreenContainer extends Component {
    _getTitle = () => {
        const { t, selectedOption } = this.props;
        return isEqual(selectedOption, NEVER_MEDITATED)
            ? t('meditationExperienceDetailScreen:beginnerTitle')
            : t('meditationExperienceDetailScreen:experiencedTitle');
    };
    _description = () => {
        const { t, selectedOption } = this.props;
        return isEqual(selectedOption, NEVER_MEDITATED)
            ? t('meditationExperienceDetailScreen:beginnerDescription')
            : t('meditationExperienceDetailScreen:experiencedDescription');
    };
    _handleSkipPress = () => {
        const { selectedOption } = this.props;
        const event = isEqual(selectedOption, NEVER_MEDITATED)
            ? 'hello_beginner_page1_skip'
            : 'hello_beginner_page2_skip';
        this._onNavigateToHomeScreen(event);
    };
    _handleLetsStartPress = () => {
        const { selectedOption } = this.props;
        const event = isEqual(selectedOption, NEVER_MEDITATED)
            ? 'hello_beginner_page1_letsStart'
            : 'hello_beginner_page2_letsStart';
        this._onNavigateToHomeScreen(event);
    };
    _onNavigateToHomeScreen = async eventId => {
        const { roleDeclaredByUser, saveOnboardingStatus } = this.props;
        logEvent(eventId, Scenes.meditationExperienceDetailScreen);
        await saveOnboardingStatus(Scenes.home, roleDeclaredByUser, true);
    };

    render() {
        return (
            <MeditationExperienceDetailScreen
                title={this._getTitle()}
                description={this._description()}
                onSkipPress={this._handleSkipPress}
                onLetsStartPress={this._handleLetsStartPress}
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
)(withTranslation()(MeditationExperienceDetailScreenContainer));
