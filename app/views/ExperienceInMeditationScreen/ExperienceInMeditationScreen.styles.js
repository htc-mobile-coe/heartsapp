import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        containerInnerView: {
            flex: 1,
            justifyContent: 'space-between',
            paddingBottom: 60,
        },

        headingContainer: {
            justifyContent: 'flex-end',
        },

        spannableButtonsView: {
            flex: 1,
            paddingHorizontal: 30,
            paddingVertical: 15,
        },

        spannableButtonStyle: {
            marginTop: 25,
        },
        headerStyle: {
            justifyContent: 'space-between',
            backgroundColor: '#FFFFFF',
            paddingHorizontal: 30,
            paddingTop: 30,
            paddingBottom: 15,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        skipButtonStyle: {
            alignItems: 'flex-end',
        },
        skipText: {
            color: props.brandPrimary,
            fontFamily: props.mediumFont,
            fontSize: 16,
        },
        titleText: {
            color: '#605F5F',
            fontFamily: props.normalFont,
            fontSize: 20,
            justifyContent: 'flex-end',
            paddingTop: 10,
            paddingHorizontal: 20,
        },
    });
