import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        touchableOpacity: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        backIcon: {
            justifyContent: 'center',
            alignSelf: 'center',
            color: '#ffffff',
            fontSize: 20,
        },
    });
