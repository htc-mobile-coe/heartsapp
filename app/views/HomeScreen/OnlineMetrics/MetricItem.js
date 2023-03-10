import React, { Component } from 'react';
import { View } from 'native-base';
import { styles as metricItemStyles } from './MetricItem.styles';
import { MediumBoldText, BoldText } from '../../shared';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

class MetricItem extends Component {
    _renderText = () => {
        const { value, styles } = this.props;
        return <BoldText style={styles.metricText}>{value}</BoldText>;
    };
    render() {
        const { title, containerStyle, styles } = this.props;
        const contentContainerStyle = [styles.container, containerStyle];

        return (
            <View style={contentContainerStyle}>
                <View style={styles.circle}>{this._renderText()}</View>
                <View style={styles.metricTitleContainer}>
                    <MediumBoldText style={styles.metricTitleText}>
                        {title}
                    </MediumBoldText>
                </View>
            </View>
        );
    }
}
export default withTheme(MetricItem, metricItemStyles);
