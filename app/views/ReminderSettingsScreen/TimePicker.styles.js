import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: props.primaryBackground,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingVertical: 20,
        },
        headingContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        titleText: {
            fontSize: 20,
        },
        pickerStyle: {
            display: 'flex',
            alignItems: 'center',
            resizeMode: 'cover',
            marginTop: 20,
        },
        saveButtonContainer: {
            display: 'flex',
            justifyContent: 'center',
            borderColor: props.brandPrimary,
            margin: 20,
        },
        saveButtonText: {
            color: props.brandPrimary,
        },
        borderWidth: 1,
        borderRadius: 'full'
    });
