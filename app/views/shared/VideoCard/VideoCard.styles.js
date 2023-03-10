import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            backgroundColor: props.primaryBackground,
            paddingVertical: 10,
            paddingHorizontal: 10,
            marginBottom: 10,
            borderRadius: 4,
        },

        previewContainer: {
            marginTop: 10,
        },

        imageStyle: {
            height: 150,
            width: '100%',
            resizeMode: 'stretch',
            borderRadius: props.cardBorderRadius,
        },

        overlayContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.3,
            borderRadius: props.cardBorderRadius,
        },
        iconContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },

        lockedIconContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
        },

        icon: {
            color: '#FFFFFF',
            fontSize: 26,
        },

        iconCircle: {
            borderColor: '#FFFFFF',
            borderWidth: 2,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(52, 52, 52, 0.3)',
        },

        languageContainer: {
            alignItems: 'flex-end',
            marginTop: 10,
        },

        actionsContainer: {
            alignItems: 'center',
        },

        actionItem: { textDecorationLine: 'underline' },

        languageDropDown: {
            height: 35,
            width: 150,
        },
        dropDown: {
            width: 150,
            height: 32,
            fontSize: 14,
        },

        description: {
            marginTop: 10, 
            color: '#333333',
        },
        durationContainer: {
            position: 'absolute',
            bottom: 5,
            left: 10,
        },
        durationText: {
            color: '#ffffff',
            fontSize: 15,
        },
    });
