import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        width: 40,
        height: 30,
        borderRadius: 25,
        justifyContent: 'center',
    },
    trackContainer: {
        left: 0,
        right: 0,
        position: 'absolute',
        height: 40,
        borderRadius: 25,
        overflow: 'visible',
        justifyContent: 'center',
    },
    track: {
        left: 0,
        right: 0,
        position: 'absolute',
        height: 14,
        borderRadius: 25,
    },
    switchInnerCircle: {
        borderRadius: 20,
        borderWidth: 3,
        borderColor: '#ffffff',
        shadowRadius: 3,
        shadowColor: '#666666',
        shadowOpacity: 0.2,
        elevation: 3,
    },
});
