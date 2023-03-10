import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        header: {
            backgroundColor: '#ffffff',
        },
        headerText: {
            fontSize: 22,
        },
        subHeadingContainer: {
            flexDirection: 'row',
            paddingHorizontal: 70,
        },
        subTitle: {
            fontSize: 14,
            textAlign: 'center',
            marginBottom: 10,
        },

        bodyContainer: {
            paddingHorizontal: 40,
        },

        textArea: {
            flex: 1,
        },

        submitButton: {
            marginTop: 20,
            backgroundColor: props.brandPrimary,
        },

        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
        },
        modalContainerStyle: {
            backgroundColor: '#fff',
            padding: 10,
            borderRadius: 10,
            paddingVertical: 25,
        },

        modalHeading: {
            fontSize: 25,
            alignSelf: 'center',
        },

        modalMessage: {
            marginTop: 25,
            alignSelf: 'center',
            textAlign: 'center',
            fontSize: 14,
        },

        modalButtonContainer: {
            paddingHorizontal: 30,
        },

        contactInfoRow: {
            flexDirection: 'row',
            paddingVertical: 2,
        },

        contactInfoKey: {
            fontSize: 12,
            width: 85,
        },

        contactInfoValue: {
            fontSize: 12,
            color: props.brandPrimary,
        },

        contactInfoValueContainer: {
            flexWrap: 'wrap',
            flex: 1,
            flexDirection: 'row',
        },

        contactInfoAvailability: {
            fontSize: 12,
            marginLeft: 5,
        },

        contactInfoContainer: {
            paddingTop: 20,
        },

        contactInfoHeading: {
            fontSize: 16,
            paddingVertical: 20,
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'center',
        },

        reachUsText: {
            marginRight: 10,
        },

        contactInfoIcons: {
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginVertical: 10,
        },
        appVersionText: {
            fontSize: 10,
            marginTop: 20,
            textAlign: 'center',
        },
        diagnosticLogContainer: {
            marginTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
        },
        diagnosticCheckbox: {
            borderRadius: 0,
            borderColor: props.brandPrimary,
        },
        diagnosticLogTitle: {
            color: 'black',
        },
        stackSpace: 4,
    });
