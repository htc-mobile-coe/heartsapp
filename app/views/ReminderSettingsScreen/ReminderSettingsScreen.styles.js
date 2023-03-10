import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        viewSearchText: {
            flex: 1,
            padding: 20,
        },
        searchText: {
            borderColor: 'blue',
            fontSize: 10,
            height: 30,
            flex: 1,
        },
        icon: { paddingRight: 20, fontSize: 25 },
        viewButtonContainer: {
            flex: 1,
            paddingHorizontal: 20,
            justifyContent: 'space-between',
            marginTop: 10,
        },
        bigButton: {
            marginVertical: 15,
        },
    });
