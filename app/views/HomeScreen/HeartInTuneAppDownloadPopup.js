import React, { Component } from 'react';
import { styles as HeartInTuneAppDownloadPopupStyles } from './HeartInTuneAppDownloadPopup.styles';
import { View } from 'native-base';
import { Text, BoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Close } from '../shared/Icon';
import { TouchableOpacity, Image } from 'react-native';
import HeartInTuneAppDownloadPopupImages from './img';

class HeartInTuneAppDownloadPopup extends Component {
    _renderHeader = () => {
        const { styles, onClosePress } = this.props;

        return (
            <View style={styles.closeButtonContainer}>
                <TouchableOpacity
                    onPress={onClosePress}
                    testID="heartInTuneAppDownloadPopup__closeIcon--touchableOpacity">
                    <Close style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    _renderBodyContainer = () => {
        const { t, styles, onDownloadNowPress, images } = this.props;

        return (
            <View style={styles.bodyContainer}>
                <Image
                    source={images.heartInTuneLogo}
                    style={styles.image}
                    testID="heartInTuneAppDownloadPopup__heartInTuneLogo--image"
                />
                <View style={styles.separator} />
                <View style={styles.rightContainer}>
                    <BoldText style={styles.heading}>
                        {t('heartInTuneAppDownloadPopup:heading')}
                    </BoldText>

                    <Text style={styles.content}>
                        {t('heartInTuneAppDownloadPopup:content')}
                    </Text>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={onDownloadNowPress}
                        testID="heartInTuneAppDownloadPopup__onDownloadNow--touchableOpacity">
                        <BoldText style={styles.title}>
                            {t('heartInTuneAppDownloadPopup:downloadNow')}
                        </BoldText>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderBodyContainer()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        HeartInTuneAppDownloadPopup,
        HeartInTuneAppDownloadPopupStyles,
        HeartInTuneAppDownloadPopupImages,
    ),
);
