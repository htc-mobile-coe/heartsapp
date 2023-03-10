import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            bottom: 0,
            height: 375,
        },
        contentContainerStyle: {
            paddingTop: 32,
        },
        headerStyle: {
            paddingHorizontal: 35,
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        versionTextStyle: {
            alignSelf: 'flex-end',
            fontSize: 12,
        },
        textContainer: {
            paddingHorizontal: 35,
            marginTop: 28,
        },
        whatsNewTextStyle: {
            fontSize: 16,
            marginBottom: 19,
        },
        description: {
            color: '#4B4B4B',
            fontSize: 12,
            marginBottom: 5,
        },
        learnMoreButtonContainer: {
            paddingHorizontal: 35,
        },
        learnMoreButtonStyle: {
            marginTop: 16,
        },
        learnMoreTextStyle: {
            color: props.brandPrimary,
        },
        bottomButtonContainer: {
            marginTop: 30,
            paddingBottom: 33,
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
        },

        remindMeLaterButtonStyle: {
            justifyContent: 'center',
            width: '48%',
            borderWidth: 1,
        },
        remindMeLaterTextStyle: {
            fontSize: 13,
        },
        updateButtonStyle: {
            justifyContent: 'center',
            width: '48%',
        },
        updateButtonTextStyle: {
            fontSize: 13,
        },
        heading: {
            color: '#333333',
            fontSize: 20,
        },

        submitButton: {
            display: 'flex',
            justifyContent: 'center',
            backgroundColor: props.brandPrimary,
            marginVertical: 27,
        },
    });
