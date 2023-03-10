import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        header: {
            backgroundColor: '#ffffff',
        },
        headerText: {
            fontSize: 25,
        },
        subTitle: {
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 15,
        },

        bodyContainer: {
            paddingHorizontal: 40,
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
        headerContainer: {
            flex: null,
            padding: 12,
            flexDirection: 'row',
            backgroundColor: '#00000000',
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
            paddingTop: 25,
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: '#FFFFFF',
        },
        modalContainerStyle: {
            flex: 1,
            marginTop: 25,
            justifyContent: 'space-around',
            backgroundColor: '#fff',
            padding: 10,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            paddingVertical: 25,
        },
        successImage: {
            aspectRatio: 1,
            height: 160,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        modalHeading: {
            color: '#000',
            textAlign: 'center',
            fontSize: 25,
            alignSelf: 'center',
        },

        modalMessage: {
            marginTop: 45,
            padding: 10,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 16,
            lineHeight: 26,
        },

        modalButtonContainer: {
            paddingHorizontal: 30,
        },
        stackSpace: 4,
    });
