import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
        },
        videoCardContainer: {
            flexGrow: 1,
        },
        headerLeftContainer: {
            position: 'absolute',
            top: 44,
            marginLeft: 15,
            width: 50,
            alignItems: 'center',
            justifyContent: 'center',
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        leftArrowIcon: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        contentContainerStyle: {
            flex: 2,
            backgroundColor: '#FFFFFF',
            flexGrow: 1,
            flexDirection: 'column',
        },
        titleText: {
            color: '#605F5F',
            fontSize: 20,
            justifyContent: 'flex-end',
            paddingHorizontal: 20,
        },
    });
