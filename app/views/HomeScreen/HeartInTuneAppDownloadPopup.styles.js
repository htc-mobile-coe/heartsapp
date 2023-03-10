import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        heartInTuneAppDownloadPopup: {
            justifyContent: 'flex-end',
        },
        container: {
            flexDirection: 'column',
            backgroundColor: '#8C51FF',
        },
        closeButtonContainer: {
            borderRadius: 15,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
            position: 'absolute',
            top: -11,
            right: 11,
            resizeMode: 'contain',
        },
        closeIcon: {
            fontSize: 22,
            color: '#462F69',
        },
        heading: {
            color: '#FFFFFF',
            fontSize: 13,
            justifyContent: 'flex-end',
            paddingTop: 10,
        },
        bodyContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 16,
        },
        image: {
            flex: 0.7,
            marginVertical: 20,
            resizeMode: 'contain',
            height: 60,
            alignItems: 'center',
        },
        separator: {
            backgroundColor: '#FFFFFF',
            width: 0.5,
            marginHorizontal: 11,
        },
        rightContainer: {
            flex: 1,
        },
        content: {
            fontSize: 12,
            marginTop: 4,
            color: '#FFFFFF',
        },
        button: {
            padding: 10,
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 1,
            borderColor: '#FFFFFF',
            marginTop: 10,
            marginRight: 40,
        },
        title: {
            fontSize: 14,
            textAlign: 'center',
            color: '#462F69',
        },
    });
