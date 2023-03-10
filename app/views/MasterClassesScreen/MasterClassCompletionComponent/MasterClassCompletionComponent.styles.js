import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        headerButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            paddingTop: 10,
            paddingBottom: 15,
        },
        headerLeftContainer: {
            paddingLeft: 16,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        leftArrowIcon: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        skipButton: {
            color: props.brandPrimary,
            fontSize: 16,
        },
        carouselContainer: {
            flex: 4,
            flexDirection: 'column',
        },
        bottomContainer: {
            marginVertical: 16,
            justifyContent: 'center',
        },
        bottomButton: {
            marginHorizontal: 25,
            alignSelf: 'stretch',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#00000028',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        bottomButtonDisable: {
            backgroundColor: '#C1C1C1',
        },
    });
