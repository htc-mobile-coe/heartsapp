import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHeaderStyles } from './SittingHistoryHeader.styles';
import { Text } from '../shared/Text';
import sittingHistoryImages from './img';

class DeliveryMode extends Component {
    render() {
        const { title, onDeliveryModeSelect, isActive, styles } = this.props;
        const viewStyle = isActive
            ? styles.deliveryModeActiveView
            : styles.deliveryModeInactiveView;
        const textStyle = isActive
            ? styles.deliveryModeActiveText
            : styles.deliveryModeInactiveText;

        return (
            <TouchableOpacity
                onPress={onDeliveryModeSelect}
                testID="deliveryMode--selectDeliveryMode-button">
                <View style={viewStyle}>
                    <Text style={textStyle}>{title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

export default withTheme(
    DeliveryMode,
    sittingHeaderStyles,
    sittingHistoryImages,
);
