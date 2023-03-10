import React, { Component } from 'react';
import { Image } from 'react-native';
import SharedImages from '../Images';
import { styles as TimerStyle } from './Timer.styles';
import { MediumBoldText } from '../Text';
import { View } from 'native-base';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { isEmpty } from 'lodash';

class Timer extends Component {
    _renderWatchImage = () => {
        const { styles, imageIconStyle, showWatchImage, images } = this.props;
        if (showWatchImage) {
            return (
                <Image
                    style={[styles.icon, imageIconStyle]}
                    source={images.watchIcon}
                />
            );
        }
    };

    _renderMinutesText = () => {
        const { styles, unit, timerMinutesStyle } = this.props;

        if (unit) {
            return (
                <MediumBoldText
                    style={[styles.timerMinutes, timerMinutesStyle]}>
                    {unit}
                </MediumBoldText>
            );
        }
    };

    render() {
        const { styles, textStyle, value } = this.props;
        if (isEmpty(value)) {
            return null;
        }
        return (
            <View style={styles.container} testID={'timer_container-view'}>
                <View style={styles.timerContainer}>
                    {this._renderWatchImage()}
                    <MediumBoldText style={textStyle}>{value}</MediumBoldText>
                </View>
                {this._renderMinutesText()}
            </View>
        );
    }
}

export default withTheme(Timer, TimerStyle, SharedImages);
