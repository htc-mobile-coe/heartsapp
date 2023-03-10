import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        modalContentView: {
            flexDirection: 'column',
        },
        textContainer: {
            alignItems: 'center',
        },
        inputContainer: {
            paddingTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: 170,
            backgroundColor: 'white',
        },
        iconBackgroundStyle: {
            width: 40,
            height: 40,
            backgroundColor: props.mediumPrimary,
            alignItems: 'center',
            justifyContent: 'space-around',
            borderRadius: 5,
        },
        disabledIconBackgroundStyle: {
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'space-around',
            borderRadius: 5,
            backgroundColor: '#E1E1E1',
        },
        additionalIcons: {
            color: 'white',
        },

        input: {
            textAlign: 'center',
            fontSize: 35,
            fontWeight: 'bold',
            height: 70,
        },
        disabledInput: {
            textAlign: 'center',
            fontSize: 35,
            fontWeight: 'bold',
            height: 70,
            color: 'gray',
        },
        inputBackground: {
            width: 70,
            height: 50,
            backgroundColor: 'white',
            borderColor: props.brandPrimary,
        },
        disabledInputBackground: {
            width: 70,
            height: 50,
            backgroundColor: 'white',
            borderColor: '#E1E1E1',
        },
    });
