import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        inputContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 0.5,
            borderColor: props.brandPrimary,
            height: 45,
        },
        input: {
            fontSize: 14,
            paddingRight: 36,
            paddingLeft: 10,
        },
        iconStyle: {
            marginRight: 10,
            width: 18,
            height: 18,
        },
        label: {
            fontSize: 12,
            color: '#828282',
            paddingBottom: 6,
            paddingLeft: 2,
        },
        error: {
            color: '#FF0000',
            fontSize: 12,
        },
    });
