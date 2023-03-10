import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as benefitsStyle } from './BenefitsOfMeditatingWithTrainerScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import BenefitsImages from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Button } from '../shared';
import BenefitsCarouselCard from './BenefitsCarouselCard';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from '../shared/Icon';

export class BenefitsOfMeditatingWithTrainerScreen extends Component {
    _renderContinueButton = () => {
        const {
            t,
            styles,
            enableContinueButton,
            onPressContinueButton,
        } = this.props;
        const buttonStyle = !enableContinueButton
            ? [styles.continueButton, styles.continueButtonDisable]
            : styles.continueButton;
        return (
            <View style={styles.bottomContainer}>
                <Button
                    testID="benefitsOfMeditatingWithTrainer_continue--button"
                    rounded
                    disabled={!enableContinueButton}
                    style={buttonStyle}
                    onPress={onPressContinueButton}
                    text={t('benefitsOfMeditatingWithTrainer:continue')}
                />
            </View>
        );
    };
    _renderHeader = () => {
        const { t, styles, onBackPress, onSkipPress } = this.props;
        return (
            <View style={styles.headerButtonContainer}>
                <View style={styles.headerLeftContainer}>
                    <TouchableOpacity
                        testID="benefitsOfMeditatingWithTrainer_back--button"
                        style={styles.backButton}
                        onPress={onBackPress}>
                        <ArrowLeft style={styles.leftArrowIcon} />
                    </TouchableOpacity>
                </View>
                <Button
                    transparent={true}
                    testID="benefitsOfMeditatingWithTrainer_skip--button"
                    textStyle={styles.skipButton}
                    text={t('benefitsOfMeditatingWithTrainer:skip')}
                    onPress={onSkipPress}
                />
            </View>
        );
    };
    render() {
        const {
            styles,
            content,
            images,
            totalContent,
            selectedIndex,
            serialNo,
            onPressCarouselCard,
        } = this.props;
        return (
            <ScreenContainer noBackground={false} enableScroll={false}>
                <View style={styles.container}>
                    <View style={styles.carouselContainer}>
                        {this._renderHeader()}
                        <BenefitsCarouselCard
                            onPress={onPressCarouselCard}
                            totalContent={totalContent}
                            selectedIndex={selectedIndex}
                            serialNo={serialNo}
                            image={images[content.image]}
                            title={content.title}
                            description={content.description}
                            descriptionHighlightedText={
                                content.descriptionHighlightedText
                            }
                            descriptionSuffix={content.descriptionSuffix}
                        />
                    </View>
                </View>
                {this._renderContinueButton()}
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        BenefitsOfMeditatingWithTrainerScreen,
        benefitsStyle,
        BenefitsImages,
    ),
);
