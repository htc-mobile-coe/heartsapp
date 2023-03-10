import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, StatusBar, ScrollView, SafeAreaView } from 'react-native';
import { Text, MediumBoldText } from '../../shared/Text';
import { withTranslation } from 'react-i18next';
import { styles as masterClassInfoStyles } from './MasterClassInfo.styles';
import masterClassInfoImages from './img';
import { withTheme } from '../../../styles/theme/WithThemeHOC';
import { map } from 'lodash';
import { FavoriteBorder as FavoriteBorderIcon } from '../../shared/Icon';
import BackButton from '../../shared/BackButton';

export class MasterClassInfo extends Component {
    _renderContent = () => {
        const { styles, images, headingText } = this.props;
        return (
            <View style={styles.contentContainer}>
                <View style={styles.imageContainer}>
                    <Image source={images.headerImage} style={styles.image} />
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
    _renderPoints = points => {
        return map(points, this._renderPointContent);
    };
    _renderSections = () => {
        const {
            styles,
            firstSectionPoints,
            secondSectionPoints,
            firstSectionTitle,
            secondSectionTitle,
        } = this.props;
        return (
            <View>
                <View style={styles.sectionHeader}>
                    <MediumBoldText style={styles.sectionTitle}>
                        {firstSectionTitle}
                    </MediumBoldText>
                    {this._renderPoints(firstSectionPoints)}
                </View>
                <View style={styles.seperatorStyle} />
                <View style={styles.sectionHeader}>
                    <MediumBoldText style={styles.sectionTitle}>
                        {secondSectionTitle}
                    </MediumBoldText>
                    {this._renderPoints(secondSectionPoints)}
                </View>
            </View>
        );
    };
    _renderHeader = () => {
        const { styles, onBackPress, title } = this.props;
        return (
            <View style={styles.headerStyle}>
                <View style={styles.headerBackButtonContainer}>
                    <BackButton
                        style={styles.backButton}
                        onBackPress={onBackPress}
                    />
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
            <SafeAreaView style={styles.main}>
                <ScrollView contentContainerStyle={styles.main}>
                    <StatusBar hidden={false} />
                    {this._renderHeader()}
                    <View style={styles.container}>
                        {this._renderContent()}
                        {this._renderSections()}
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

export default withTranslation()(
    withTheme(MasterClassInfo, masterClassInfoStyles, masterClassInfoImages),
);
