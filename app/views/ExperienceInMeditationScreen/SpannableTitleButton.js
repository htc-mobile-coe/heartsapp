import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { styles as SpannableTitleButtonStyle } from './SpannableTitleButton.styles';
import { View } from 'native-base';
import { BoldText } from '../shared/Text';
import { Text } from '../shared';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class SpannableTitleButton extends Component {
    render = () => {
        const {
            styles,
            startText,
            endText,
            highlightedText,
            imageSource,
            onPress,
        } = this.props;
        return (
            <View>
                <TouchableOpacity onPress={onPress}>
                    <View style={styles.rowContainer}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={imageSource}
                                resizeMode={'stretch'}
                                style={styles.image}
                            />
                        </View>
                        <View style={styles.titleContainer}>
                            <Text>
                                <Text style={styles.primaryColorText}>
                                    {startText}
                                </Text>
                                <BoldText style={styles.highlightedText}>
                                    {' '}
                                    {highlightedText}{' '}
                                </BoldText>
                                <Text style={styles.primaryColorText}>
                                    {endText}
                                </Text>
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    };
}

export default withTheme(SpannableTitleButton, SpannableTitleButtonStyle);
