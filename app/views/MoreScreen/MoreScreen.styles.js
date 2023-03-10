import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        viewSearchText: {
            flex: 1,
            padding: 20,
        },
        searchText: {
            borderColor: 'blue',
            fontSize: 10,
            height: 30,
            flex: 1,
        },
        Icon: { paddingRight: 20, fontSize: 25 },
        viewButtonContainer: {
            flex: 1,
            paddingHorizontal: 30,
            justifyContent: 'space-between',
        },
        bigButton: {
            marginTop: 25,
        },
        bottomContentContainer: {
            paddingHorizontal: 30,
            marginTop: 30,
            alignItems: 'center',
            marginBottom: 20,
        },
        textContainer: {
            flexDirection: 'row',
        },
        textStyle: {
            lineHeight: 20,
        },
        andTextStyle: {
            color: '#000000',
            marginRight: 5,
            lineHeight: 20,
        },
        highlightedText: {
            color: props.brandPrimary,
            lineHeight: 20,
        },
        termsAndConditionButton: {
            marginRight: 5,
        },
    });
