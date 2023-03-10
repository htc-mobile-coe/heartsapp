import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#ffffff',
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
        },
        introductionContainer: {
            paddingHorizontal: 30,
        },
        headerBackButtonContainer: {
            alignItems: 'flex-start',
        },
        headerContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            paddingLeft: 5,
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        headerInfoContainer: {
            flex: 1,
            alignItems: 'flex-end',
        },
        infoButton: {
            borderRadius: 20,
            paddingRight: 30,
        },
        infoIcon: {
            color: props.brandPrimary,
            fontSize: 30,
        },
        buttonTextStyle: {
            color: props.brandPrimary,
        },
        pointContainer: {
            flexDirection: 'row',
            marginBottom: 10,
        },
        bulletinPointStyle: {
            alignItems: 'flex-start',
            marginTop: 3,
            color: props.brandPrimary,
            fontSize: 20,
            marginLeft: -3,
        },
        textStyle: {
            fontSize: 14,
            lineHeight: 20,
            color: '#333333',
            marginLeft: 5,
        },
        collapsedIntroContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 10,
            alignItems: 'center',
            marginBottom: 18,
        },
        meetDaajiButtonContainer: {
            alignItems: 'center',
        },
        meetDaajiButton: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            borderColor: props.brandPrimary,
            borderWidth: 1,
            marginLeft: 13,
        },
        thumbnail: {
            width: 60,
            height: 60,
        },
        expandedIntroContainer: {
            flex: 1,
            flexDirection: 'column',
            paddingVertical: 10,
        },
        thumbnailLarge: {
            width: 120,
            height: 120,
        },
        infoContainer: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        infoTextContainer: {
            flex: 1,
        },
        infoText: {
            fontSize: 14,
            lineHeight: 20,
            color: '#333333',
            marginLeft: 20,
        },
        introContainer: {
            flex: 1,
            paddingTop: 18,
            paddingBottom: 10,
        },
        introText: {
            fontSize: 14,
            lineHeight: 20,
            color: '#000000',
        },
        arrowButtonContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingBottom: 10,
        },
        arrowUp: {
            color: '#000000',
            fontSize: 20,
        },
    });
