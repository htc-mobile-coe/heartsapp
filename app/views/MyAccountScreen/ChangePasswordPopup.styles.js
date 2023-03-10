import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        changePasswordModal: {
            backgroundColor: 'white',
            marginHorizontal: 20,
            padding: 20,
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
            paddingHorizontal: 35,
        },
        modalText: {
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 20,
        },
        description: {
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 20,
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
        socialIcon: {
            resizeMode: 'contain',
            width: 20,
            height: 20,
            marginEnd: 5,
        },
        modalButton: {
            marginTop: 15,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            alignItems: 'center',
        },
        modalOkayButton: {
            borderWidth: 2,
            borderColor: props.brandPrimary,
            flex: 1,
        },
        modalOkayText: {
            color: props.brandPrimary,
        },
    });
