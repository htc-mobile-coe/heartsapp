import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            paddingTop: 20,
            paddingHorizontal: 13,
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        headingContainer: {
            flex: null,
        },
        tileContainer: {
            width: '50%',
            aspectRatio: 0.9,
            padding: 15,
        },
        buttonContainer: {
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            paddingTop: 20,
            paddingBottom: 40,
            borderColor: props.brandPrimary,
            elevation: 5,
            shadowRadius: 1,
        },
        disbleButtonContainer: {
            backgroundColor: props.trainer_tile_background,
        },
        imageContainer: {
            alignItems: 'center',
        },
        image: {
            width: 45,
            height: 45,
            resizeMode: 'contain',
        },
        imageDisabled: {
            opacity: 0.4,
        },
        textContainer: {
            paddingHorizontal: 13,
            flex: 0.9,
        },

        title: {
            fontSize: 12,
            textAlign: 'center',
            marginTop: 10,
        },
        subTitle: {
            marginTop: 10,
            fontSize: 10,
            textAlign: 'center',
        },
    });
