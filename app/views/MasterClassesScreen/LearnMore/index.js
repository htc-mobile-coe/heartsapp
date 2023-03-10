import React, { Component } from 'react';
import { View } from 'native-base';
import {
    Image,
    TouchableOpacity,
    StatusBar,
    ScrollView,
    SafeAreaView,
} from 'react-native';
import { Text, MediumBoldText } from '../../shared/Text';
import { withTranslation } from 'react-i18next';
import { styles as learnMoreStyles } from './LearnMore.styles';
import learnMoreImages from './img';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { map } from 'lodash';
import {
    ArrowLeft,
    FavoriteBorder as FavoriteBorderIcon,
} from '../../shared/Icon';
export class LearnMore extends Component {
    _renderContent = () => {
        const { styles, images, headingText } = this.props;
        return (
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <Image source={images.learnMore} style={styles.image} />
                </View>
                <MediumBoldText style={styles.headingText}>
                    {headingText}
                </MediumBoldText>
            </View>
        );
    };
    _renderPointContent = (item, index) => {
        const { styles } = this.props;
        return (
            <View key={index} style={styles.pointContainer}>
                <FavoriteBorderIcon style={styles.iconStyle} />

                <Text style={styles.textStyle}>{item.point}</Text>
            </View>
        );
    };
    _renderPoints = () => {
        const { points } = this.props;
        return map(points, this._renderPointContent);
    };
    _renderText = () => {
        const { styles, contentText } = this.props;
        return <Text style={styles.contentText}>{contentText}</Text>;
    };
    _renderHeader = () => {
        const { styles, onLearnMoreBackPress, title } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerBackButtonContainer}>
                    <TouchableOpacity
                        testID="learnMore_back--button"
                        style={styles.backButton}
                        onPress={onLearnMoreBackPress}>
                        <ArrowLeft style={styles.leftArrowIcon} />
                    </TouchableOpacity>
                </View>
                <View style={styles.centerContainer}>
                    <MediumBoldText style={styles.headerText}>
                        {title}
                    </MediumBoldText>
                </View>
                <View style={styles.headerRightContainer} />
            </View>
        );
    };

    render() {
        const { styles } = this.props;
        return (
            <SafeAreaView style={styles.mainView}>
                <ScrollView contentContainerStyle={styles.scrollView}>
                    <StatusBar hidden={false} />
                    {this._renderHeader()}
                    <View style={styles.container}>
                        {this._renderContent()}
                        {this._renderText()}
                        {this._renderPoints()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default withTranslation()(
    withTheme(LearnMore, learnMoreStyles, learnMoreImages),
);
