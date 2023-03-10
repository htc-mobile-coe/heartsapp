import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        shadowModal: {
            backgroundColor: 'white',
            marginHorizontal: 20,
            padding: 10,
            borderRadius: 10,
        },
        contentContainer: {
            paddingHorizontal: 25,
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 20,
        },
        iconGreenCircle: {
            height: 64,
            width: 64,
            borderRadius: 64,
        },
        thankYouText: {
            marginTop: 15,
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 26,
        },
        messageText: {
            textAlign: 'center',
            marginBottom: 20,
        },
    });
