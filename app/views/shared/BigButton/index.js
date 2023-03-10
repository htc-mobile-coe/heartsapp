import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { styles } from './BigButton.styles';
import { isEmpty, isUndefined } from 'lodash';
import { MediumBoldText, Text } from '../index';

export default class BigButton extends Component {
    _renderImage = () => {
        const { imageSource } = this.props;
        if (!isUndefined(imageSource)) {
            return (
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        resizeMode={'stretch'}
                        style={styles.image}
                    />
                </View>
            );
        }

        return null;
    };

    _renderSubTitle = () => {
        const { subTitle } = this.props;

        if (!isEmpty(subTitle)) {
            return <Text style={styles.subTitle}>{subTitle}</Text>;
        }

        return null;
    };

    _renderText = () => {
        const { title, imageSource, subTitle } = this.props;

        const containerStyle = [styles.textContainer];

        if (isUndefined(imageSource)) {
            containerStyle.push(styles.withImage);
        }

        if (isEmpty(subTitle)) {
            containerStyle.push(styles.noSubtitle);
        }

        return (
            <View style={containerStyle}>
                <MediumBoldText style={styles.title}>{title}</MediumBoldText>
                {this._renderSubTitle()}
            </View>
        );
    };

    render() {
        const { style, testID, onPress } = this.props;
        return (
            <View>
                <TouchableOpacity testID={testID} onPress={onPress}>
                    <View style={[styles.container, style]}>
                        {this._renderImage()}
                        {this._renderText()}
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}
