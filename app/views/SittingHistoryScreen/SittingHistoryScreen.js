import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';

import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHistoryStyles } from './SittingHistoryScreen.styles';

import ScreenContainer from '../shared/ScreenContainer';
import sittingHistoryImages from './img';
import SittingList from './SittingList';
import ModalView from 'react-native-modal';
import ShareHistoryPopup from './ShareHistoryPopup';
import { Button } from '../shared';
import { Text } from '../shared/Text';

class SittingHistoryScreen extends Component {
    _renderEmptyList = () => {
        const { t, styles, images } = this.props;
        return (
            <View style={styles.noRecordsView}>
                <View style={styles.noRecordsFoundImageView}>
                    <Image
                        source={images.noRecordsFound}
                        style={styles.noRecordsFoundImage}
                        testID="sittingHistoryScreen__noRecordsFound--image"
                    />
                </View>
                <Text style={styles.noRecordsFoundText}>
                    {t('sittingHistoryScreen:noRecordsFound')}
                </Text>
            </View>
        );
    };
    _renderSittingHistoryList = () => {
        const {
            sittingList,
            diaryEntry,
            selectedIndex,
            onListItemSelected,
            hasMore,
            onLoadMore,
        } = this.props;
        return (
            <SittingList
                {...this.props}
                data={sittingList}
                selectedIndex={selectedIndex}
                diaryEntry={diaryEntry}
                renderEmptyList={this._renderEmptyList}
                onListItemSelected={onListItemSelected}
                onLoadMore={onLoadMore}
                hasMore={hasMore}
            />
        );
    };
    _renderShareButton = () => {
        const { t, styles, onShareButtonPress, sittingList } = this.props;
        if (sittingList.length > 0) {
            return (
                <View style={styles.shareButtonContainer}>
                    <Button
                        rounded={true}
                        style={styles.shareButton}
                        onPress={onShareButtonPress}
                        text={t('sittingHistoryScreen:shareSessionHistory')}
                        testID="sittingHistory__share--button"
                    />
                </View>
            );
        }
        return null;
    };
    _renderAddSittingHistoryButton = () => {
        const {
            styles,
            images,
            isOutsideHeartsAppSelected,
            onAddSittingHistoryButtonPress,
        } = this.props;

        if (isOutsideHeartsAppSelected) {
            return (
                <View style={styles.addSittingHistoryButtonContainer}>
                    <TouchableOpacity
                        testID="sittingHistoryScreen__addOfflineSittingDetails--button"
                        onPress={onAddSittingHistoryButtonPress}>
                        <Image
                            source={images.add}
                            style={styles.addSittingHistoryButtonStyle}
                            testID="sittingHistoryScreen__addSittingHistory--image"
                        />
                    </TouchableOpacity>
                </View>
            );
        }
    };
    render() {
        const {
            styles,
            showShareHistoryPopup,
            isApplicationServerReachable,
            onSharePreceptorHistorySendPress,
            onSharePreceptorHistorySkipPress,
            showSuccessMessage,
            choosenEmail,
            showShareHisoryLoader,
            userEmail,
        } = this.props;

        return (
            <ScreenContainer enableScroll={false}>
                {this._renderSittingHistoryList()}
                {this._renderAddSittingHistoryButton()}
                {this._renderShareButton()}
                <ModalView
                    avoidKeyboard={true}
                    testID="sittingHistoryScreen-shareHistory"
                    isVisible={showShareHistoryPopup}
                    style={styles.shareHistoryModalStyle}>
                    <ShareHistoryPopup
                        userEmail={userEmail}
                        isApplicationServerReachable={
                            isApplicationServerReachable
                        }
                        onSharePreceptorHistorySkipPress={
                            onSharePreceptorHistorySkipPress
                        }
                        onSubmit={onSharePreceptorHistorySendPress}
                        showSuccessMessage={showSuccessMessage}
                        choosenEmail={choosenEmail}
                        showShareHisoryLoader={showShareHisoryLoader}
                    />
                </ModalView>
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(SittingHistoryScreen, sittingHistoryStyles, sittingHistoryImages),
);
