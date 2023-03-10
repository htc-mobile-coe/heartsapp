import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        instructionTitle: {
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'center',
            flexWrap: 'wrap',
        },
        headerHeight: { height: 60 },
        fillTheFollowingOr: {
            fontSize: 14,
            color: '#000000',
            paddingRight: 5,
        },
        logIn: {
            color: props.brandPrimary,
            fontSize: 14,
        },
        inputItem: {
            height: 47,
            borderWidth: 1.75,
            borderRadius: 5,
            borderColor: props.brandPrimary,
        },
        confirmDonateButton: {
            marginVertical: 20,
            backgroundColor: props.brandPrimary,
        },
        donateFormContainer: {
            paddingTop: 15,
            paddingHorizontal: 35,
        },
        donationInformationView: {
            marginTop: 15,
            alignItems: 'center',
        },
        donationInformationText: {
            paddingTop: 15,
            textAlign: 'center',
            fontSize: 20,
            lineHeight: 30,
            alignItems: 'center',
        },
        countryCode: {
            color: 'white',
        },
        amount: {
            marginLeft: 5,
            height: 48,
        },
        countryContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        boxContainer: {
            paddingLeft: 10,
            borderWidth: 2,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            justifyContent: 'center',
            height: 48,
        },
        dropDownInputStyle: {
            borderBottomColor: 'transparent',
            marginLeft: 10,
        },
        phoneContainer: {
            marginTop: 15,
            borderWidth: 2,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            marginLeft: 2,
            paddingLeft: 5,
            height: 48,
            flexDirection: 'row',
            alignItems: 'center',
        },
        currencyText: {
            fontSize: 14,
        },
        phonePickerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 2,
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
        donationAmountView: {
            flex: 0.25,
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
        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
            paddingHorizontal: 20,
            marginTop: 10,
        },
        phoneHintText: {
            marginTop: 5,
            marginBottom: 15,
            fontSize: 10,
            color: 'grey',
        },
        popupView: {
            backgroundColor: 'white',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 30,
            borderRadius: 10,
        },
        redIconCircle: {
            color: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            height: 54,
            width: 54,
            borderRadius: 64,
            borderWidth: 6,
            borderColor: 'red',
            marginBottom: 20,
        },
        redIcon: {
            color: 'red',
        },
        popupHeadingText: {
            fontSize: 20,
            marginBottom: 20,
        },
        popupContentText: {
            textAlign: 'center',
            marginBottom: 15,
            lineHeight: 22,
        },
        popupDonationURLText: {
            textAlign: 'center',
            color: '#396ACB',
            textDecorationLine: 'underline',
            marginBottom: 20,
        },
        popupCloseButton: {
            backgroundColor: props.brandPrimary,
        },
        stackSpace: 4,
    });