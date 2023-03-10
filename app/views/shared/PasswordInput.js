import { Center, Input } from 'native-base';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from './Text';
import { Eye, EyeOff } from './Icon';
import { withTheme } from 'app/styles/theme/WithThemeHOC';

const passwordStyle = (props) =>
    StyleSheet.create({
        input: {
            fontFamily: props.normalFont,
            fontSize: 14,
        },
        item: {
            borderColor: props.brandPrimary,
            borderWidth: 1,
            height: 35,
            width: '100%',
        },
        error: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },

        eyeColor: {
            color: '#AFAFAF',
            fontSize: 24,
            marginRight: 10,
        },
    });

class PasswordInput extends React.Component {
    state = {
        passwordInPlainText: false,
    };

    _toggleShowPlainText = () => {
        this.setState({
            passwordInPlainText: !this.state.passwordInPlainText,
        });
    };

    _renderEye = () => {
        const { styles } = this.props;
        if (this.state.passwordInPlainText) {
            return <EyeOff style={[styles.eyeColor]} />;
        }

        return <Eye style={[styles.eyeColor]} />;
    };

    _renderRightElement = () => {
        return (
            <TouchableOpacity
                testID="password_right_button"
                onPress={this._toggleShowPlainText}>
                {this._renderEye()}
            </TouchableOpacity>
        );
    };

    render() {
        const {
            placeholder,
            value,
            onChangeText,
            variantStyle,
            itemStyle,
            error,
            errorStyle,
            styles,
        } = this.props;

        const inputItemStyle = itemStyle ? itemStyle : styles.item;

        return (
            <Center>
                <Input
                    placeholder={placeholder}
                    variant={variantStyle}
                    value={value}
                    autoCapitalize="none"
                    onChangeText={onChangeText}
                    style={styles.input}
                    placeholderTextColor="#AFAFAF"
                    secureTextEntry={!this.state.passwordInPlainText}
                    w={inputItemStyle.width}
                    height={inputItemStyle.height}
                    borderColor={inputItemStyle.borderColor}
                    borderWidth={inputItemStyle.borderWidth}
                    InputRightElement={this._renderRightElement()}
                />

                {error && (
                    <Text style={[styles.error, errorStyle]}>{error}</Text>
                )}
            </Center>
        );
    }
}

export default withTheme(PasswordInput, passwordStyle);
