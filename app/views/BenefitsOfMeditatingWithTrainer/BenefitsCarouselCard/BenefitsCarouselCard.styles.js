import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        container: {
            flex: 1,
            padding: 5,
            backgroundColor: 'white',
            borderBottomLeftRadius: 50,
            borderBottomRightRadius: 50,
            paddingBottom: 30,
            marginBottom: 30,
        },
        cardContainer: {
            flex: 1,
        },
        headerContainer: {
            paddingHorizontal: 25,
            flexDirection: 'row',
        },
        serialNo: {
            fontSize: 46,
            color: props.brandPrimaryLight,
        },
        serialNoBottomLine: {
            width: 30,
            height: 5,
            backgroundColor: props.brandPrimary,
            borderRadius: 10,
        },
        title: {
            paddingHorizontal: 30,
            color: '#5E5E5E',
            fontSize: 18,
            paddingVertical: 6,
        },
        containerImage: {
            flex: 1,
        },
        image: {
            resizeMode: 'contain',
            width: '100%',
            height: '100%',
        },
        description: {
            lineHeight: 24,
            color: '#000000',
            fontSize: 16,
            paddingHorizontal: 40,
        },
        descriptionHighlighted: {
            lineHeight: 24,
            color: props.brandPrimaryHighlighted,
            fontSize: 22,
            paddingVertical: 6,
        },
        pageControl: { marginTop: 30 },
        indicatorSize: { width: 10, height: 10 },
    });
