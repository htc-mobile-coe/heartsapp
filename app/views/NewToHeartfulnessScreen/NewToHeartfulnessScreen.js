import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { styles as newHeartfulnessStyle } from './NewToHeartfulnessScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import newHeartfulnessImages from './img';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { BoldText, Button, Text } from '../shared';
import CarouselCard from './CarouselCard';
import PageControl from 'react-native-page-control';

export class NewToHeartfulnessScreen extends Component {
    _renderProceedButton = () => {
        const {
            t,
            styles,
            enableProceedButton,
            onPressProceedButton,
        } = this.props;
        const buttonStyle = !enableProceedButton
            ? [styles.proceedButton, styles.proceedButtonDisable]
            : styles.proceedButton;
        return (
            <View style={styles.bottomContainer}>
                <Button
                    testID="newToHeartfulnessScreen_proceed--button"
                    rounded
                    disabled={!enableProceedButton}
                    style={buttonStyle}
                    onPress={onPressProceedButton}
                    text={t('newToHeartfulnessScreen:proceed')}
                />
            </View>
        );
    };
    _renderSkipButton = () => {
        const { t, styles, onSkipPress } = this.props;
        return (
            <View style={styles.skipButtonContainer}>
                <Button
                    testID="newToHeartfulnessScreen_skip--button"
                    transparent={true}
                    text={t('newToHeartfulnessScreen:skip')}
                    textStyle={styles.skipButton}
                    onPress={onSkipPress}
                />
            </View>
        );
    };
    render() {
        const {
            t,
            styles,
            content,
            images,
            totalContent,
            selectedIndex,
            theme,
            onPressCarouselCard,
        } = this.props;
        return (
            <ScreenContainer noBackground={false} enableScroll={true}>
                <View style={styles.container}>
                    <View style={styles.headingContainer}>
                        {this._renderSkipButton()}
                        <BoldText style={[styles.heading]}>
                            {t('newToHeartfulnessScreen:heading')}
                        </BoldText>
                        <Text style={styles.heartfulnessText}>
                            {t('newToHeartfulnessScreen:byHeartfulness')}
                        </Text>
                    </View>
                    <View style={styles.carouselContainer}>
                        <CarouselCard
                            onPress={onPressCarouselCard}
                            image={images[content.image]}
                            title={content.title}
                            heading={content.heading}
                            headingSuffixHighlightedText={
                                content.headingSuffixHighlightedText
                            }
                            description={content.description}
                        />
                    </View>
                    <PageControl
                        style={styles.pageControl}
                        numberOfPages={totalContent}
                        currentPage={selectedIndex}
                        hidesForSinglePage
                        pageIndicatorTintColor={'#B8B8B8'}
                        indicatorSize={styles.indicatorSize}
                        currentPageIndicatorTintColor={theme.brandPrimary}
                    />
                </View>
                {this._renderProceedButton()}
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        NewToHeartfulnessScreen,
        newHeartfulnessStyle,
        newHeartfulnessImages,
    ),
);
