import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { View } from 'native-base';
import { styles as masterClassVideoCardStyle } from './MasterClassVideoPreview.styles';
import { Play } from '../../../shared/Icon';
import CenterView from '../../../shared/CenterView';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import { MediumBoldText, Text } from '../../../shared';
import { withTranslation } from 'react-i18next';

class MasterClassVideoPreview extends Component {
    _handleIconPress = () => {
        const { onPlayPress, data } = this.props;
        onPlayPress(data);
    };

    _renderDurationContainer = () => {
        const { styles, duration, t } = this.props;

        return (
            <View style={styles.durationContainer}>
                <Text>
                    <MediumBoldText
                        style={styles.durationText}
                        testID={'masterClassVideoPreview-duration--text'}>
                        {t('masterClassesScreen:duration')}
                    </MediumBoldText>{' '}
                    <MediumBoldText
                        style={styles.durationTime}
                        testID={'masterClassVideoPreview-durationTime--text'}>
                        {duration}
                    </MediumBoldText>
                </Text>
            </View>
        );
    };

    _renderPlayIcon = () => {
        const { styles } = this.props;
        return (
            <TouchableOpacity
                onPress={this._handleIconPress}
                testID="masterClassVideoPreview_play--button"
                style={styles.iconCircle}>
                <Play style={styles.icon} />
            </TouchableOpacity>
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

    render() {
        const { styles } = this.props;

        return (
            <View style={styles.container}>
                {this._renderVideoPreview()}
                {this._renderDurationContainer()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(MasterClassVideoPreview, masterClassVideoCardStyle),
);
