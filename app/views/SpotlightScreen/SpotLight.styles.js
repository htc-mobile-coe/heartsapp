import { StyleSheet } from 'react-native';

export const styles = () =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        backgroundImageStyle: {
            resizeMode: 'stretch',
        },
        spotlightImage: {
            height: '100%',
            width: '100%',
        },
        skipButtonContainer: {
            alignItems: 'flex-end',
            paddingEnd: 20,
        },
        skipButton: {
            alignItems: 'flex-end',
            paddingHorizontal: 20,
            justifyContent: 'center',
            marginTop: 43,
        },
        skipText: {
            color: '#FFFFFF',
            fontSize: 16,
        },
    });
