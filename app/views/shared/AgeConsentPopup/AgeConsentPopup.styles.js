import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        contentContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            flexGrow: 1,
        },
        container: {
            flexDirection: 'column',
            backgroundColor: props.primaryBackground,
            borderRadius: 4,
            padding: 20,
        },
        noteImage: {
            height: 47.5,
            width: 42.5,
            alignSelf: 'center',
            marginVertical: 20,
        },
        titleText: {
            color: 'gray',
            marginBottom: 10,
            textAlign: 'center',
        },
        checkBoxContainer: {
            flexDirection: 'row',
            marginBottom: 20,
            flexWrap: 'wrap',
        },
        termsAndPolicyView: {
            flexDirection: 'row',
            marginBottom: 3,
            flexWrap: 'wrap',
        },
        primaryColorText: {
            color: props.brandPrimary,
            marginEnd: 5,
        },
        rightMargin: {
            marginEnd: 5,
        },
        buttonView: {
            flexDirection: 'row',
            marginHorizontal: 20,
            marginBottom: 20,
            justifyContent: 'center',
        },
        descriptionContainer: {
            flex: 1,
        },
        ageConsentCheckBox: {
            borderRadius: 0,
            borderColor: props.brandPrimary,
        },
        ageConsentCheckBoxDisabled: {
            borderRadius: 0,
            borderColor: '#BEBEBE',
        },
        acceptButton: {
            paddingHorizontal: 8,
            backgroundColor: props.brandPrimary,
            marginEnd: 30,
        },
        cancelButton: {
            paddingHorizontal: 8,
            borderWidth: 2,
            borderColor: props.brandPrimary,
        },
        acceptButtonDisabled: {
            paddingHorizontal: 8,
            backgroundColor: '#BEBEBE',
            marginEnd: 30,
        },
        cancelButtonDisabled: {
            paddingHorizontal: 8,
            borderWidth: 2,
            borderColor: '#BEBEBE',
            color: '#BEBEBE',
        },
        cancelButtonDisabledText: {
            color: '#BEBEBE',
        },
        cancelButtonEnableText: {
            color: props.brandPrimary,
        },
    });
