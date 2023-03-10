import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Avatar } from 'native-base';
import { Text } from '../../../shared';
import { map } from 'lodash';
import { styles as masterClassesIntroStyles } from './MasterClassesIntro.styles';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import { Button } from '../../../shared';
import {
    Info,
    FavoriteBorder as BulletIcon,
    ChevronUp as UpArrowIcon,
} from '../../../shared/Icon';
import BackButton from '../../../shared/BackButton';

class MasterClassesIntro extends Component {
    _renderHeadingContainer = () => {
        const { styles, onBackPress, onMasterClassProgressSummaryInfoPress } =
            this.props;

        return (
            <View style={styles.headerContainer}>
                <View style={styles.headerBackButtonContainer}>
                    <BackButton
                        style={styles.backButton}
                        onBackPress={onBackPress}
                        testID="masterClassesIntro_back--button"
                    />
                </View>
                <View style={styles.headerInfoContainer}>
                    <TouchableOpacity
                        testID="masterClassesIntro_info--button"
                        style={styles.infoButton}
                        onPress={onMasterClassProgressSummaryInfoPress}>
                        <Info style={styles.infoIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    _renderPointContent = (item, index) => {
        const { styles } = this.props;
        return (
            <View key={index} style={styles.pointContainer}>
                <BulletIcon style={styles.bulletinPointStyle} />
                <Text style={styles.textStyle}>{item}</Text>
            </View>
        );
    };
    _renderPoints = () => {
        const { points } = this.props;
        return map(points, this._renderPointContent);
    };

    _renderCollapsedIntro = () => {
        const {
            styles,
            meetDaajiButtonTitle,
            daajiSmallIcon,
            showExpandedIntroView,
            onMeetDaajiButtonPress,
        } = this.props;
        if (!showExpandedIntroView) {
            return (
                <View style={styles.collapsedIntroContainer}>
                    <Avatar
                        small
                        source={daajiSmallIcon}
                        style={styles.thumbnail}
                    />
                    <View style={styles.meetDaajiButtonContainer}>
                        <Button
                            rounded={true}
                            style={styles.meetDaajiButton}
                            textStyle={styles.buttonTextStyle}
                            onPress={onMeetDaajiButtonPress}
                            text={meetDaajiButtonTitle}
                            testID="masterClassesIntro__meetDaaji--button"
                        />
                    </View>
                </View>
            );
        }
    };

    _renderExpandedIntro = () => {
        const {
            styles,
            daajiLargeIcon,
            infoAboutDaaji,
            introAboutDaaji,
            onToggleUpButtonPress,
            showExpandedIntroView,
        } = this.props;
        if (showExpandedIntroView) {
            return (
                <View style={styles.expandedIntroContainer}>
                    <View style={styles.infoContainer}>
                        <Avatar
                            large
                            source={daajiLargeIcon}
                            style={styles.thumbnailLarge}
                        />
                        <View style={styles.infoTextContainer}>
                            <Text style={styles.infoText}>
                                {infoAboutDaaji}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.introContainer}>
                        <Text style={styles.introText}>{introAboutDaaji}</Text>
                    </View>
                    <View style={styles.arrowButtonContainer}>
                        <TouchableOpacity
                            testID="masterClassesIntro_arrowUp--button"
                            onPress={onToggleUpButtonPress}>
                            <UpArrowIcon style={styles.arrowUp} />
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    };

    render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                {this._renderHeadingContainer()}
                <View style={styles.introductionContainer}>
                    {this._renderPoints()}
                    {this._renderCollapsedIntro()}
                    {this._renderExpandedIntro()}
                </View>
            </View>
        );
    }
}

export default withTheme(MasterClassesIntro, masterClassesIntroStyles);
