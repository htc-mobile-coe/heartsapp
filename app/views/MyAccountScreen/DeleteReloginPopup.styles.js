import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        deleteReloginModal: {
            backgroundColor: 'white',
            marginHorizontal: 20,
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
            paddingHorizontal: 25,
        },
        modalText: {
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 20,
        },
        reloginText: {
            textAlign: 'center',
            marginBottom: 20,
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
        modalButton: {
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 25,
        },
        modalReloginButton: {
            backgroundColor: props.brandPrimary,
        },
    });
