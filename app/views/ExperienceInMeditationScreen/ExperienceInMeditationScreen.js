import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as ExperienceInMeditationScreenStyle } from './ExperienceInMeditationScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import { Text } from '../shared';
import { TouchableOpacity } from 'react-native';
import SpannableTitleButton from './SpannableTitleButton';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import experienceInMeditationImages from './img';

class ExperienceInMeditationScreen extends Component {
    _renderButtons = () => {
        const {
            t,
            styles,
            images,
            onNeverMeditatedPress,
            onFewTimesMeditatedPress,
            onRegularlyMeditatedPress,
        } = this.props;
        return (
            <View style={styles.spannableButtonsView}>
                <SpannableTitleButton
                    testID="experienceInMeditationScreen__neverMeditated--button"
                    onPress={onNeverMeditatedPress}
                    startText={t('experienceInMeditationScreen:have')}
                    highlightedText={t('experienceInMeditationScreen:never')}
                    endText={t('experienceInMeditationScreen:meditatedBefore')}
                    imageSource={images.neverMeditatedImage}
                    style={styles.spannableButtonStyle}
                />

                <SpannableTitleButton
                    testID="experienceInMeditationScreen__fewTimesMeditated--button"
                    onPress={onFewTimesMeditatedPress}
                    startText={t('experienceInMeditationScreen:meditated')}
                    highlightedText={t('experienceInMeditationScreen:fewTimes')}
                    imageSource={images.fewTimesMeditatedImage}
                    style={styles.spannableButtonStyle}
                />

                <SpannableTitleButton
                    testID="experienceInMeditationScreen__regularlyMeditated--button"
                    onPress={onRegularlyMeditatedPress}
                    startText={t('experienceInMeditationScreen:meditate')}
                    highlightedText={t(
                        'experienceInMeditationScreen:regularly',
                    )}
                    imageSource={images.regularlyMeditatedImage}
                    style={styles.spannableButtonStyle}
                />
            </View>
        );
    };

    _renderHeader = () => {
        const { t, styles, onSkipPress } = this.props;
        return (
            <View style={styles.headerStyle}>
                <TouchableOpacity
                    testID="experienceInMeditationScreen_skip--button"
                    style={styles.skipButtonStyle}
                    onPress={onSkipPress}>
                    <Text style={styles.skipText}>
                        {t('experienceInMeditationScreen:skip')}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.titleText}>
                    {t('experienceInMeditationScreen:title')}
                </Text>
            </View>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <ScreenContainer enableScroll={true}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    {this._renderButtons()}
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(
        ExperienceInMeditationScreen,
        ExperienceInMeditationScreenStyle,
        experienceInMeditationImages,
    ),
);
