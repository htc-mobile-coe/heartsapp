import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },

        headerStyle: {
            backgroundColor: '#FFFFFF',
            paddingLeft: 37,
            paddingTop: 16,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 30,
            paddingBottom: 30,
            paddingRight: 32,
        },
        backButtonStyle: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        headerText: {
            fontSize: 16,
            marginTop: 22,
            color: '#605F5F',
            lineHeight: 22,
        },
        contentContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        titleText: {
            marginTop: 30,
            fontSize: 18,
            textAlign: 'center',
        },
        subTitleText: {
            lineHeight: 30,
            fontSize: 24,
            color: props.highlightedTextColor,
            textAlign: 'center',
        },

        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 20,
            paddingBottom: 10,
            paddingRight: 30,
        },
        buttonStyle: {
            backgroundColor: props.brandPrimary,
            marginBottom: 20,
            flex: 1,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            marginLeft: 15,
        },
        buttonText: {
            color: '#FFFFFF',
            fontSize: 16,
        },
        imageContainer: {
            aspectRatio: 1.8,
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
        },
        backLeftArrow: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        headerBackButtonContainer: {
            width: 50,
            alignItems: 'flex-start',
        },
    });
