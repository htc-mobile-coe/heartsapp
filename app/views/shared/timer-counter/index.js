import React, { Component } from 'react';
import { StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { View } from 'native-base';
import Images from '../Images';
import { MediumBoldText } from '../';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

class TimerCounter extends Component {
    _renderWatchImage = () => {
        const { disableWatchImage, styles, images } = this.props;
        if (!disableWatchImage) {
            return <Image style={styles.icon} source={images.watchIcon} />;
        }
    };

    _renderMinutesText = () => {
        const { unit, styles, unitStyle } = this.props;
        if (unit) {
            return (
                <MediumBoldText style={[styles.timerMinutes, unitStyle]}>
                    {unit}
                </MediumBoldText>
            );
        }
    };

    render() {
        const { textStyle, value, styles } = this.props;
        return (
            <View style={styles.container}>
                {this._renderWatchImage()}
                <MediumBoldText style={textStyle}>{value}</MediumBoldText>
                {this._renderMinutesText()}
            </View>
        );
    }
}

const timerStyle = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        icon: { marginEnd: 4, tintColor: 'black' },
        timerMinutes: {
            marginLeft: 5,
            paddingVertical: 5,
            color: props.lightTextColor,
        },
    });

TimerCounter.propTypes = {
    value: PropTypes.string,
    unit: PropTypes.string,
    textStyle: PropTypes.array,
    disableWatchImage: PropTypes.bool,
};
TimerCounter.defaultProps = {
    textStyle: [],
    disableWatchImage: false,
};
export default withTheme(TimerCounter, timerStyle, Images);
