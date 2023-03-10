import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { styles as VideoCardStyle } from './VideoCard.styles';
import { View } from 'native-base';
import { MediumBoldText, Text, BoldText } from '../../../shared';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import CenterView from '../../../shared/CenterView';
import { Locked, Play, Clock } from '../../../shared/Icon';

class VideoCard extends Component {
    _handleVideoCardPress = () => {
        const {
            onMasterClassProgressSummaryVideoCardPress,
            masterClassId,
            locked,
            progressSummaryToastMessage,
        } = this.props;
        onMasterClassProgressSummaryVideoCardPress(
            masterClassId,
            locked,
            progressSummaryToastMessage,
        );
    };
    _renderPlayIcon = () => {
        const { styles, locked } = this.props;
        if (locked) {
            return (
                <View style={styles.iconCircle} testID="videoCard_lock--icon">
                    <Locked style={styles.lockIcon} />
                </View>
            );
        }
        return (
            <View style={styles.iconCircle} testID="videoCard_play--icon">
                <Play style={styles.icon} />
            </View>
        );
    };

    _renderVideoPreview = () => {
        const { videoThumbnailURL, styles } = this.props;
        return (
            <View>
                <Image source={videoThumbnailURL} style={styles.imageStyle} />
                <View style={styles.iconContainer}>
                    <CenterView>{this._renderPlayIcon()}</CenterView>
                </View>
            </View>
        );
    };

    _renderTitle = () => {
        const { styles, isFirstCard, videoInfoTitle } = this.props;
        if (isFirstCard) {
            return (
                <MediumBoldText style={styles.primaryColorText}>
                    {videoInfoTitle}
                </MediumBoldText>
            );
        }
        return (
            <BoldText style={styles.highlightedText}>{videoInfoTitle}</BoldText>
        );
    };

    render = () => {
        const { styles, videoInfoSubTitle, duration, isFirstCard } = this.props;

        const horizontalLineStyle = isFirstCard
            ? styles.disabledHorizontalLine
            : styles.horizontalLine;
        return (
            <View>
                <TouchableOpacity
                    onPress={this._handleVideoCardPress}
                    activeOpacity={0.9}
                    testID="videoCard_play--button">
                    <View style={styles.rowContainer}>
                        <View style={styles.titleContainer}>
                            {this._renderTitle()}
                            <View style={horizontalLineStyle} />
                            <Text style={styles.subTitleText}>
                                {videoInfoSubTitle}
                            </Text>
                            <View style={styles.durationContainer}>
                                <Clock style={styles.clockIcon} />
                                <Text style={styles.durationText}>
                                    {duration}
                                </Text>
                            </View>
                        </View>
                        <View>{this._renderVideoPreview()}</View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
}

export default withTheme(VideoCard, VideoCardStyle);
