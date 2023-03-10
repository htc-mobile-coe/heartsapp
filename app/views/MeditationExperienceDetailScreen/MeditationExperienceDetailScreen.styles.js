import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        headingContainer: {
            flex: 0.4,
            flexDirection: 'column',
            paddingVertical: 15,
            paddingHorizontal: 20,
        },
        skipButtonContainer: {
            alignSelf: 'flex-end',
        },
        skipButton: {
            color: props.brandPrimary,
        },
        imageContainer: {
            flex: 0.5,
            alignItems: 'center',
            padding: 30,
            margin: 30,
        },
        image: {
            flex: 1,
            resizeMode: 'contain',
            width: 270,
            height: 250,
        },
        textContainer: {
            flex: 0.5,
            alignItems: 'center',
            margin: 40,
        },
        title: {
            textAlign: 'center',
            color: '#000000',
            fontFamily: props.boldFont,
            fontSize: 20,
            padding: 20,
        },
        description: {
            textAlign: 'center',
            color: '#605F5F',
            fontFamily: props.normalFont,
            fontSize: 16,
        },
        bottomContainer: {
            flex: 0.5,
            padding: 40,
        },
        letsStartButton: {
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
        },
        letsStartTextStyle: {
            alignSelf: 'center',
            color: '#ffffff',
        },
    });
