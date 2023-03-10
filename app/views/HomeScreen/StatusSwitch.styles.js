import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
    },
    textContainer: { flex: 1, alignItems: 'flex-start' },
    switchContainer: { alignItems: 'flex-end' },
    statusTextStyle: {
        fontSize: 14,
        color: '#4B4B4B',
    },
});

export const backgroundInactiveColor = '#E1E1E1';
export const circleInActiveColor = '#C1C1C1';
