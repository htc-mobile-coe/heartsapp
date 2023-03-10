import React, { Component } from 'react';
import { Image, Animated, TouchableOpacity, View } from 'react-native';
import { Text, BolderText } from '../../shared';
import { isEqual } from 'lodash';
import { styles as carouselCardStyles } from './BenefitsCarouselCard.styles';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { withTranslation } from 'react-i18next';
import PageControl from 'react-native-page-control';

class BenefitsCarouselCard extends Component {
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
                    duration: 1200,
                    useNativeDriver: true,
                }).start();
            },
        );
    };
    render() {
        const {
            styles,
            image,
            serialNo,
            title,
            description,
            descriptionHighlightedText,
            descriptionSuffix,
            onPress,
            theme,
            totalContent,
            selectedIndex,
        } = this.props;
        const style = [styles.container, { opacity: this.state.opacity }];
        const headingSuffixHighlightedStyle = [
            styles.title,
            styles.descriptionHighlighted,
        ];
        return (
            <Animated.View style={style} needsOffscreenAlphaCompositing>
                <TouchableOpacity
                    style={styles.cardContainer}
                    activeOpacity={1}
                    onPress={onPress}>
                    <View style={styles.headerContainer}>
                        <View>
                            <BolderText
                                style={styles.serialNo}
                                testID={'benefitsCarouselCard-serial--text'}>
                                {serialNo}
                            </BolderText>
                            <View style={styles.serialNoBottomLine} />
                        </View>
                        <Text
                            style={styles.title}
                            testID={'benefitsCarouselCard-title--text'}>
                            {title}
                        </Text>
                    </View>
                    <View style={styles.containerImage}>
                        <Image style={styles.image} source={image} />
                    </View>
                    <Text
                        style={styles.description}
                        testID={'carouselCard-heading--text'}>
                        {description}
                        <BolderText style={headingSuffixHighlightedStyle}>
                            {descriptionHighlightedText}
                        </BolderText>
                        {descriptionSuffix}
                    </Text>
                    <PageControl
                        style={styles.pageControl}
                        numberOfPages={totalContent}
                        currentPage={selectedIndex}
                        hidesForSinglePage
                        pageIndicatorTintColor={'#B8B8B8'}
                        indicatorSize={styles.indicatorSize}
                        currentPageIndicatorTintColor={theme.brandPrimary}
                    />
                </TouchableOpacity>
            </Animated.View>
        );
    }
}

export default withTranslation()(
    withTheme(BenefitsCarouselCard, carouselCardStyles),
);
