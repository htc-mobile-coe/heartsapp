import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: props.primaryBackground,
            borderRadius: 10,
        },
        buttonContainer: {
            flexDirection: 'row',
            borderBottomWidth: 1,
            borderColor: '#DADADA',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
        },
        cancelButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
        },
        buttonText: {
            flex: 0.3,
            color: '#6C6B6B',
            paddingLeft: 10,
        },
        cancelButtonText: {
            flex: 0.2,
            color: props.brandPrimary,
            paddingLeft: 10,
        },
        image: {
            flex: 0.1,
            width: 35,
            height: 35,
        },
    });
