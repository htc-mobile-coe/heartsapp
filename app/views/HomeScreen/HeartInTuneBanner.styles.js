import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: '#8C51FF',
            borderRadius: 10,
            marginTop: 15,
        },
        closeButtonContainer: {
            borderRadius: 15,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
            position: 'absolute',
            top: -11,
            right: -7,
            resizeMode: 'contain',
        },
        closeIcon: {
            fontSize: 22,
            color: '#462F69',
        },
        heading: {
            color: '#FFFFFF',
            fontSize: 13,
            justifyContent: 'center',
            paddingTop: 10,
        },
        bodyContainer: {
            flex: 1,
            justifyContent: 'space-between',
            padding: 16,
        },
        image: {
            width: '75%',
            height: 60,
            alignItems: 'center',
            marginHorizontal: 40,
            resizeMode: 'contain',
        },
        content: {
            fontSize: 14,
            textAlign: 'center',
            marginTop: 4,
            color: '#FFFFFF',
            lineHeight: 20,
        },
        button: {
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
            marginBottom: 16,
            marginHorizontal: 70,
        },
        title: {
            fontSize: 14,
            textAlign: 'center',
            color: '#462F69',
        },
    });
