import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        scrollView: {
            flexGrow: 1,
        },
        mainView: {
            flex: 1,
        },
        container: {
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 17,
            paddingHorizontal: 36,
            height: '100%',
            paddingBottom: 35,
        },

        contentContainer: {
            paddingBottom: 25,
        },
        imageContainer: {
            paddingTop: 32,
            paddingBottom: 25,
            alignItems: 'center',
            justifyContent: 'center',
            aspectRatio: 3,
        },
        image: {
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
        },
        headingText: {
            textAlign: 'center',
            fontSize: 20,
        },
        contentText: {
            fontSize: 14,
            lineHeight: 21,
        },

        textStyle: {
            fontSize: 12,
            lineHeight: 16,
            color: '#000000',
            marginLeft: 12,
            marginTop: 2,
        },
        pointContainer: {
            flexDirection: 'row',
            marginTop: 16,
        },
        iconStyle: {
            fontSize: 18,
            color: props.brandPrimary,
            marginTop: 3,
        },

        headerStyle: {
            flex: 1,
            flexDirection: 'row',
            backgroundColor: '#FFFFFF',
            padding: 13,
        },
        backButton: {
            backgroundColor: props.brandPrimary,
            padding: 5,
            borderRadius: 20,
        },
        headerBackButtonContainer: {
            width: 30,
            alignItems: 'flex-start',
        },
        leftArrowIcon: {
            color: props.primaryBackground,
            fontSize: 20,
        },
        centerContainer: {
            flex: 1,
        },
        headerText: {
            color: props.brandPrimary,
            fontSize: 20,
            alignSelf: 'center',
        },
        headerRightContainer: {
            width: 20,
        },
    });
