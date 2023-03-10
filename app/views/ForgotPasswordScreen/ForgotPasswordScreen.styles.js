import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        header: {
            backgroundColor: '#ffffff',
        },
        headerText: {
            fontSize: 25,
        },

        bodyContainer: {
            paddingHorizontal: 40,
        },

        inputItem: {
            marginTop: 15,
        },

        loginButton: {
            marginTop: 20,
            backgroundColor: props.brandPrimary,
        },

        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
        modalContainerStyle: {
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 10,
            paddingVertical: 25,
        },

        modalHeading: {
            fontSize: 25,
            alignSelf: 'center',
        },

        modalMessage: {
            marginTop: 25,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 14,
        },

        modalButtonContainer: {
            paddingHorizontal: 30,
        },
    });
