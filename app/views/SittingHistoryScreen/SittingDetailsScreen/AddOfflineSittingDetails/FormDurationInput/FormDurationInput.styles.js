import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        durationInputItem: {
            flexDirection: 'row',
            height: 45,
            borderWidth: 0.5,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            alignItems: 'center',
        },
        durationInput: {
            fontSize: 14,
            fontFamily: props.mediumFont,
        },
        durationIcon: {
            marginRight: 6,
            width: 25,
            height: 25,
        },
        error: {
            color: '#FF0000',
            fontSize: 12,
        },
    });
