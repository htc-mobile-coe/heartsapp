import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        listItemContainer: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 15,
            marginBottom: 10,
            padding: 10,
            borderBottomColor: 'lightgray',
            borderBottomWidth: 2,
        },
        itemName: {
            flexShrink: 1,
            paddingEnd: 5,
        },
        itemRightContainer: {
            flexDirection: 'row',
        },
        itemCodeText: {
            marginEnd: 10,
        },
        blueIcon: {
            color: props.brandPrimary,
        },
        container: {
            flex: 1,
            justifyContent: 'space-around',
        },
        centerAlign: {
            alignItems: 'center',
            flex: 1,
            justifyContent: 'space-between',
        },
        centerText: {
            textAlign: 'center',
            marginTop: 30,
            fontSize: 12,
            color: 'grey',
        },
        placeImage: {
            marginBottom: 80,
        },
    });
