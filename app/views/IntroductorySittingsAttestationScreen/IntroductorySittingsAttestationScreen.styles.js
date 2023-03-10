import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        headerStyle: {
            flex: 1.8,
            backgroundColor: '#FFFFFF',
            paddingTop: 10,
            paddingLeft: 20,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        headerBackButtonContainer: {
            width: 50,
            alignItems: 'flex-start',
        },
        leftArrowIcon: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        titleText: {
            color: '#605F5F',
            fontFamily: props.normalFont,
            fontSize: 16,
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingTop: 23,
            paddingBottom: 50,
        },
        titleContainer: {
            flex: 1.5,
            paddingLeft: 50,
            paddingTop: 80,
            paddingBottom: 40,
        },
        primaryColorText: {
            fontSize: 18,
            color: '#000000',
            paddingVertical: 5,
            fontFamily: props.normalFont,
        },
        highlightedText: {
            fontSize: 24,
            color: props.highlightedTextColor,
        },
        radiosContainer: {
            flex: 4,
        },
        radio: {
            alignItems: 'center',
            paddingHorizontal: 50,
            paddingVertical: 10,
        },
        radioColor: {
            color: '#9B9B9B',
        },
        radioLabel: {
            fontSize: 16,
            fontFamily: props.normalFont,
            color: '#504F4F',
            alignItems: 'center',
        },
        bottomContainer: {
            flex: 1.5,
            paddingHorizontal: 40,
            paddingTop: 40,
        },
        submitButton: {
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
        },
        submitTextStyle: {
            alignSelf: 'center',
            color: '#ffffff',
        },
    });
