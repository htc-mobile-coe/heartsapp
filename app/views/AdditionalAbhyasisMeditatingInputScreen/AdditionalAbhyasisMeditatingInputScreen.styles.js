// import Variables from '../../styles/theme/variables';
import { IsAndroid } from '../../shared/Constants';
import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        container: {
            flexDirection: 'column',
            backgroundColor: 'white',
            borderRadius: 4,
        },
        header: {
            backgroundColor: '#ffffff',
            marginTop: 12,
        },
        modalContentView: {
            flexDirection: 'column',
        },
        textContainer: {
            alignItems: 'center',
        },

        text: {
            fontSize: 16,
            textAlign: 'center',
        },

        inputContainer: {
            paddingTop: 20,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-around',
            width: 200,
        },

        additionalIcons: {
            color: props.brandPrimary,
            fontSize: 24,
        },

        input: {
            textAlign: 'center',
        },
        inputBackground: {
            width: 120,
            backgroundColor: 'white',
            borderColor: props.brandPrimary,
        },
        buttonContainer: {
            paddingHorizontal: 30,
            marginTop: 80,
            marginBottom: 20,
        },
        buttonLessTopMarginContainer: {
            paddingHorizontal: 30,
            marginTop: 20,
            marginBottom: 20,
        },

        button: {
            marginBottom: 10,
            backgroundColor: props.brandPrimary,
        },

        validationErrorText: {
            color: 'red',
            alignSelf: 'flex-end',
            fontSize: 12,
            paddingRight: 30,
            paddingHorizontal: 10,
            paddingTop: 5,
        },
        image: {
            flex: 1,
            width: 15,
            height: 15,
            resizeMode: 'contain',
        },
        centerImage: {
            width: 180,
            height: 180,
            alignSelf: 'center',
            resizeMode: 'contain',
            marginTop: 40,
            marginBottom: 20,
        },
        headingView: {
            alignItems: 'center',
            marginBottom: 40,
        },
        centerContainer: {
            backgroundColor: props.lightPrimary,
            alignItems: 'center',
            paddingVertical: 20,
        },
        subHeadingTextView: {
            flexDirection: 'row',
            flex: 1,
            justifyContent: 'center',
        },
        contextText: {
            paddingTop: IsAndroid ? 0 : 3,
        },
        dndInstructionContainer: {
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 5,
        },
        dndInstructionTitleText: {
            color: 'gray',
            paddingVertical: 20,
            fontSize: 14,
            textAlign: 'center',
        },
        dndInstructionText: {
            color: 'gray',
            fontSize: 14,
            textAlign: 'center',
        },
        dndInstructionHighlightedText: {
            color: '#cc0000',
            fontSize: 14,
        },
    });
