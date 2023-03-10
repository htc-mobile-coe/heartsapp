import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
        },
        cancelModal: {
            backgroundColor: 'white',
            marginHorizontal: 15,
            padding: 10,
            borderRadius: 10,
        },
        contentContainer: {
            paddingHorizontal: 35,
        },
        modalText: {
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 20,
        },
        cancelText: {
            textAlign: 'center',
            marginBottom: 20,
        },
        modalButton: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 25,
        },
        modalYesButton: {
            borderWidth: 2,
            borderColor: props.brandPrimary,
            width: 125,
            height: 45,
        },
        modalYesButtonText: {
            color: props.brandPrimary,
        },
        modalNoButton: {
            width: 125,
            height: 45,
            borderColor: props.brandPrimary,
            backgroundColor: props.brandPrimary,
        },
        cancelDescriptionText: {
            fontSize: 15,
            textAlign: 'center',
            lineHeight: 22,
        },
    });
