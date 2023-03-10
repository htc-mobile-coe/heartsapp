import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { styles as userRoleButtonStyle } from './UserRoleButton.styles';
import { Text, View } from 'native-base';
import { AngleRight } from '../shared/Icon';
import { withTheme } from '../../styles/theme/WithThemeHOC';

class UserRoleButton extends Component {
    render() {
        const {
            onPress,
            text,
            testID,
            containerStyle,
            style,
            styles,
        } = this.props;
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.9}
                testID={testID}>
                <View style={[styles.container, containerStyle]}>
                    <View style={styles.textContainer}>
                        <Text style={[styles.textStyle, style]}>{text}</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <AngleRight style={[styles.iconStyle, style]} />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default withTheme(UserRoleButton, userRoleButtonStyle);
