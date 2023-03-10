import { StyleSheet } from 'react-native';
import { IsIOS } from '../../../../shared/Constants';
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
            justifyContent: 'space-between',
        },
        headerContainer: {
            paddingHorizontal: 25,
            flexDirection: 'column',
            alignItems: 'center',
        },
        title: {
            paddingHorizontal: 30,
            color: '#5E5E5E',
            fontSize: 20,
            lineHeight: IsIOS ? 33 : 28,
        },
        subTitle: {
            paddingHorizontal: 30,
            color: '#5E5E5E',
            fontSize: 18,
            textAlign: 'center',
        },
        containerImage: {
            aspectRatio: 1.4,
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
            textAlign: 'center',
        },
        descriptionHighlighted: {
            lineHeight: 24,
            color: props.brandPrimaryHighlighted,
            fontSize: 22,
            paddingVertical: 6,
        },
        indicatorSize: { width: 10, height: 10 },
    });
