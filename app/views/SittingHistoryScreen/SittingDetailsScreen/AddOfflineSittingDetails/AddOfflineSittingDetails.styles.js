import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        contentContainer: { flexGrow: 1 },
        headerContainer: {
            flex: null,
            padding: 12,
            backgroundColor: 'transparent',
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
            paddingTop: 15,
            paddingBottom: 28,
        },
        sessionDetailsFormContainer: {
            flex: 1,
        },
        bodyContainer: {
            flex: 1,
            flexGrow: 1,
            paddingTop: 30,
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 40,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        formInputComponentContainer: {
            paddingTop: 15,
        },
        timePickerContainer: {
            paddingTop: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        bottomButtonContainer: {
            flex: 1,
            marginVertical: 40,
            justifyContent: 'flex-end',
        },
        bottomButton: {
            textAlign: 'center',
            backgroundColor: props.brandPrimary,
            fontSize: 16,
        },
        commentBoxItem: {
            borderWidth: 0.5,
            borderColor: props.brandPrimary,
        },
        commentBox: {
            flex: 1,
        },
        numberOfPeopleItemStyle: {
            height: 45,
            borderWidth: 0.5,
            borderColor: props.brandPrimary,
            borderRadius: 5,
        },
        numberOfPeopleTextInput: {
            fontSize: 14,
            fontFamily: props.normalFont,
        },
        numberOfPeopleTextInputSelected: {
            fontSize: 14,
            fontFamily: props.mediumFont,
        },
        validationErrorText: {
            color: '#FF0000',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
    });
