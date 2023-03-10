import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        headerContainer: {
            padding: 10,
            backgroundColor: '#FFFFFF',
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingRight: 10,
            paddingLeft: 24,
        },
        backButtonContainer: {
            flex: 0.2,
            alignItems: 'flex-start',
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 25,
            justifyContent: 'center',
            alignItems: 'center',
        },
        backArrow: {
            fontSize: 20,
            color: '#FFFFFF',
        },
        headerText: {
            fontSize: 20,
            textAlign: 'center',
        },
        headerRightIcon: {
            height: 34,
            width: 34,
        },
        rightContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            paddingRight: 5,
            flex: 0.2,
        },
        seekersCount: {
            height: 20,
            width: 20,
            backgroundColor: props.brandPrimary,
            borderRadius: 25,
            alignSelf: 'flex-end',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            bottom: 18,
            left: 20,
        },
        seekersCountText: {
            fontSize: 12,
            color: '#FFFFFF',
        },
    });
