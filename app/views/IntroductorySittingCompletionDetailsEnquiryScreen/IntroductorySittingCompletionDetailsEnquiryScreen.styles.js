import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'column',
        },
        headerStyle: {
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
            fontSize: 18,
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
            paddingVertical: 30,
        },
        titleContainer: {
            paddingHorizontal: 40,
            paddingVertical: 20,
        },
        questionText: {
            fontSize: 16,
            color: '#000000',
        },
        introductorySittingDaysCompletionEnquiryOptionsContainer: {
            display: 'flex',
            flexDirection: 'row',
            marginHorizontal: 40,
            paddingBottom: 20,
        },
        radio: {
            paddingVertical: 5,
            alignItems: 'center',
        },
        daysRadio: {
            marginRight: 5,
        },
        seperatorLine: {
            height: 0.8,
            marginHorizontal: 40,
            backgroundColor:
                props.introductorySittingCompletionDetailsEnquiryScreen_seperatorLineColor,
        },
        primaryColorText: {
            fontSize: 18,
            color: '#000000',
        },
        highlightedText: {
            fontSize: 24,
            color: props.highlightedTextColor,
        },
        approximateIntroductorySittingCompletionTimeOptionsContainer: {
            flex: 4,
            flexDirection: 'column',
            paddingHorizontal: 40,
        },
        timePeriodRadio: {
            alignItems: 'center',
            paddingVertical: 8,
        },
        radioColor: {
            color: '#9B9B9B',
        },
        radioLabel: {
            fontSize: 14,
            color: '#504F4F',
            alignItems: 'center',
            marginRight: 10,
            fontFamily: props.normalFont
        },
        bottomContainer: {
            flex: 1,
            paddingHorizontal: 40,
            paddingTop: 40,
        },
        submitButton: {
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
        },
        disableSubmitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: '#C1C1C1',
        },
        submitTextStyle: {
            alignSelf: 'center',
            color: '#ffffff',
        },
    });