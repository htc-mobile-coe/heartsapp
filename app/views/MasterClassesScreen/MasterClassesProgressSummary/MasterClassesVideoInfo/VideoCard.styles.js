import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        rowContainer: {
            flex: 1,
            flexDirection: 'row',
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginVertical: 7,
            minHeight: 125,
        },
        imageStyle: {
            backgroundColor: '#ffffff',
            height: '100%',
            width: 123,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            marginRight: 1,
        },
        iconContainer: {
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
        },
        icon: {
            color: '#FFFFFF',
            fontSize: 24,
        },
        lockIcon: {
            color: '#FFFFFF',
            fontSize: 20,
        },
        iconCircle: {
            borderColor: '#FFFFFF',
            borderWidth: 2,
            borderRadius: 25,
            width: 50,
            height: 50,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        titleContainer: {
            flex: 1,
            paddingHorizontal: 20,
        },
        primaryColorText: {
            fontSize: 16,
            color: '#333333',
        },
        highlightedText: {
            fontSize: 25,
            color: props.brandPrimaryLight,
        },
        horizontalLine: {
            marginTop: -4,
            width: 18,
            height: 3,
            borderRadius: 3,
            backgroundColor: props.brandPrimary,
        },
        disabledHorizontalLine: {
            width: 20,
            height: 3,
            borderRadius: 3,
            backgroundColor: '#ffffff',
        },
        subTitleText: {
            fontSize: 14,
            color: '#333333',
            paddingVertical: 10,
        },
        durationContainer: {
            flexDirection: 'row',
            paddingBottom: 10,
            alignItems: 'center',
        },
        clockIcon: {
            color: props.brandPrimary,
            fontSize: 18,
            paddingRight: 5,
        },
        durationText: {
            fontSize: 14,
            color: props.brandPrimary,
            marginTop: 2,
        },
    });
