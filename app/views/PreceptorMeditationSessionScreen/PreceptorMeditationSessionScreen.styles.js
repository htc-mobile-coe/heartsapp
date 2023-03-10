import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        heading: {
            textAlign: 'center',
            fontSize: 20,
        },
        headingContainer: {
            justifyContent: 'center',
            paddingVertical: 10,
        },
        imageContainer: {
            flex: 1,
            aspectRatio: 1,
            width: '100%',
            marginTop: 50,
            alignItems: 'center',
            padding: 15,
        },

        image: {
            flex: 1,
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        bottomContainer: {
            flex: 1,
            justifyContent: 'center',
        },

        progressContainer: {
            alignSelf: 'stretch',
            paddingVertical: 2,
        },

        progressSubtextContainer: {
            alignSelf: 'stretch',
            paddingVertical: 15,
        },
        timerContainer: {
            paddingVertical: 8,
        },
        timerTextStyle: {
            fontSize: 34,
        },
        actionButtonContainer: {
            alignSelf: 'stretch',
            paddingHorizontal: 70,
            justifyContent: 'center',
        },
        actionButton: {
            backgroundColor: props.brandPrimary,
            alignSelf: 'stretch',
            marginVertical: 10,
            shadowOffset: { width: 0, height: 0 },
            shadowColor: '#000',
            shadowOpacity: 0.4,
            shadowRadius: 3,
            borderColor: props.brandPrimary,
            borderWidth: 1,
            elevation: props.elevation,
        },
        actionWhiteButton: {
            backgroundColor: 'white',
        },
        notNowButtonTitle: {
            color: props.brandPrimary,
        },
        activityIndicatorContainer: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
        },

        progressText: {
            textAlign: 'center',
        },

        progressSubtext: {
            textAlign: 'center',
            color: props.lightTextColor,
            paddingVertical: 5,
        },

        goToHomeButtonContainer: {
            alignItems: 'center',
            paddingVertical: 15,
        },
        goToHomeButton: {
            justifyContent: 'center',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        endSessionText: { marginVertical: 10 },
        bottomButtonContainer: {
            alignSelf: 'stretch',
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
        },
        postMeditationExperienceModalStyle: {
            justifyContent: 'flex-end',
            marginHorizontal: 0,
            marginBottom: 0,
        },
        nightModeContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 16,
        },
        nightModeText: {
            paddingHorizontal: 8,
        },

        screenContainerForNightMode: {
            backgroundColor: '#444444',
            padding: 12,
        },
        contentTextColor: {
            color: props.lightGrayColor,
        },
        contentTextColorForNightMode: {
            color: '#fff',
        },
        strongTextColor: {
            color: '#000',
        },
        strongTextColorForNightMode: {
            color: '#fff',
        },
        buttonBackgroundColor: {
            backgroundColor: props.brandPrimary,
        },
        buttonBackgroundColorForNightMode: {
            backgroundColor: '#000',
        },
        borderColor: { borderColor: props.brandPrimary },
        borderColorForNightMode: {
            borderColor: '#000',
        },
        acceptRequestText: {
            textAlign: 'center',
            marginVertical: 6,
        },
    });

export const SWITCH_COLOR = '#aeaeae';
