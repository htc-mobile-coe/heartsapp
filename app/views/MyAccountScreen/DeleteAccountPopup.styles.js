import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        deleteModal: {
            backgroundColor: 'white',
            marginHorizontal: 10,
            padding: 10,
            borderRadius: 10,
        },
        iconContainer: {
            alignItems: 'flex-end',
        },
        redIcon: {
            color: '#FF0000',
            fontSize: 30,
        },
        contentContainer: {
            paddingHorizontal: 25,
        },
        modalText: {
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 20,
        },
        deleteText: {
            textAlign: 'center',
            marginBottom: 20,
        },
        modalButton: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
            marginBottom: 25,
        },
        modalYesButton: {
            borderWidth: 2,
            borderColor: props.brandPrimary,
            width: 125,
            height: 45,
        },
        modalOkayText: {
            color: props.brandPrimary,
        },
        modalNoButton: {
            backgroundColor: props.brandPrimary,
            width: 125,
            height: 45,
        },
        iconRedCircle: {
            borderWidth: 5,
            borderColor: 'red',
            justifyContent: 'center',
            alignItems: 'center',
            height: 64,
            width: 64,
            borderRadius: 64,
            marginBottom: 20,
        },
    });
