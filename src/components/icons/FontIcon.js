import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { Icons as FontAwsomeIcons } from './FontAwesome';
import { Icons as MaterialIcons } from './MaterialIcons';

export default ({ icon, style, color, children }) => {
    const styles = StyleSheet.create({
        icon: {
            fontFamily: icon.fontFamily,
            backgroundColor: 'transparent',
        },
    });

    return (
        <Text style={[styles.icon, { color }, style]}>
            {icon.glyph}
            {children}
        </Text>
    );
}

const fontFamily = {
    fontawesome: 'fontawesome',
    materialicons: 'materialicons'
}

export const Icons = {
    arrowLeft: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.arrow_back
    },

    tune:{
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.tune
    },

    bookmarkO:{
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.bookmark_border
    },

    search: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.search
    },

    eye: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.remove_red_eye
    },

    lock: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.lock
    },

    star: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.star
    },

    music: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.music
    },

    play: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.play
    },

    close: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.close
    },

    radioButtonChecked: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.radio_button_checked
    },

    radioButtonUnchecked: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.radio_button_unchecked
    },

    checkboxChecked: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.check_box
    },

    checkboxUnchecked: {
        fontFamily: fontFamily.materialicons,
        glyph: MaterialIcons.check_box_outline_blank
    },

    chevronCircleLeft: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.chevronCircleLeft
    },

    chevronCircleRight: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.chevronCircleRight
    },

    angleRight: {
        fontFamily: fontFamily.fontawesome,
        glyph: FontAwsomeIcons.angleRight
    }
}