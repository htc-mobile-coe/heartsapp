import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        rowContainer: {
            flexDirection: 'row',
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 20,
            elevation: 2,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            marginVertical: 15,
        },
        imageContainer: {
            flex: 0.4,
            alignItems: 'center',
        },
        image: {
            width: 50,
            height: 50,
        },
        titleContainer: {
            flex: 1,
            paddingRight: 15,
        },
        primaryColorText: {
            fontSize: 20,
            color: '#4b4b4b',
            paddingVertical: 5,
        },
        highlightedText: {
            fontSize: 26,
            color: '#bf3129',
        },
    });
