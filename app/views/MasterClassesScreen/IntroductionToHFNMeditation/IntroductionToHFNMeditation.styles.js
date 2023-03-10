import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },

        headerStyle: {
            backgroundColor: '#FFFFFF',
            padding: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 30,
        },
        backButtonStyle: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        headerBackButtonContainer: {
            width: 50,
            alignItems: 'flex-start',
        },
        headerText: {
            fontSize: 15,
            marginTop: 22,
            marginBottom: 10,
            color: '#605F5F',
            paddingLeft: 16,
        },
        contentContainer: {
            alignItems: 'center',
            marginTop: 30,
            flex: 4,
            justifyContent: 'center',
        },
        textContainer: {
            marginTop: 41,
            alignItems: 'center',
        },
        titleText: {
            fontSize: 16,
            color: '#605F5F',
            marginTop: 5,
        },
        subTitleText: {
            fontSize: 24,
            color: props.highlightedTextColor,
        },
        descriptionText: {
            fontSize: 16,
            color: '#605F5F',
            marginTop: 8,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: 15,
            marginTop: 60,
            paddingRight: 22,
        },
        nextButtonStyle: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
            marginBottom: 20,
            flex: 1,
            elevation: 3,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            marginLeft: 10,
        },
        buttonText: {
            color: '#FFFFFF',
        },
        image: {
            width: 340,
            height: undefined,
            aspectRatio: 135 / 76,
        },
        backLeftArrow: {
            color: props.primaryBackground,
            fontSize: 20,
        },
    });
