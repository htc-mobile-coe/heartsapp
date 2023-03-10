import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { styles } from './BigCardButton.styles';
import { BoldText } from '../../shared';
import LinearGradient from 'react-native-linear-gradient';

export default class BigCardButton extends Component {
    _renderImage = () => {
        const { imageSource } = this.props;
        return (
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} />
            </View>
        );
    };

    _renderText = () => {
        const { title } = this.props;

        return (
            <View style={styles.textContainer}>
                <BoldText style={styles.title}>{title}</BoldText>
            </View>
        );
    };

    _renderChildren = () => {
        const { style, backgroundColor } = this.props;
        return (
            <View style={[styles.container, style, { backgroundColor }]}>
                {this._renderText()}
                {this._renderImage()}
            </View>
        );
    };
    _renderWithBackgroundGradient = () => {
        const { style } = this.props;
        return (
            <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={['#29A5F2', '#B86FDE']}
                style={[styles.container, style]}>
                {this._renderText()}
                {this._renderImage()}
            </LinearGradient>
        );
    };

    render() {
        const { hasGradientBackground, onPress } = this.props;
        const _render = hasGradientBackground
            ? this._renderWithBackgroundGradient
            : this._renderChildren;
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.9}>
                {_render()}
            </TouchableOpacity>
        );
    }
}
