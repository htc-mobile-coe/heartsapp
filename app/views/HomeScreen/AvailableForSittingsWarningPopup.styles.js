import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: 4,
        },
        closeButtonContainer: {
            flexDirection: 'row',
            alignSelf: 'flex-end',
            paddingRight: 8,
            paddingTop: 5,
        },
        closeIcon: {
            fontSize: 20,
            color: '#EE0000',
        },

        buttonContainer: {
            paddingHorizontal: 25,
            paddingTop: 10,
            paddingBottom: 20,
        },

        textContainer: {
            paddingHorizontal: 10,
            paddingVertical: 10,
        },

        text: {
            fontSize: 16,
        },
        okButton: {
            backgroundColor: props.brandPrimary,
        },
    });
