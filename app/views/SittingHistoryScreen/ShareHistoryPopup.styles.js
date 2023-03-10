import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            bottom: 0,
        },
        headerStyle: {
            paddingHorizontal: 30,
            paddingTop: 10,
        },
        skipButtonStyle: {
            alignSelf: 'flex-end',
        },
        skipButtonText: {
            color: props.brandPrimary,
            fontSize: 14,
        },
        heading: {
            color: '#333333',
            fontSize: 20,
            justifyContent: 'flex-end',
            paddingHorizontal: 5,
        },
        formikContainer: {
            paddingHorizontal: 35,
        },
        emailContainer: {
            marginTop: 20,
        },

        inputItem: {
            borderColor: '#C1C1C1',
        },
        submitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
            marginVertical: 27,
        },
        noInternetText: {
            color: 'red',
            textAlign: 'center',
            marginBottom: 10,
        },
        errorStyle: {
            borderColor: '#FF0000',
        },
        successMessageContainer: {
            paddingVertical: 20,
            paddingHorizontal: 35,
        },
        successMessageText: {
            textAlign: 'center',
            fontSize: 13,
        },
        successMessageTitle: {
            textAlign: 'center',
            marginTop: 20,
            marginBottom: 13,
        },
        activityIndicatorContainer: {
            justifyContent: 'center',
            marginVertical: 32,
        },
    });
