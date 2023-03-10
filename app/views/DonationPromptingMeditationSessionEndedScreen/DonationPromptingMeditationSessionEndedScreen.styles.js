import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        timeContainer: {
            alignItems: 'center',
            marginBottom: 20,
        },
        timeTitle: {
            fontSize: 16,
            color: '#727270',
            marginBottom: 6,
        },
        pickerTextColor: {
            color: 'black',
        },
        amountContainer: {
            backgroundColor: props.lightPrimary,
            paddingVertical: 30,
            paddingHorizontal: 50,
        },
        messageView: {
            marginHorizontal: 50,
            marginTop: 80,
            marginBottom: 60,
        },
        messageText: {
            textAlign: 'center',
            fontSize: 14,
        },
        minimumAmountErrorView: {
            marginTop: 20,
        },
        minimumAmountErrorText: {
            textAlign: 'center',
            color: 'red',
            fontSize: 14,
        },
        amountText: {
            textAlign: 'center',
            marginBottom: 17,
            fontSize: 18,
        },
        amountInputContainer: {
            marginBottom: 26,
        },
        amountInputView: {
            flexDirection: 'row',
            alignSelf: 'center',
            height: 48,
            width: 260,
            borderWidth: 2,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            backgroundColor: 'white',
            paddingHorizontal: 5,
        },
        currency: {
            color: 'white',
            alignItems: 'center',
            flexDirection: 'row',
            marginEnd: 10,
        },
        currencyText: {
            alignSelf: 'center',
            marginEnd: 10,
        },
        verticalLine: {
            width: 2,
            backgroundColor: props.brandPrimary,
            marginVertical: 5,
        },
        amountInput: {
            minWidth: 60,
            flex: 1,
            marginLeft: 10,
        },
        errorText: {
            color: 'red',
            fontSize: 14,
            alignSelf: 'flex-end',
            marginEnd: 28,
        },
        quickAmountContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 20,
        },
        quickAmount: {
            paddingHorizontal: 10,
            paddingVertical: 5,
            marginHorizontal: 5,
            borderWidth: 2,
            borderColor: props.brandPrimary,
            borderRadius: 5,
            backgroundColor: 'white',
            width: 80,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        quickAmountText: {
            color: props.brandPrimary,
        },
        homeButtonContainer: {
            paddingVertical: 90,
            paddingHorizontal: 50,
        },
        donateButton: {
            marginBottom: 20,
            backgroundColor: props.brandPrimary,
        },
        centerContainer: {
            paddingVertical: 30,
            paddingHorizontal: 50,
            alignItems: 'center',
        },

        goToHomeButtonContainer: {
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
        },
        goToHomeButton: {
            justifyContent: 'center',
            width: 260,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        timerContainer: {
            paddingVertical: 5,
        },
        timerTextStyle: {
            fontSize: 38,
            color: props.iconStyle,
        },
        imageContainer: {
            flex: 1,
            aspectRatio: 1.2,
            paddingTop: 50,
            alignItems: 'center',
        },
        image: {
            flex: 1,
            width: '100%',
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        bottomContainer: {
            flex: 0.7,
            paddingBottom: 10,
        },
        meditationTextStatus: {
            textAlign: 'center',
            marginVertical: 8,
            fontSize: 16,
            color: props.lightGrayColor,
        },
        instructionContainer: {
            marginTop: 12,
            alignSelf: 'stretch',
            alignItems: 'center',
            paddingHorizontal: 12,
        },
    });
