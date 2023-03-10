import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    successModal: {
        backgroundColor: 'white',
        marginHorizontal: 20,
        padding: 10,
        borderRadius: 10,
    },
    iconContainer: {
        alignItems: 'flex-end',
    },
    whiteIcon: {
        color: '#FFFFFF',
        fontSize: 30,
    },
    contentContainer: {
        paddingHorizontal: 75,
        alignSelf: 'center',
        alignItems: 'center',
        marginVertical: 20,
    },
    modalText: {
        alignItems: 'center',
    },
    successText: {
        textAlign: 'center',
        marginBottom: 20,
    },
    iconGreenCircle: {
        backgroundColor: '#4FC879',
        justifyContent: 'center',
        alignItems: 'center',
        height: 64,
        width: 64,
        borderRadius: 64,
        marginBottom: 20,
    },
});
