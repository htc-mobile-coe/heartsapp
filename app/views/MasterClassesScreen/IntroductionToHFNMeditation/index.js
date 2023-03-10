import React, { Component } from 'react';
import { View } from 'native-base';
import { Button } from '../../shared';
import { TouchableOpacity, Image } from 'react-native';
import { Text, BoldText } from '../../shared/Text';
import { withTranslation } from 'react-i18next';
import { styles as introductionToHFNMeditationScreenStyles } from './IntroductionToHFNMeditation.styles';
import introductionToHFNMeditationScreenImages from './img';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { ArrowLeft } from '../../shared/Icon';
export class IntroductionToHFNMeditation extends Component {
    _renderHeader = () => {
        const { t, styles, onBackButtonPress } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerBackButtonContainer}>
                    <TouchableOpacity
                        onPress={onBackButtonPress}
                        style={styles.backButtonStyle}>
                        <ArrowLeft style={styles.backLeftArrow} />
                    </TouchableOpacity>
                </View>

                <Text style={styles.headerText}>
                    {t('masterClassesScreen:description')}
                </Text>
            </View>
        );
    };
    _renderContent = () => {
        const { t, styles, images } = this.props;
        return (
            <View style={styles.contentContainer}>
                <Image source={images.introductory} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.titleText}>
                        {t('masterClassesScreen:pleaseComplete')}
                    </Text>
                    <BoldText style={styles.subTitleText}>
                        {t('masterClassesScreen:threeIntroductory')}
                    </BoldText>
                    <Text style={styles.descriptionText}>
                        {t('masterClassesScreen:sessionsToGetStarted')}
                    </Text>
                </View>
            </View>
        );
    };
    _renderButtons = () => {
        const { t, styles, onNextPress } = this.props;
        return (
            <View style={styles.buttonContainer}>
                <Button
                    testID="IntroductionToHFNMeditation__continue--button"
                    transparent={true}
                    rounded={true}
                    style={styles.nextButtonStyle}
                    text={t('masterClassesScreen:continue')}
                    textStyle={styles.buttonText}
                    onPress={onNextPress}
                />
            </View>
        );
    };
    render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderContent()}
                {this._renderButtons()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        IntroductionToHFNMeditation,
        introductionToHFNMeditationScreenStyles,
        introductionToHFNMeditationScreenImages,
    ),
);
