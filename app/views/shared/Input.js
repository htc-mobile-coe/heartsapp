import { Input, View } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from 'app/styles/theme/WithThemeHOC';

export default ({
    placeholder,
    value,
    onChangeText,
    style,
    variantStyle,
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
            borderColor: theme.brandPrimary,
            borderWidth: 1,
            height: 35,
        },

        error: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },

        placeholderTextColor: '#AFAFAF',
    });

    const inputItemStyle = itemStyle ? itemStyle : styles.item;

    return (
        <View>
                <Input
                    placeholder={placeholder}
                    variant={variantStyle}
                    value={value}
                    autoCapitalize="none"
                    onChangeText={onChangeText}
                    style={[styles.input, style]}
                    width={inputItemStyle.width}
                    height={inputItemStyle.height}
                    backgroundColor={inputItemStyle.backgroundColor}
                    placeholderTextColor={styles.placeholderTextColor}
                    secureTextEntry={secureTextEntry}
                    keyboardType={keyboardType}
                    isDisabled={disabled}
                    borderColor={inputItemStyle.borderColor}
                    borderWidth={inputItemStyle.borderWidth}
                />
            {error && <Text style={[styles.error, errorStyle]}>{error}</Text>}
        </View>
    );
};
