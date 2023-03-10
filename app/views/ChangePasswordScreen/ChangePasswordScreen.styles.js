import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        header: { flex: null },
        container: {
            flex: 1,
            margin: 15,
            borderRadius: 5,
        },
        passwordTitle: {
            fontSize: 16,
            paddingHorizontal: 12,
            marginVertical: 15,
            color: props.lightGrayColor,
        },
        passwordCardBodyContainer: {
            justifyContent: 'space-around',
            height: 200,
            backgroundColor: '#FFFFFF',
        },
        validationErrorText: {
            marginTop: 5,
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
            paddingHorizontal: 20,
        },
        inputItem: {
            width: '90%',
            height: 12,
            borderWidth: 2,
            borderColor: props.brandPrimary,
        },
        updateButton: {
            marginTop: 90,
            marginHorizontal: 30,
            backgroundColor: props.brandPrimary,
        },
        stackSpace: 6,
    });
