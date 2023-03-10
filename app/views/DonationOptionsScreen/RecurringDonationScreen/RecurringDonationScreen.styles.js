import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        webView: { flex: 15 },
        header: {
            backgroundColor: '#ffffff',
            alignItems: 'center',
        },
        activityIndicatorView: {
            flex: 1,
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'absolute',
        },
        statusContainer: {
            flex: 0.8,
        },
        centerContainer: {
            flex: 1,
            paddingVertical: 30,
            paddingHorizontal: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        iconGreenCircle: {
            backgroundColor: '#008000',
            justifyContent: 'center',
            alignItems: 'center',
            height: 64,
            width: 64,
            borderRadius: 64,
            marginBottom: 20,
        },
        iconRedCircle: {
            backgroundColor: '#FF0000',
            justifyContent: 'center',
            alignItems: 'center',
            height: 64,
            width: 64,
            borderRadius: 64,
            marginBottom: 20,
        },
        thankYou: {
            fontSize: 26,
            marginBottom: 15,
        },
        subTitle: {
            textAlign: 'center',
        },
        backToHomeButton: {
            marginBottom: 20,
            backgroundColor: props.brandPrimary,
        },
        retryButton: {
            marginBottom: 20,
            borderColor: props.brandPrimary,
            borderWidth: 1,
        },
        whiteIcon: {
            color: '#FFFFFF',
            fontSize: 30,
        },
        actionButtonContainer: {
            paddingHorizontal: 30,
        },
    });
