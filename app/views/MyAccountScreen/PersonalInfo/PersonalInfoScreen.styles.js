import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        bodyContainer: {
            paddingHorizontal: 40,
            flex: 1,
            flexDirection: 'column',
        },
        whiteContainer: {
            padding: 20,
            marginTop: 26,
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: 4,
        },
        inputItem: {
            marginTop: 22,
            height: 48,
            borderColor: props.brandPrimary,
        },
        inputBorder: {
            borderWidth: 1.55,
            borderRadius: 5,
            borderColor: props.brandPrimary,
        },
        borderContainer: {
            marginTop: 22,
            borderWidth: 2,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            marginLeft: 2,
            paddingLeft: 5,
            paddingRight: 5,
            minHeight: 48,
            flexDirection: 'row',
            alignItems: 'center',
        },
        cityContainer: {
            flex: 1,
            flexDirection: 'row',
            marginEnd: 10,
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        lightText: {
            color: '#AFAFAF',
        },
        phoneInputContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        phoneInput: {
            flex: 1,
            borderColor: 'transparent',
            paddingVertical: 20,
        },
        errorText: {
            marginTop: 5,
            color: 'red',
            fontSize: 12,
            alignSelf: 'flex-end',
        },
        errorStyle: {
            marginTop: 5,
        },
        updateButton: {
            marginVertical: 30,
            backgroundColor: props.brandPrimary,
        },
        successView: {
            padding: 20,
            borderRadius: 10,
        },
        checkIconView: {
            padding: 10,
            alignSelf: 'center',
        },
        successTextView: {},
        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
            paddingHorizontal: 20,
            marginBottom: 10,
        },
        phoneHintText: {
            marginTop: 5,
            fontSize: 10,
            marginLeft: 5,
            color: 'grey',
        },
        stackContainer: {
            marginTop: 10
        },
        stackSpace: 3,
    });
