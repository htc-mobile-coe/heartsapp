import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        bottomRowContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 12,
            paddingVertical: 16,
        },
        bottomRowLeftRightItem: { flex: 1 },
        bottomRowCenterItem: {
            flex: 5,
            justifyContent: 'center',
        },

        settingsTitle: {
            fontSize: 14,
            color: '#84869B',
        },
        subTitle: {
            fontSize: 14,
            marginTop: 6,
        },
        icon: {
            width: 40,
            height: 40,
            borderRadius: 20,
        },
        bottomLine: {
            backgroundColor: '#E1E1E1',
            height: 1,
        },
        profileBackground: {
            width: 30,
            height: 30,
            borderRadius: 100,
            backgroundColor: props.brandPrimary,
            justifyContent: 'center',
            alignItems: 'center',
            marginEnd: 12,
        },
        profileText: {
            color: '#ffffff',
            textAlignVertical: 'center',
            textAlign: 'center',
        },
    });

export const backgroundInactiveColor = '#E1E1E1';
export const circleInactiveColor = '#C1C1C1';
