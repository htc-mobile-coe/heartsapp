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
        descriptionStyle: {
            paddingHorizontal: 35,
        },
        title: {
            color: '#1B2541',
            fontSize: 18,
            justifyContent: 'flex-start',
            marginHorizontal: 15,
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
        checkBoxView: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        checkBox: {
            borderRadius: 0,
            borderColor: props.brandPrimary,
        },
        checkBoxUnchecked: {
            borderRadius: 0,
            borderColor: '#BEBEBE',
        },
    });
