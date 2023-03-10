import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            flexDirection: 'row',
            borderBottomStartRadius: 3,
            borderBottomEndRadius: 3,
        },

        leftContainer: {
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 5,
        },

        profileBackground: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: props.brandPrimary,
            justifyContent: 'center',
            alignItems: 'center',
        },

        profileText: {
            borderRadius: 25,
            fontSize: 20,
            color: 'white',
            textAlignVertical: 'center',
            textAlign: 'center',
        },

        centerContainer: {
            flex: 1,
            padding: 5,
        },

        rightContainer: {
            width: 72,
            alignItems: 'center',
            justifyContent: 'center',
        },

        userDataContainer: {
            flex: 1,
            padding: 10,
            flexDirection: 'row',
        },

        userDataText: {
            color: 'black',
            fontSize: 20,
        },

        userName: {
            paddingLeft: 5,
        },

        loginLogoutButton: {
            fontSize: 20,
        },

        loginLogoutText: {
            fontSize: 10,
            textAlign: 'center',
        },

        loginLogoutIconContainer: {
            alignItems: 'center',
        },
        thumbnail: {
            borderWidth: 2,
            borderColor: '#FFFFFF',
            backgroundColor: '#FFFFFF',
        },
    });
