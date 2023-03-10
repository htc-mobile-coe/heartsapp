import React from 'react';
import { isArray } from 'lodash';
import { StyleSheet, Text as NText } from 'react-native';
import { useTheme } from 'app/styles/theme/WithThemeHOC';

export const Text = ({ style, children, onPress }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        text: {
            fontFamily: theme.normalFont,
        },
    });
    const textStyle = isArray(style)
        ? [styles.text, ...style]
        : [styles.text, style];
    return (
        <NText style={textStyle} onPress={onPress}>
            {children}
        </NText>
    );
};

export const MediumBoldText = ({ style, children }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        text: {
            fontFamily: theme.mediumFont,
        },
    });
    const textStyle = isArray(style)
        ? [styles.text, ...style]
        : [styles.text, style];
    return (
        <NText style={textStyle}>
            {children}
        </NText>
    );
};

export const BoldText = ({ style, children }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        text: {
            fontFamily: theme.boldFont,
        },
    });

    return (
        <NText style={[styles.text, style]}>
            {children}
        </NText>
    );
};

export const BolderText = ({ style, children }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        text: {
            fontFamily: theme.blackFont,
        },
    });

    return (
        <NText style={[styles.text, style]}>
            {children}
        </NText>
    );
};

export const MediumBoldItalicText = ({ style, children }) => {
    const theme = useTheme();
    const styles = StyleSheet.create({
        text: {
            fontFamily: theme.boldItalicFont,
        },
    });

    return (
        <NText style={[styles.text, style]}>
            {children}
        </NText>
    );
};
