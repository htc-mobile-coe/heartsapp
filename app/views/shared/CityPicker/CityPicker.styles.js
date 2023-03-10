import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: { flex: 1, flexDirection: 'column' },
        button: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingRight: 10,
        },
        cityText: {
            fontSize: 14,
        },
        error: {
            marginTop: 5,
            color: '#FF0000',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
        borderContainer: {
            borderWidth: 1.55,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            paddingLeft: 5,
            paddingRight: 5,
            minHeight: 48,
            flexDirection: 'row',
            alignItems: 'center',
        },
    });
