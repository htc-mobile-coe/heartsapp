import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            padding: 12,
        },

        subTitle: {
            fontSize: 16,
            paddingHorizontal: 12,
            marginVertical: 15,
            flex: 0.7,
        },
        weeklyInspirationSwitch: {
            marginHorizontal: 12,
        },
        weeklyInspirationSwitchContainer: {
            flex: 0.3,
            alignItems: 'flex-end',
        },
        weeklyInspirationRow: {
            marginTop: 20,
            padding: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 4,
        },
    });
