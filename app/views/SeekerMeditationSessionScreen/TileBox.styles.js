import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            padding: 10,
        },
        buttonContainer: {
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
        },
        imageContainer: {
            alignItems: 'center',
        },
        image: {
            width: 45,
            height: 45,
            resizeMode: 'contain',
        },
        title: {
            textAlign: 'center',
            marginTop: 10,
            color: props.brandPrimary,
            fontFamily: props.boldFont,
            fontSize: 15,
        },
        disabledTitle: {
            textAlign: 'center',
            marginTop: 10,
            color: '#727270',
            fontFamily: props.normalFont,
            fontSize: 15,
        },
        iconContainer: {
            position: 'absolute',
            top: -9,
            right: -7,
            resizeMode: 'contain',
        },
        tickImage: {
            height: 24,
            width: 24,
        },
    });
