import { TextArea, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../styles/theme/WithThemeHOC';

export default ({
    placeholder,
    value,
    onChangeText,
    style,
    itemStyle,
    error,
    errorStyle,
    secureTextEntry,
    keyboardType,
    disabled,
}) => {
    const theme = useTheme();

    const styles = StyleSheet.create({
        input: {
            fontFamily: theme.normalFont,
            fontSize: 14,
        },

        item: {
            borderRadius: 5,
            borderColor: theme.brandPrimary,
        },

        error: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
    });

    const textAreaStyle = itemStyle ? itemStyle : styles.item;

    return (
        <View>
                <TextArea
                    placeholder={placeholder}
                    value={value}
                    autoCapitalize="none"
                    onChangeText={onChangeText}
                    style={[styles.input, style]}
                    placeholderTextColor="#AFAFAF"
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    isDisabled={disabled}
                    borderColor={textAreaStyle.borderColor}
                    borderWidth={textAreaStyle.borderWidth}
                />
            {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
        </View>
    );
};
