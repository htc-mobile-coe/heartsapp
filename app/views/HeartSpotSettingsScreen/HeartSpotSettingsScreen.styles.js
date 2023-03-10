import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        headingContainer: {
            flex: null,
        },
        topContainer: {
            flex: 1,
        },
        map: {
            flex: 1,
        },
        gpsLocationButton: {
            marginHorizontal: 30,
            position: 'absolute',
            bottom: 16,
            left: 0,
            right: 0,
            justifyContent: 'center',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        gpsLocationButtonTitle: {
            color: '#fff',
        },

        bottomContainer: {
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 16,
        },
        settingsContainer: {
            marginVertical: 5,
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: 12,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
        },
        settingsHeading: {
            fontSize: 24,
            marginVertical: 12,
        },
        locationNotAvailableContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        locationNotAvailableImage: {
            height: '100%',
            width: '100%',
        },
        locationNotAvailableTextContainer: {
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
        },
        locationNotAvailableText: {
            color: '#FFFFFF',
            fontSize: 15,
        },
    });
