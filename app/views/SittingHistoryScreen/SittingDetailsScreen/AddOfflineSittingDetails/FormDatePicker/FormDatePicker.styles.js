import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        inputContainer: {
            flex: 1,
            height: 40,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            borderColor: props.brandPrimary,
            height: 45,
            borderWidth: 0.5,
        },
        input: {
            fontSize: 14,
            fontFamily: props.normalFont,
        },
        inputSelected: {
            fontSize: 14,
            fontFamily: props.mediumFont,
        },
        iconStyle: {
            marginRight: 10,
            width: 18,
            height: 18,
        },
        error: {
            color: '#FF0000',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
    });
