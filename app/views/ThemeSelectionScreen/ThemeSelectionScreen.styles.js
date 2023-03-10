import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: 'red',
            padding: 9,
        },
        bottomContainer: {
            padding: 6,
        },
        title: {
            fontSize: 25,
            color: 'black',
        },
        subTitle: {
            fontSize: 16,
            paddingHorizontal: 12,
            marginVertical: 15,
        },
        iconContainer: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        rowBackgroundImage: {
            flex: 1,
            borderRadius: 20,
            alignSelf: 'stretch',
            alignItems: 'flex-start',
            justifyContent: 'flex-start',
            paddingHorizontal: 20,
            paddingVertical: 15,
        },
        rowContainer: {
            flexDirection: 'row',
            marginVertical: 10,
            height: 110,
            borderRadius: 20,
        },
        headerContainer: {
            flexDirection: 'row',
            paddingTop: 15,
        },

        headerLeftContainer: {
            width: 50,
            alignItems: 'center',
            marginStart: 10,
        },
        radioText: {
            fontSize: 15,
            fontFamily: props.mediumFont,
            right: 10
        },
        headerCenterContainer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
        headerRightContainer: {
            width: 50,
        },
        icon: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        radioButtonView: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        radioButton: {
            marginEnd: 10,
        },
        radioInactiveColor: '#00000'
    });
