import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { styles as TileBoxStyles } from './TileBox.styles';
import { Text } from '../shared/Text';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import tileBoxImages from './img';
class TileBox extends Component {
    _renderImage = () => {
        const { imageSource, styles } = this.props;

        return (
            <View style={styles.imageContainer}>
                <Image source={imageSource} style={styles.image} />
            </View>
        );
    };

    _renderText = () => {
        const { title, styles } = this.props;

        const containerStyle = [styles.textContainer];

        return (
            <View style={containerStyle}>
                <Text style={styles.title}>{title}</Text>
            </View>
        );
    };

    _renderSelectedTick = () => {
        const { styles, images, isSelected } = this.props;

        if (isSelected) {
            return (
                <View style={styles.iconContainer}>
                    <Image source={images.tick} style={styles.tickImage} />
                </View>
            );
        }
    };
    _handlePress = () => {
        const { onPress, id, isSelected } = this.props;
        onPress(id, isSelected);
    };
    render() {
        const { styles } = this.props;
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.buttonContainer}
                    onPress={this._handlePress}>
                    {this._renderImage()}
                    {this._renderText()}
                    {this._renderSelectedTick()}
                </TouchableOpacity>
            </View>
        );
    }
}
export default withTheme(TileBox, TileBoxStyles, tileBoxImages);
