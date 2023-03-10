import React, { Component } from 'react';
import { Image } from 'react-native';
import { View } from 'native-base';
import { styles as MasterClassesVideoInfoStyles } from './MasterClassesVideoInfo.styles';
import VideoCard from './VideoCard';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import { MASTERCLASS_VIDEOS } from 'app/shared/Constants';
import { isEqual, find, isNull } from 'lodash';
import Images from '../img';
import { Locked, Circle } from '../../../shared/Icon';
import MasterClassVideoInfoImages from './img';

class MasterClassesVideoInfo extends Component {
    _renderVideoCard = (masterClassId, isFirstCard, isLastCard) => {
        const {
            styles,
            masterClassesData,
            unlockedState,
            takenIntroSittings,
            onMasterClassProgressSummaryVideoCardPress,
        } = this.props;
        const {
            videoInfoTitle,
            videoInfoSubTitle,
            duration,
            videoThumbnailURL,
            progressSummaryToastMessage,
        } = find(masterClassesData, {
            id: masterClassId,
        });
        const locked = !(
            unlockedState[masterClassId] ||
            takenIntroSittings ||
            isFirstCard
        );

        return (
            <View style={styles.progressStyle}>
                {this._renderProgressLine(
                    masterClassId,
                    isFirstCard,
                    isLastCard,
                )}
                <View style={styles.videoCardStyle}>
                    <VideoCard
                        videoInfoTitle={videoInfoTitle}
                        videoInfoSubTitle={videoInfoSubTitle}
                        duration={duration}
                        isFirstCard={isFirstCard}
                        videoThumbnailURL={Images[videoThumbnailURL]}
                        locked={locked}
                        masterClassId={masterClassId}
                        progressSummaryToastMessage={
                            progressSummaryToastMessage
                        }
                        onMasterClassProgressSummaryVideoCardPress={
                            onMasterClassProgressSummaryVideoCardPress
                        }
                    />
                </View>
            </View>
        );
    };

    _renderProgressLine = (masterClassId, isFirstCard, isLastCard) => {
        const { styles } = this.props;
        const startDottedLineStyle = isFirstCard
            ? styles.disableDottedLine
            : styles.dottedLine;
        const endDottedLineStyle = isLastCard
            ? styles.disableDottedLine
            : styles.dottedLine;
        return (
            <View style={styles.progressStatusStyle}>
                <View style={styles.progressLineStyle}>
                    <View style={startDottedLineStyle} />
                </View>
                {this._renderCircleIcon(masterClassId)}
                {this._renderMeditatorImage(masterClassId)}
                {this._renderLockIcon(masterClassId)}
                <View style={styles.progressLineStyle}>
                    <View style={endDottedLineStyle} />
                </View>
            </View>
        );
    };

    _renderCircleIcon = masterClassId => {
        const {
            styles,
            masterClassesFinishedDates,
            unlockedState,
            takenIntroSittings,
        } = this.props;
        const locked = !(unlockedState.masterClassId || takenIntroSittings);
        if (!locked || !isNull(masterClassesFinishedDates[masterClassId])) {
            return <Circle style={styles.circleIconStyle} />;
        }
    };

    _renderMeditatorImage = masterClassId => {
        const {
            styles,
            masterClassesFinishedDates,
            unlockedState,
            takenIntroSittings,
            images,
        } = this.props;
        if (
            !takenIntroSittings &&
            unlockedState[masterClassId] &&
            isNull(masterClassesFinishedDates[masterClassId])
        ) {
            return (
                <Image
                    source={images.meditator}
                    style={styles.meditatorIconStyle}
                    testID='masterClassesVideoInfo__meditatorImage--image'
                />
            );
        }
    };

    _renderLockIcon = masterClassId => {
        const { styles, unlockedState, takenIntroSittings } = this.props;
        const isFirstCard = isEqual(
            masterClassId,
            MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS,
        );
        const locked = !(
            unlockedState[masterClassId] ||
            takenIntroSittings ||
            isFirstCard
        );
        if (locked) {
            return <Locked style={styles.lockIconStyle} testID='masterClassesVideoInfo__locked--icon'/>;
        }
    };

    render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                {this._renderVideoCard(
                    MASTERCLASS_VIDEOS.INTRO_TO_MASTERCLASS,
                    true,
                    false,
                )}
                {this._renderVideoCard(MASTERCLASS_VIDEOS.DAY1, false, false)}
                {this._renderVideoCard(MASTERCLASS_VIDEOS.DAY2, false, false)}
                {this._renderVideoCard(MASTERCLASS_VIDEOS.DAY3, false, true)}
            </View>
        );
    }
}

export default withTheme(
    MasterClassesVideoInfo,
    MasterClassesVideoInfoStyles,
    MasterClassVideoInfoImages,
);
