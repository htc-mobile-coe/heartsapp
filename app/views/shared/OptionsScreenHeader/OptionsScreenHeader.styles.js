import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#F7F8F9',
            borderBottomStartRadius: 3,
            borderBottomEndRadius: 3,
            padding: 10,
        },
        leftContainer: {
            flex: 0.2,
            justifyContent: 'center',
        },
        backButton: {
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
        },

        centerContainer: {
            flex: 1,
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
        },

        rightContainer: {
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },

        headerText: {
            color: props.brandPrimary,
            fontSize: 20,
            alignSelf: 'center',
        },
        searchIcon: {
            fontSize: 20,
        },
    });
