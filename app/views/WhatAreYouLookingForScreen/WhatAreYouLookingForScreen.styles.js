import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexBasis: 'auto',
        },

        tileContainerStyle: {
            paddingHorizontal: 35,
            paddingTop: 20,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        continueButtonContainer: {
            paddingHorizontal: 42,
            marginTop: 16,
        },
        continueButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
            marginBottom: 20,
        },
        headerStyle: {
            backgroundColor: '#FFFFFF',
            padding: 30,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        skipButtonContainer: {
            alignItems: 'flex-end',
            paddingEnd: 20,
        },
        skipButtonStyle: {
            alignItems: 'flex-end',
        },
        skipText: {
            color: props.brandPrimary,
        },
        continueText: {
            color: '#FFFFFF',
        },
        continueButtonDisabled: {
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
            backgroundColor: '#C1C1C1',
        },
        buttonBorderRadius: 'full',
    });
