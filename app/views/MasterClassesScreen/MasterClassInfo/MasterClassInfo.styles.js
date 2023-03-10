import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        main: {
            flexGrow: 1,
        },
        container: {
            flexGrow: 1,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            marginTop: 21,
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
        seperatorStyle: {
            height: 0.8,
            backgroundColor: '#B7B7B7',
            marginVertical: 28,
        },

        textStyle: {
            fontSize: 14,
            lineHeight: 20,
            color: '#000000',
            marginLeft: 8,
        },
        pointContainer: {
            flexDirection: 'row',
            marginTop: 20,
        },
        iconStyle: {
            fontSize: 18,
            color: props.brandPrimary,
            marginTop: 2,
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
        centerContainer: {
            flex: 1,
        },
        headerText: {
            color: props.brandPrimary,
            fontSize: 22,
            alignSelf: 'center',
        },
        sectionTitle: {
            color: '#605F5F',
            fontSize: 16,
        },
        headerRightContainer: {
            width: 20,
        },
    });
