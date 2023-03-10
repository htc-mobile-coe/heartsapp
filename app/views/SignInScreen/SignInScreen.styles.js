import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        headingContainer: {
            flexDirection: 'row',
            paddingVertical: 20,
        },

        headerLeftContainer: {
            width: 70,
            alignItems: 'center',
            justifyContent: 'center',
        },

        headerCenterContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

        headerRightContainer: {
            width: 70,
        },

        backIcon: {
            justifyContent: 'center',
            alignSelf: 'center',
            color: props.brandPrimary,
            fontSize: 50,
        },

        bodyContainer: {
            paddingHorizontal: 15,
        },

        title: {
            fontSize: 25,
            color: props.brandPrimary,
        },

        socialLoginContainer: {
            justifyContent: 'center',
            flexDirection: 'row',
            marginBottom: 20,
        },

        socialLoginIconContainer: {
            padding: 5,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            margin: 10,
        },

        socialLoginIcon: {
            width: 60,
            height: 60,
        },

        appleLoginIconContainer: {
            width: 42,
        },

        appleLoginIcon: {
            width: 60,
            height: 60,
        },

        socialLoginTextContainer: {
            paddingTop: 10,
            alignItems: 'center',
        },

        socialLoginText: {
            fontSize: 12,
        },

        loginSeperatorContainer: {
            alignItems: 'center',
            borderBottomWidth: 1,
            borderBottomColor: '#E7EFEE',
        },

        loginSeperatorTextContainer: {
            backgroundColor: '#E7EFEE',
            padding: 9,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: -17,
        },

        loginSeperatorText: {
            color: '#A2ADB7',
            fontSize: 12,
            paddingTop: 3,
        },

        emailLoginContainer: {
            paddingTop: 30,
            paddingHorizontal: 35,
        },

        emailLoginInputItem: {
            marginTop: 10,
        },

        loginButton: {
            marginTop: 20,
            backgroundColor: props.brandPrimary,
        },
        forgotPasswordContainer: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },
        skipContainer: {
            alignSelf: 'stretch',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        skipButton: {
            width: 75,
            marginTop: 10,
        },

        skipButtonText: {
            fontSize: 16,
            textDecorationLine: 'underline',
            color: props.brandPrimary,
        },

        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
            paddingHorizontal: 20,
        },

        forgotPasswordText: {
            color: props.brandPrimary,
            alignSelf: 'flex-end',
            fontSize: 12,
            marginTop: 5,
        },

        otherActionContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 20,
            paddingHorizontal: 20,
            flexWrap: 'wrap',
        },

        acceptTermsAndCondition: {
            flexDirection: 'row',
            justifyContent: 'center',
            paddingTop: 25,
            paddingHorizontal: 35,
        },

        acceptTermsAndConditionText: {
            textAlign: 'center',
            lineHeight: 20,
        },

        otherActionLabel: {
            fontSize: 14,
            color: '#AFAFAF',
            paddingRight: 5,
        },

        otherActionText: {
            color: props.brandPrimary,
            fontSize: 14,
        },

        stackSpace: 3,
    });
