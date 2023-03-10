import React, { Component } from 'react';
import { View } from 'native-base';
import { styles } from './SeekerDashboardCard.styles';
import { Image } from 'react-native';
import { BoldText, Text } from '../shared';

export default class SeekerDashboardCard extends Component {
    _renderImage = () => {
        const { imageSource } = this.props;
        return (
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} />
            </View>
        );
    };

    _renderText = () => {
        const { title, value } = this.props;

        return (
            <View style={styles.textContainer}>
                <Text style={styles.titleLabel}>{title}</Text>
                <BoldText style={styles.valueLabel}>{value}</BoldText>
            </View>
        );
    };

    render() {
        return (
            <View style={styles.container}>
                {this._renderText()}
                {this._renderImage()}
            </View>
        );
    }
}
