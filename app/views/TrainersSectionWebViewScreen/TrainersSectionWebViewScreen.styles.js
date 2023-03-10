import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        webViewContainer: { flex: 1 },
        webView: {
            overflow: 'hidden',
            flex: 15,
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
        },
        headerContainer: {
            paddingHorizontal: 20,
            paddingVertical: 12,
            backgroundColor: '#ffffff00',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 35,
        },
        backButtonContainer: {
            flex: 0.1,
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            height: 32,
            width: 32,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: '#FFFFFF',
        },
        headerText: {
            fontSize: 20,
            textAlign: 'center',
            color: '#010000',
        },
        rightContainer: {
            flex: 0.1,
        },
    });
