import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { styles as TileBoxStyles } from './TrainersSectionScreen.styles';
import { MediumBoldText, Text } from '../shared/Text';
import { withTheme } from '../../styles/theme/WithThemeHOC';
import TileBoxImages from './img';
class TileBox extends Component {
    _handlePress = () => {
        const { onPress, id } = this.props;
        onPress(id);
    };
    render() {
        const { imageSource, styles, title, subTitle, disable } = this.props;
        const disableStyle = disable ? styles.disbleButtonContainer : {};
        const disableImage = disable ? styles.imageDisabled : {};
        const activeOpacity = disable ? 1 : 0.7;
        return (
            <View style={styles.tileContainer}>
                <TouchableOpacity
                    style={[styles.buttonContainer, disableStyle]}
                    activeOpacity={activeOpacity}
                    onPress={this._handlePress}>
                    <View>
                        <View style={styles.imageContainer}>
                            <Image
                                source={imageSource}
                                style={[styles.image, disableImage]}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <MediumBoldText style={styles.title}>
                                {title}
                            </MediumBoldText>
                            <Text style={styles.subTitle}>{subTitle}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
export default withTheme(TileBox, TileBoxStyles, TileBoxImages);
