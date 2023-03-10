import React, { Component } from 'react';
import {
    styles,
    backgroundInactiveColor,
    circleInActiveColor,
} from './StatusSwitch.styles';
import { MediumBoldText } from '../shared';
import { View } from 'native-base';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import Switch from 'app/views/shared/Switch';

class StatusSwitch extends Component {
    render() {
        const {
            value,
            onValueChange,
            disabled,
            textStyle,
            text,
            theme,
        } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.textContainer}>
                    <MediumBoldText style={[textStyle, styles.statusTextStyle]}>
                        {text}
                    </MediumBoldText>
                </View>
                <View style={styles.switchContainer}>
                    <Switch
                        value={value}
                        onValueChange={onValueChange}
                        disabled={disabled}
                        backgroundActiveColor={theme.lightPrimary}
                        backgroundInActiveColor={backgroundInactiveColor}
                        circleActiveColor={theme.brandPrimary}
                        circleInActiveColor={circleInActiveColor}
                    />
                </View>
            </View>
        );
    }
}

export default withTheme(StatusSwitch);
