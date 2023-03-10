import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        headingContainer: {
            flexDirection: 'row',
            paddingVertical: 20,
        },

        headerLeftContainer: {
            width: 70,
            alignItems: 'center',
            justifyContent: 'center',
        },

        headerCenterContainer: {
            flex: 1,
            justifyContent: 'center',
        },

        headerRightContainer: {
            width: 70,
        },
        titleContainer: {
            flex: 1,
            alignItems: 'center',
        },
        subTitle: {
            fontSize: 14,
            textAlign: 'center',
            marginTop: 10,
            color: 'red',
        },

        bodyContainer: {
            paddingHorizontal: 40,
        },

        tryAgainButton: {
            marginTop: 20,
            flex: 1,
        },
        helpDeskButton: {
            marginTop: 20,
            backgroundColor: '#fff',
            borderWidth: 1,
        },
        helpDeskButtonText: {
            color: props.brandPrimary,
        },
        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },

        backIcon: {
            justifyContent: 'center',
            alignSelf: 'center',
            color: props.brandPrimary,
        },

        infoText2: {
            paddingVertical: 20,
        },
    });
