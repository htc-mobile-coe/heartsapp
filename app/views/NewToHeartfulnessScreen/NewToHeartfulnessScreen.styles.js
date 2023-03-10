import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },

        headingContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            paddingVertical: 12,
        },
        skipButtonContainer: {
            marginRight: 12,
            alignSelf: 'flex-end',
        },
        skipButton: {
            color: props.brandPrimary,
        },
        heading: {
            textAlign: 'center',
            color: '#4B4B4B',
            fontFamily: props.mediumFont,
            fontSize: 34,
            paddingTop:10
        },
        heartfulnessText: {
            textAlign: 'center',
            color: '#4B4B4B',
            fontFamily: props.mediumFont,
            fontSize: 16,
        },
        carouselContainer: {
            padding: 10,
            margin: 10,
            paddingHorizontal: 15,
            flexDirection: 'column',
        },

        bottomContainer: {
            flex: 1,
            marginVertical: 16,
            justifyContent: 'center',
        },
        pageControl: { marginVertical: 2 },
        indicatorSize: { width: 10, height: 10 },
        proceedButton: {
            marginHorizontal: 25,
            alignSelf: 'stretch',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#00000028',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        proceedButtonDisable: {
            backgroundColor: '#C1C1C1',
        },
    });
