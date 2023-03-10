import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        mainView: {
            flex: 1,
            justifyContent: 'space-between',
            alignSelf: 'stretch',
        },

        bodyContainer: {
            flex: 1,
            paddingVertical: 30,
            paddingHorizontal: 15,
        },
        headerContainer: {
            flexDirection: 'row',
            backgroundColor: '#00000000',
            flex: 1,
        },
        headerText: {
            color: '#000000',
            fontSize: 17,
        },
        videoListBodyContainerView: { flex: 1 },
        masterClassBodyContainerView: { flex: 1 },
        header: {
            textAlign: 'center',
            flex: 1,
            color: props.normalTextColor,
        },
        title: {
            fontFamily: props.boldFont,
            fontSize: 17,
        },

        buttonContainer: {
            alignItems: 'center',
            paddingTop: 10,
        },

        button: {
            paddingHorizontal: 40,
        },
        viewMasterClassContainer: {
            paddingVertical: 80,
            paddingHorizontal: 10,
        },
    });
