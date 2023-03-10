import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 20,
            backgroundColor: '#FFFFFF',
            borderRadius: 5,
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 1,
        },
        textContainer: {
            paddingLeft: 20,
        },
        iconContainer: {
            width: 50,
            padding: 20,
        },
        textStyle: {
            color: 'black',
            fontFamily: props.normalFont,
            fontSize: 16,
            paddingTop: 5,
        },
        iconStyle: {
            color: props.brandPrimary,
            fontSize: 20,
        },
    });
