import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            alignSelf: 'center',
            marginTop: 20
        },

        headingContainer: {
            flex: 0.3,
            justifyContent: 'center',
        },

        imageContainer: {
            flex: 0.5,
            alignItems: 'center',
        },

        image: {
            flex: 1,
            resizeMode: 'contain',
        },

        optionsContainer: {
            flex: 1,
        },

        heading: {
            textAlign: 'center',
            color: 'black',
            fontFamily: props.mediumFont,
            fontSize: 34,
            paddingVertical: 10,
        },

        subHeading: {
            textAlign: 'center',
            color: 'black',
            fontFamily: props.normalFont,
            fontSize: 20,
        },

        buttonContainer: {
            flexDirection: 'column',
            marginTop: 10,
            paddingHorizontal: 40,
        },

        primaryColorContainer: {
            backgroundColor: props.brandPrimary,
        },

        whiteColor: {
            color: '#FFFFFF',
        },
    });
