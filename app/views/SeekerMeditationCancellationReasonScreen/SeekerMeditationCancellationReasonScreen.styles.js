import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            margin: 15,
            borderRadius: 5,
        },
        headingContainer: {
            marginTop: 20,
            paddingLeft: 10,
            paddingVertical: 25,
            paddingRight: 5,
        },

        radiosContainer: {
            paddingHorizontal: 10,
            paddingVertical: 10,
        },
        radio: {
            paddingVertical: 15,
            paddingRight: 10,
            alignItems: 'center',
        },

        buttonContainer: {
            paddingHorizontal: 25,
            paddingTop: 10,
            paddingBottom: 20,
        },

        submitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
        },
        disableSubmitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: 'grey',
        },
        radioText: {
            fontFamily: props.mediumFont
        },
    });
