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
            justifyContent: 'space-between',
            paddingHorizontal: 30,
            paddingTop: 10,
        },
        skipButtonStyle: {
            alignSelf: 'flex-end',
        },
        skipButtonText: {
            color: props.brandPrimary,
        },
        heading: {
            color: '#333333',
            fontSize: 20,
            justifyContent: 'flex-end',
            paddingTop: 30,
            paddingHorizontal: 20,
        },
        descriptionStyle: {
            paddingHorizontal: 35,
        },
        title: {
            color: '#1B2541',
            fontSize: 18,
            justifyContent: 'flex-end',
            paddingTop: 30,
            paddingHorizontal: 15,
        },
        tileContainerStyle: {
            paddingHorizontal: 5,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 12,
        },
        textAreaView: {
            paddingHorizontal: 15,
            paddingVertical: 15,
        },
        textArea: {
            flex: 1,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: props.brandPrimary,
        },
        disabledTextArea: {
            flex: 1,
            borderWidth: 1,
            borderRadius: 4,
            borderColor: '#C1C1C1',
        },
        inputItem: {
            borderColor: props.brandPrimary,
        },
        disabledInputItem: {
            borderColor: '#C1C1C1',
        },
        buttonContainer: {
            paddingHorizontal: 50,
            paddingTop: 20,
            paddingBottom: 30,
        },
        submitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
        },
        disableSubmitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#C1C1C1',
        },
        noInternetText: {
            color: 'red',
            textAlign: 'center',
        },
    });
