import React, { Component } from 'react';
import { styles as HeartInTuneBannerStyles } from './HeartInTuneBanner.styles';
import { View } from 'native-base';
import { MediumBoldText, BoldText } from '../shared';
import { withTranslation } from 'react-i18next';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import { Close } from '../shared/Icon';
import { TouchableOpacity, Image } from 'react-native';
import HeartInTuneBannerImages from './img';

class HeartInTuneBanner extends Component {
    _renderHeader = () => {
        const { styles, onClosePress } = this.props;

        return (
            <View style={styles.closeButtonContainer}>
                <TouchableOpacity
                    onPress={onClosePress}
                    testID="heartInTuneBanner__closeIcon--touchableOpacity">
                    <Close style={styles.closeIcon} />
                </TouchableOpacity>
            </View>
        );
    };

    _renderBodyContainer = () => {
        const { t, styles, images } = this.props;

        return (
            <View style={styles.bodyContainer}>
                <Image
                    source={images.heartInTuneLogo}
                    style={styles.image}
                    testID="heartInTuneBanner__heartInTuneLogo--image"
                />

                <MediumBoldText style={styles.content}>
                    {t('heartInTuneBanner:content')}
                </MediumBoldText>
            </View>
        );
    };

    _renderBottomContainer = () => {
        const { t, styles, onDownloadNowPress } = this.props;
        return (
            <TouchableOpacity
                style={styles.button}
                onPress={onDownloadNowPress}
                testID="heartInTuneBanner__onDownloadNow--touchableOpacity">
                <BoldText style={styles.title}>
                    {t('heartInTuneBanner:downloadNow')}
                </BoldText>
            </TouchableOpacity>
        );
    };

    render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this._renderHeader()}
                {this._renderBodyContainer()}
                {this._renderBottomContainer()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        HeartInTuneBanner,
        HeartInTuneBannerStyles,
        HeartInTuneBannerImages,
    ),
);
