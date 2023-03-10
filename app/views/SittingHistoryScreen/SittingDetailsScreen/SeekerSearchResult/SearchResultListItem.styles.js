import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        rowContainer: {
            flexDirection: 'row',
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 10,
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            marginVertical: 8,
            marginHorizontal: 25,
            borderWidth: 1,
            borderColor: props.brandPrimary,
        },
        listItemContainer: {
            flex: 1,
            flexDirection: 'column',
            paddingHorizontal: 15,
        },
        listSubItemContainer: {
            flexDirection: 'row',
            paddingVertical: 4,
            alignItems: 'center',
        },
        primaryColorText: {
            fontSize: 14,
            color: '#747474',
            paddingLeft: 15,
        },
        nameText: {
            fontSize: 16,
            color: '#1B2541',
            paddingLeft: 15,
        },
        iconStyle: {
            height: 15,
            width: 15,
        },
        tickImageContainer: {
            position: 'absolute',
            right: 14,
            alignItems: 'flex-end',
            justifyContent: 'flex-end',
            elevation: 2,
        },
        tickImage: {
            height: 35,
            width: 35,
        },
    });
