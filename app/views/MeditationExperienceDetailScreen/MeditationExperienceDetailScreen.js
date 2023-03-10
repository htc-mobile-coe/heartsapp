import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as MeditationExperienceDetailScreenStyle } from './MeditationExperienceDetailScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTranslation } from 'react-i18next';
import { Text, Button } from '../shared';
import { Image } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import meditationExperienceImages from './img';

class MeditationExperienceDetailScreen extends Component {
    _renderLetsStartButton = () => {
        const { t, styles, onLetsStartPress } = this.props;
        return (
            <View style={styles.bottomContainer}>
                <Button
                    rounded={true}
                    testID="meditationExperienceDetailScreen_letsStart--button"
                    transparent={true}
                    text={t('meditationExperienceDetailScreen:letsStart')}
                    style={styles.letsStartButton}
                    textStyle={styles.letsStartTextStyle}
                    onPress={onLetsStartPress}
                />
            </View>
        );
    };

    _renderSkipButton = () => {
        const { t, styles, onSkipPress } = this.props;
        return (
            <View style={styles.skipButtonContainer}>
                <Button
                    testID="meditationExperienceDetailScreen_skip--button"
                    transparent={true}
                    text={t('meditationExperienceDetailScreen:skip')}
                    textStyle={styles.skipButton}
                    onPress={onSkipPress}
                />
            </View>
        );
    };

    render() {
        const { styles, images, title, description } = this.props;

        return (
            <ScreenContainer enableScroll={true}>
                <View style={styles.container}>
                    <View style={styles.headingContainer}>
                        {this._renderSkipButton()}
                    </View>
                    <View style={styles.imageContainer}>
                        <Image
                        testID='meditationExperienceDetailScreen__heart--image'
                            source={images.heartImage}
                            style={styles.image}
                        />
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.description}>{description}</Text>
                    </View>
                    {this._renderLetsStartButton()}
                </View>
            </ScreenContainer>
        );
    }
}
export default withTranslation()(
    withTheme(
        MeditationExperienceDetailScreen,
        MeditationExperienceDetailScreenStyle,
        meditationExperienceImages,
    ),
);