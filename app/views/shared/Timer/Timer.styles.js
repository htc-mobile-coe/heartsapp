import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'flex-end',
        },
        timerContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        icon: {
            tintColor: 'black',
            resizeMode: 'contain',
            width: 40,
            height: 40,
        },
        timerMinutes: {
            color: props.lightTextColor,
            marginLeft: 5,
            marginBottom: 8,
        },
    });
