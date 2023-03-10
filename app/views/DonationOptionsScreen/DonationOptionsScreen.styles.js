import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        header: {
            backgroundColor: '#ffffff',
        },
        viewButtonContainer: {
            flex: 1,
            paddingHorizontal: 30,
            justifyContent: 'space-between',
            paddingBottom: 10,
        },
        bigButton: {
            marginTop: 25,
        },
        modalView: {
            justifyContent: 'flex-end',
            marginHorizontal: 0,
            marginBottom: 0,
        },
        citizenshipViewContainer: {
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            paddingTop: 20,
            paddingBottom: 40,
            paddingHorizontal: 20,
        },
        closeButtonView: {
            alignSelf: 'flex-end',
        },
        citizenshipText: {
            textAlign: 'center',
            marginBottom: 15,
        },
        radioButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
        },
        radioContainer: {
            paddingVertical: 5,
            alignItems: 'center',
            paddingRight: 15,
        },
        radio: { marginRight: 6 },
        radioText: {
            fontSize: 13,
            fontFamily: props.normalFont
        },
    });
