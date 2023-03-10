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
        const { title, styles, isSelected } = this.props;
        const titleStyle = isSelected ? styles.title : styles.disabledTitle;
        return (
            <View>
                <Text style={titleStyle}>{title}</Text>
            </View>
        );
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
                </TouchableOpacity>
            </View>
        );
    }
}
export default withTheme(TileBox, TileBoxStyles, tileBoxImages);
