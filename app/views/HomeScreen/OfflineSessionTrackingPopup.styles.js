import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        offlineSessionTrackingModal: {
            justifyContent: 'flex-end',
            marginHorizontal: 0,
            marginBottom: 0,
        },
        container: {
            flexDirection: 'column',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
        },
        headerStyle: {
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            paddingTop: 10,
        },
        closeButtonContainer: {
            paddingTop: 20,
            alignSelf: 'flex-end',
        },
        closeIcon: {
            fontSize: 26,
            color: '#000000',
        },
        heading: {
            color: '#333333',
            fontSize: 22,
            justifyContent: 'flex-end',
            paddingTop: 10,
            paddingHorizontal: 20,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 20,
            paddingHorizontal: 40,
        },
        button: {
            flex: 1,
            aspectRatio: 1,
            padding: 10,
            borderRadius: 10,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#CECECE',
            shadowColor: '#000000',
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.22,
            shadowRadius: 2.22,
            elevation: 4,
            marginEnd: 10,
        },
        image: {
            width: 40,
            height: 40,
            resizeMode: 'contain',
        },
        titleContainer: {
            flex: 0.7,
        },
        title: {
            fontSize: 15,
            textAlign: 'center',
            marginTop: 10,
            color: '#747474',
        },
    });
