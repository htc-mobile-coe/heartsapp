import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        imageStyle: {
            backgroundColor: 'white',
            height: '100%',
            width: '100%',
        },
        overlayContainer: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            opacity: 0.3,
        },
        iconContainer: {
            position: 'absolute',
            top: -90,
            right: 0,
            bottom: 0,
            left: 0,
        },
        icon: {
            color: '#FFFFFF',
            fontSize: 24,
        },
        iconCircle: {
            borderColor: '#FFFFFF',
            borderWidth: 2,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        durationContainer: {
            backgroundColor: 'transparent',
            flexDirection: 'column',
            paddingHorizontal: 50,
            position: 'absolute',
            bottom: 100,
        },
        durationText: {
            color: '#ffffff',
            fontSize: 16,
        },
        durationTime: {
            color: '#ffffff',
            fontSize: 16,
        },
    });
