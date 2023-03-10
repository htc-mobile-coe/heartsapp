import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        headerBackButtonContainer: {
            flex: 0.2,
        },
        headerContainer: {
            flex: 1,
            flexDirection: 'row',
            paddingVertical: 20,
            paddingLeft: 5,
            justifyContent: 'space-between',
        },
        headerTextStyle: {
            fontSize: 24,
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        headerInfoContainer: {
            alignItems: 'center',
            flex: 0.8,
            marginTop: 5,
            marginRight: 50,
        },
        timerCounterContainer: {
            flex: 1,
            justifyContent: 'center',
        },
        imageContainer: {
            aspectRatio: 4.5,
            paddingTop: 15,
            alignItems: 'center',
        },
        nightModeContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 40,
        },
        nightModeText: {
            paddingHorizontal: 8,
        },
        image: {
            flex: 1,
            width: '100%',
            resizeMode: 'cover',
        },
        centerContainer: {
            flex: 1,
        },
        bottomContainer: {
            flex: 1,
        },
        timerContainer: {
            paddingVertical: 5,
            flexDirection: 'row',
            justifyContent: 'center',
        },
        timerTextStyle: {
            fontSize: 60,
            color: props.iconStyle,
        },
        timerButtonContainer: {
            paddingVertical: 10,
            paddingHorizontal: 30,
        },
        timerButton: {
            justifyContent: 'center',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
        },
        addSeekerDetailsButtonContainer: {
            paddingVertical: 10,
            paddingHorizontal: 30,
        },
        addSeekerDetailsButton: {
            justifyContent: 'center',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            borderWidth: 1,
            borderColor: props.brandPrimary,
        },
        nightModeToggle: {
            marginLeft: 15,
        },
        screenContainer: {
            backgroundColor: '#FFFFFF',
        },
        screenContainerForNightMode: {
            backgroundColor: '#000000',
        },
        contentContainerStyle: {
            flexGrow: 1,
        },
        timerIconTintColor: {
            tintColor: '#000',
        },
        timerIconTintColorForNightMode: {
            tintColor: '#444343',
        },
        connectedText: {
            fontSize: 13,
            textAlign: 'center',
            marginTop: 10,
        },
        progressText: {
            fontSize: 16,
            marginLeft: 25,
        },
        contentTextColor: {
            color: '#747474',
        },
        contentTextColorForNightMode: {
            color: '#444343',
        },
        strongTextColor: {
            color: '#333333',
        },
        strongTextColorForNightMode: {
            color: '#444343',
        },
        toggleSwitchTextColor: {
            color: '#030303',
        },
        toggleSwitchTextColorForNightMode: {
            color: '#FFFFFF',
        },
        addSeekerButton: {
            backgroundColor: '#000000',
        },
        addSeekerButtonForNightMode: {
            backgroundColor: '#FFFFFF',
        },
        buttonBackgroundColor: {
            backgroundColor: props.brandPrimary,
        },
        buttonBackgroundColorForNightMode: {
            backgroundColor: '#202020',
        },
        borderColor: { borderColor: props.brandPrimary },
        borderColorForNightMode: {
            borderColor: '#3A3A3A',
        },
        normalTextColor: {
            color: props.brandPrimary,
        },
        normalTextColorForNightMode: {
            color: '#fff',
        },
        timerCounterHeaderContainer: {
            justifyContent: 'center',
            alignItems: 'center',
        },
        timerIcon: {
            height: 30,
            width: 30,
            tintColor: '#000000',
        },
        timerIconNightMode: {
            height: 30,
            width: 30,
            tintColor: '#747474',
        },
    });

export const SWITCH_COLOR = '#aeaeae';
