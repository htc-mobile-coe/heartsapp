import React, { Component } from 'react';
import { Image, Animated, TouchableOpacity, View } from 'react-native';
import { BolderText, Text } from '../../shared';
import { isEqual } from 'lodash';
import { styles as carouselCardStyles } from './CarouselCard.styles';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import ReadMore from 'react-native-read-more-text';
import { withTranslation } from 'react-i18next';
import Button from '../../shared/Button';

class CarouselCard extends Component {
    state = {
        opacity: new Animated.Value(1),
    };

    componentDidUpdate(prevProps, prevState, snapshot): void {
        if (!isEqual(prevProps.image, this.props.image)) {
            this._showFadeAnimation();
        }
    }
    _showFadeAnimation = () => {
        this.setState(
            {
                opacity: new Animated.Value(0.25),
            },
            () => {
                Animated.timing(this.state.opacity, {
                    toValue: 1,
                    duration: 600,
                    useNativeDriver: true,
                }).start();
            },
        );
    };
    _renderTruncatedFooter = handlePress => {
        const { styles, t } = this.props;
        return (
            <Button
                testID={'carouselCard-showMore--button'}
                transparent={true}
                text={t('onboardingCarouselCard:showMore')}
                textStyle={styles.showMoreText}
                onPress={handlePress}
            />
        );
    };

    _renderRevealedFooter = handlePress => {
        const { styles, t } = this.props;
        return (
            <Button
                testID={'carouselCard-showLess--button'}
                transparent={true}
                textStyle={styles.showLessText}
                text={t('onboardingCarouselCard:showLess')}
                onPress={handlePress}
            />
        );
    };
    render() {
        const {
            styles,
            image,
            title,
            headingSuffixHighlightedText,
            heading,
            description,
            onPress,
        } = this.props;
        const style = [styles.container, { opacity: this.state.opacity }];
        const headingSuffixHighlightedStyle = [
            styles.title,
            styles.headingSuffixHighlighted,
        ];
        return (
            <Animated.View style={style} needsOffscreenAlphaCompositing>
                <View style={styles.container} needsOffscreenAlphaCompositing>
                    <View style={styles.bottomCardShadow1} />
                    <View style={styles.bottomCardShadow2} />
                    <TouchableOpacity activeOpacity={1} onPress={onPress}>
                        <View style={styles.cardContainer}>
                            <View style={styles.containerImage}>
                                <Image style={styles.image} source={image} />
                            </View>
                            <Text
                                style={styles.title}
                                testID={'carouselCard-title--text'}>
                                {title}
                            </Text>
                            <BolderText
                                style={styles.heading}
                                testID={'carouselCard-heading--text'}>
                                {heading}
                                <Text style={headingSuffixHighlightedStyle}>
                                    {headingSuffixHighlightedText}
                                </Text>
                            </BolderText>
                            <ReadMore
                                textStyle={styles.description}
                                numberOfLines={3}
                                renderTruncatedFooter={
                                    this._renderTruncatedFooter
                                }
                                renderRevealedFooter={
                                    this._renderRevealedFooter
                                }>
                                {description}
                            </ReadMore>
                        </View>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        );
    }
}

export default withTranslation()(withTheme(CarouselCard, carouselCardStyles));
