import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as MasterClassCompletionComponentStyle } from './MasterClassCompletionComponent.styles';
import MasterClassCompletionComponentImages from './img';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { Button } from '../../shared';
import Carousel from './Carousel';
import { TouchableOpacity } from 'react-native';
import { ArrowLeft } from '../../shared/Icon';

export class MasterClassCompletionComponent extends Component {
    _renderHomeButtonIfApplicable = () => {
        const {
            t,
            styles,
            showHomeButton,
            enableHomeButton,
            onHomeButtonPress,
        } = this.props;
        if (!showHomeButton) {
            return;
        }
        const buttonStyle = !enableHomeButton
            ? [styles.bottomButton, styles.bottomButtonDisable]
            : styles.bottomButton;
        return (
            <View style={styles.bottomContainer}>
                <Button
                    testID="MasterClassCompletionComponent_home--button"
                    rounded
                    disabled={!enableHomeButton}
                    style={buttonStyle}
                    onPress={onHomeButtonPress}
                    text={t('masterClassesScreen:home')}
                />
            </View>
        );
    };
    _renderContinueButtonIfApplicable = () => {
        const {
            t,
            styles,
            showContinueButton,
            enableContinueButton,
            onContinueButtonPress,
        } = this.props;
        if (!showContinueButton) {
            return;
        }
        const buttonStyle = !enableContinueButton
            ? [styles.bottomButton, styles.bottomButtonDisable]
            : styles.bottomButton;
        return (
            <View style={styles.bottomContainer}>
                <Button
                    testID="MasterClassCompletionComponent_continue--button"
                    rounded
                    disabled={!enableContinueButton}
                    style={buttonStyle}
                    onPress={onContinueButtonPress}
                    text={t('masterClassesScreen:continue')}
                />
            </View>
        );
    };
    _renderHeader = () => {
        const { styles, onBackPress } = this.props;
        return (
            <View style={styles.headerButtonContainer}>
                <View style={styles.headerLeftContainer}>
                    <TouchableOpacity
                        testID="MasterClassCompletionComponent_back--button"
                        style={styles.backButton}
                        onPress={onBackPress}>
                        <ArrowLeft style={styles.leftArrowIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };
    render() {
        const {
            styles,
            content,
            images,
            noOfCards,
            currentPageIndex,
            onCarouselCardPress,
        } = this.props;
        return (
            <View style={styles.container}>
                <View style={styles.container}>
                    <View style={styles.carouselContainer}>
                        {this._renderHeader()}
                        <Carousel
                            onPress={onCarouselCardPress}
                            noOfCards={noOfCards}
                            currentPageIndex={currentPageIndex}
                            image={images[content.image]}
                            title={content.title}
                            subTitle={content.subTitle}
                            description1={content.description1}
                            description2={content.description2}
                            description3={content.description3}
                            descriptionHighlightedText1={
                                content.descriptionHighlightedText1
                            }
                            descriptionHighlightedText2={
                                content.descriptionHighlightedText2
                            }
                            descriptionFullStop={content.descriptionFullStop}
                        />
                    </View>
                </View>
                {this._renderContinueButtonIfApplicable()}
                {this._renderHomeButtonIfApplicable()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        MasterClassCompletionComponent,
        MasterClassCompletionComponentStyle,
        MasterClassCompletionComponentImages,
    ),
);
