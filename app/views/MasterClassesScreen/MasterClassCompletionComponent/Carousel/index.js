import React, { Component } from 'react';
import { Image, Animated, TouchableOpacity, View } from 'react-native';
import { Text, BolderText } from '../../../shared';
import { isEqual, isUndefined } from 'lodash';
import { styles as CarouselStyles } from './Carousel.styles';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import { withTranslation } from 'react-i18next';
import PageControl from 'react-native-page-control';

class Carousel extends Component {
    state = {
        opacity: new Animated.Value(1),
    };

    componentDidUpdate = prevProps => {
        if (!isEqual(prevProps.image, this.props.image)) {
            this._showFadeAnimation();
        }
    };

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

    _renderTitle = () => {
        const { title, styles } = this.props;
        if (!isUndefined(title)) {
            return (
                <BolderText
                    style={styles.title}
                    testID={'Carousel-title--text'}>
                    {title}
                </BolderText>
            );
        }
    };
    _renderMiddleText = () => {
        const { description2 } = this.props;
        if (!isUndefined(description2)) {
            return (
                <Text testID={'Carousel-descriptionMiddle--text'}>
                    {' '}
                    {description2}{' '}
                </Text>
            );
        }
    };
    render() {
        const {
            styles,
            image,
            subTitle,
            description1,
            description3,
            descriptionHighlightedText1,
            descriptionHighlightedText2,
            descriptionFullStop,
            onPress,
            theme,
            noOfCards,
            currentPageIndex,
        } = this.props;
        const style = [styles.container, { opacity: this.state.opacity }];

        return (
            <Animated.View style={style} needsOffscreenAlphaCompositing>
                <TouchableOpacity
                    style={styles.cardContainer}
                    activeOpacity={1}
                    onPress={onPress}>
                    <View style={styles.headerContainer}>
                        {this._renderTitle()}
                        <Text
                            style={styles.subTitle}
                            testID={'Carousel-subTitle--text'}>
                            {subTitle}
                        </Text>
                    </View>
                    <View style={styles.containerImage}>
                        <Image style={styles.image} source={image} />
                    </View>
                    <Text
                        style={styles.description}
                        testID={'Carousel-heading--text'}>
                        {description1}{' '}
                        <BolderText style={styles.descriptionHighlighted}>
                            {descriptionHighlightedText1}
                        </BolderText>
                        {this._renderMiddleText()}
                        <BolderText style={styles.descriptionHighlighted}>
                            {descriptionHighlightedText2}
                        </BolderText>
                        <Text>{descriptionFullStop} </Text>
                        {description3}
                    </Text>
                    <PageControl
                        numberOfPages={noOfCards}
                        currentPage={currentPageIndex}
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

export default withTranslation()(withTheme(Carousel, CarouselStyles));
