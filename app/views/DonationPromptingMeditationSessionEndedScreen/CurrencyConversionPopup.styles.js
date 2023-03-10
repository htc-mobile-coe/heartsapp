import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        amountModal: {
            backgroundColor: 'white',
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 10,
            padding: 10,
            borderRadius: 10,
        },
        iconContainer: {
            alignItems: 'flex-end',
        },
        redIcon: {
            color: 'red',
        },
        contentContainer: {
            paddingHorizontal: 40,
        },
        modalText: {
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 30,
        },
        centerText: {
            textAlign: 'center',
            marginBottom: 20,
        },
        modalThankYouText: {
            marginBottom: 15,
            fontSize: 20,
        },
        modalYesButton: {
            backgroundColor: props.brandPrimary,
        },
        disabledModalYesButton: {
            backgroundColor: 'gray',
        },
        modalNoButton: {
            borderWidth: 2,
            borderColor: props.brandPrimary,
            marginVertical: 25,
        },
        modalNoButtonText: {
            color: props.brandPrimary,
        },
    });
