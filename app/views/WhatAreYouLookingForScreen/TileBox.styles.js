import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            width: '48%',
            aspectRatio: 1.2,
            padding: 10,
        },
        buttonContainer: {
            flex: 1,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 27,
            borderStyle: 'dotted',
            borderWidth: 1,
            borderColor: props.brandPrimary,
        },
        imageContainer: {
            alignItems: 'center',
        },
        image: {
            width: 45,
            height: 45,
            resizeMode: 'contain',
        },
        textContainer: {
            paddingHorizontal: 5,
        },

        title: {
            fontSize: 12,
            textAlign: 'center',
            marginTop: 10,
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
