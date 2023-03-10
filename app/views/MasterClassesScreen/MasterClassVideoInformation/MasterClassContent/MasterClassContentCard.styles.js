import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            zIndex: 1,
            marginTop: -90,
            paddingHorizontal: 20,
            backgroundColor: '#ffffff',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
        },
        cardContainer: {
            flex: 1,
        },
        headerContainer: {
            flexDirection: 'row',
            paddingHorizontal: 30,
            paddingTop: 20,
            paddingVertical: 10,
            alignItems: 'center',
            justifyContent: 'center',
        },
        heading: {
            flex: 2,
            color: '#000000',
            fontSize: 16,
            paddingVertical: 6,
            alignItems: 'center',
        },
        dayTitleContainer: {
            flex: 1,
            paddingHorizontal: 10,
            backgroundColor: props.lightPrimaryBackground,
            paddingVertical: 6,
            borderRadius: 5,
        },
        dayTitle: {
            color: props.masterClassesScreen_titleColor,
            fontSize: 18,
            textAlign: 'center',
        },
        headerLine: {
            height: 1,
            marginHorizontal: 30,
            backgroundColor: props.mediumPrimary,
        },
        informationContainer: {
            flexDirection: 'row',
            paddingHorizontal: 30,
            alignItems: 'center',
            marginVertical: 15,
        },
        title: {
            flex: 1.5,
            color: '#333333',
            fontSize: 18,
            paddingVertical: 6,
        },
        descriptionContainer: {
            paddingHorizontal: 30,
        },
        primaryColorText: {
            fontSize: 14,
            color: '#333333',
            paddingVertical: 10,
            lineHeight: 20,
        },
        highlightedText: {
            fontSize: 14,
            color: '#333333',
        },
        learnMoreButton: {
            marginVertical: 15,
            width: '40%',
        },
        learnMoreButtonStyle: {
            marginLeft: 30,
        },
        learnMoreTextStyle: {
            color: props.brandPrimary,
            fontSize: 16,
        },
        buttonContainer: {
            marginVertical: 20,
            marginHorizontal: 25,
            justifyContent: 'flex-start',
            alignSelf: 'stretch',
            paddingBottom: 120,
        },
        continueButton: {
            backgroundColor: props.brandPrimary,
        },
        disableContinueButton: {
            backgroundColor: '#C1C1C1',
        },
        languageContainer: {
            flex: 1,
            height: 32,
            borderRadius: 5,
        },
        dropDown: {
            height: 32,
            color: '#2E294E',
            fontSize: 10,
        },
        iosIcon: {
            bottom: 5,
            right: 5,
        },
        languageTextStyle: {
            fontSize: 13,
        },
    });
