import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        viewButtonContainer: {
            flex: 1,
            paddingHorizontal: 25,
            justifyContent: 'space-between',
        },
        subTitle: {
            fontSize: 16,
            paddingHorizontal: 12,
            marginVertical: 15,
        },
        myAccountRow: {
            marginTop: 20,
            padding: 6,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            borderRadius: 4,
        },
        myAccountRightArrowIcon: {
            right: 18,
            position: 'absolute',
        },
    });
