import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';
import { IsIOS } from '../../shared/Constants';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        heading: {
            textAlign: 'center',
            color: props.normalTextColor,
        },
        headingContainer: {
            flex: 0.5,
            justifyContent: 'center',
            paddingHorizontal: 20,
        },
        imageContainer: {
            flex: 1,
            aspectRatio: 1,
            paddingTop: 15,
            alignItems: 'center',
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
        image: {
            flex: 1,
            width: '100%',
            aspectRatio: 1,
            resizeMode: 'contain',
        },
        bottomContainer: {
            flex: 0.7,
            paddingBottom: 10,
        },

        progressContainer: {
            alignSelf: 'stretch',
            paddingVertical: 10,
        },
        instructionContainer: {
            marginTop: 12,
            alignSelf: 'stretch',
            paddingHorizontal: 12,
        },
        preparationContainer: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        waitingInstructionHeading: {
            alignSelf: 'stretch',
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
        meditationTextStatus: {
            textAlign: 'center',
            marginVertical: 8,
            fontSize: 16,
            color: props.lightGrayColor,
        },
        progressTextCenter: {
            textAlign: 'center',
            color: props.lightGrayColor,
        },
        progressTextLeft: {
            textAlign: 'left',
            lineHeight: 20,
            color: props.lightGrayColor,
        },
        progressHighlightText: {
            color: props.brandPrimary,
        },
        connectedTrainer: {
            textAlign: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 6,
            alignSelf: 'stretch',
        },
        connectedText: {
            ...Platform.select({ ios: { marginTop: 5 }, android: {} }),
        },
        goToHomeButtonContainer: {
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
        },
        meditationInstructionHeadingLeft: {
            color: props.lightGrayColor,
            textAlign: 'left',
            paddingVertical: 8,
        },
        meditationInstructionHeadingCenter: {
            color: props.lightGrayColor,
            textAlign: 'center',
            paddingVertical: 8,
        },
        timerContainer: {
            paddingVertical: 5,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        timerTextStyle: {
            fontSize: 38,
            color: props.iconStyle,
        },
        reminderButton: {
            borderWidth: 2,
            borderColor: props.brandPrimary,
            marginBottom: 30,
        },
        reminderButtonText: {
            color: props.brandPrimary,
        },
        goToHomeButton: {
            justifyContent: 'center',
            width: 260,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
        },
        viewModalContainer: {
            flex: 1,
            justifyContent: 'space-between',
            marginTop: '30%',
            marginBottom: '30%',
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            borderWidth: 1,
            borderColor: 'rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white',
        },
        viewButtonContainer: {
            flex: 1,
            justifyContent: 'space-around',
            alignItems: 'stretch',
            paddingLeft: 40,
            paddingRight: 40,
            paddingTop: 40,
        },
        viewModalHeadingContainer: {
            backgroundColor: props.brandPrimary,
            paddingVertical: 34,
            flexDirection: 'row',
        },
        titleContainer: {
            flex: 1,
            color: '#fff',
            textAlign: 'center',
        },
        modalButton: {
            backgroundColor: props.brandPrimary,
            paddingVertical: 10,
            borderRadius: 20,
        },
        buttonTitle: {
            textAlign: 'center',
            color: props.inverseTextColor,
        },
        cancelButtonContainer: {
            alignSelf: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
        },
        cancelButton: {
            justifyContent: 'center',
            width: 260,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        disabledCancelButton: {
            justifyContent: 'center',
            width: 260,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: '#b3b3b3',
        },
        nightModeToggle: {
            marginLeft: 15,
        },
        screenContainer: {
            backgroundColor: '#fff',
            padding: 12,
        },
        screenContainerForNightMode: {
            backgroundColor: '#444444',
            padding: 12,
        },
        timerIconTintColor: {
            tintColor: '#000',
        },
        timerIconTintColorForNightMode: {
            tintColor: '#fff',
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
            borderColor: '#fff',
        },
        normalTextColor: {
            color: props.brandPrimary,
        },
        normalTextColorForNightMode: {
            color: '#fff',
        },
        postMeditationExperienceModalStyle: {
            justifyContent: 'flex-end',
            marginHorizontal: 0,
            marginBottom: 0,
        },
        waitingInstructionContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 5,
        },

        guideLineContainer: {
            flex: 1,
            flexDirection: 'column',
            marginTop: 5,
            marginLeft: -5,
        },

        guideLinePoint: {
            flexDirection: 'row',
            marginVertical: 6,
        },
        guideLineAccordion: {
            flexDirection: 'row',
            marginTop: 4,
        },
        lensIcon: {
            fontSize: 13,
            marginRight: 10,
        },
        infoIcon: {
            fontSize: 17,
            marginTop: 2,
            marginRight: 10,
        },
        guideLineAccordionButton: {
            marginTop: IsIOS ? 2 : 0,
        },
        guideLineInstructionText: {
            flex: 1,
            marginTop: IsIOS ? 2 : 0,
            marginRight: 2,
            padding: 0,
            textAlign: 'left',
            fontSize: 13,
            lineHeight: 17,
            color: props.lightGrayColor,
        },
        bulletPointIcon: {
            fontSize: 20,
            marginRight: 10,
        },
        bulletIconPointForNightMode: {
            color: '#fff',
        },
        bulletPointHighlightText: {
            color: props.brandPrimary,
        },
    });

export const SWITCH_COLOR = '#aeaeae';
