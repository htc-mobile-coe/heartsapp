import { Button as NBButton } from 'native-base';
import React from 'react';
import { StyleSheet } from 'react-native';
import { MediumBoldText } from './Text';
import { isArray } from 'lodash';

export default ({
    style,
    textStyle,
    onPress,
    text,
    borderRadius,
    transparent,
    disabled,
    testID,
}) => {
    const styles = StyleSheet.create({
        text: {
            fontSize: 16,
            textAlign: 'center',
            color: '#ffffff',
        },

        button: {
            justifyContent: 'center',
            paddingVertical: 10,
        },
    });
    const textStyles = isArray(textStyle)
        ? [styles.text, ...textStyle]
        : [styles.text, textStyle];
    const variantStyle = transparent ? "ghost" : "outline";
    const buttonBorderRadius = borderRadius? borderRadius : 30;
    return (
        <NBButton
            block
            testID={testID}
            variant={variantStyle}
            style={[styles.button, style]}
            onPress={onPress}
            disabled={disabled}
            borderRadius={buttonBorderRadius}
            >
            <MediumBoldText uppercase={false} style={textStyles}>
                {text}
            </MediumBoldText>
        </NBButton>
    );
};
