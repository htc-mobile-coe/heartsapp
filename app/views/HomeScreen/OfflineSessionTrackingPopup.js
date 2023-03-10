import React, { Component } from 'react';
import { styles as OfflineSessionTrackingPopupStyles } from './OfflineSessionTrackingPopup.styles';
import { View } from 'native-base';
import { Text, MediumBoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Close } from '../shared/Icon';
import { TouchableOpacity, Image } from 'react-native';
import offlineSessionTrackingPopupImages from './img';
import Modal from 'react-native-modal';

class OfflineSessionTrackingPopup extends Component {
    _renderHeader = () => {
        const { t, styles, onClosePress } = this.props;

        return (
            <View style={styles.headerStyle}>
                <View style={styles.closeButtonContainer}>
                    <TouchableOpacity
                        onPress={onClosePress}
                        testID="offlineSessionTrackingPopup__closeIcon--touchableOpacity">
                        <Close style={styles.closeIcon} />
                    </TouchableOpacity>
                </View>
                <MediumBoldText style={styles.heading}>
                    {t('offlineSessionTrackingPopup:heading')}
                </MediumBoldText>
            </View>
        );
    };

    _renderButtons = () => {
        const {
            t,
            styles,
            onTrackPastSessionPress,
            onTrackNowPress,
            images,
        } = this.props;

        return (
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={onTrackPastSessionPress}
                    testID="offlineSessionTrackingPopup__onTrackPastSessionPress--touchableOpacity">
                    <Image
                        source={images.trackPastSession}
                        style={styles.image}
                        testID="offlineSessionTrackingPopup__trackPastSession--image"
                    />

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            {t('offlineSessionTrackingPopup:trackPastSession')}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.button}
                    onPress={onTrackNowPress}
                    testID="offlineSessionTrackingPopup__onTrackNowPress--touchableOpacity">
                    <Image
                        source={images.trackNow}
                        style={styles.image}
                        testID="offlineSessionTrackingPopup__trackNow--image"
                    />

                    <View style={styles.titleContainer}>
                        <Text style={styles.title}>
                            {t('offlineSessionTrackingPopup:trackNow')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const { styles, show } = this.props;

        return (
            <Modal isVisible={show} style={styles.offlineSessionTrackingModal}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    {this._renderButtons()}
                </View>
            </Modal>
        );
    }
}

export default withTranslation()(
    withTheme(
        OfflineSessionTrackingPopup,
        OfflineSessionTrackingPopupStyles,
        offlineSessionTrackingPopupImages,
    ),
);
