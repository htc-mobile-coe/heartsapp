import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        containerView: {
            backgroundColor: '#F8F8F8',
            flex: 1,
        },
        headerContainer: {
            flex: null,
            backgroundColor: '#FFFFFF',
            borderBottomStartRadius: 15,
            borderBottomEndRadius: 15,
        },
        bodyContainer: {
            flex: 1,
            flexGrow: 1,
        },
        contentContainer: {
            flex: 1,
        },
        listContainer: {
            paddingTop: 28,
        },
        searchResultContainer: {
            paddingBottom: 30,
        },
        bottomButtonContainer: {
            justifyContent: 'flex-end',
            padding: 24,
            backgroundColor: '#FFFFFF',
        },
        bottomButton: {
            textAlign: 'center',
            backgroundColor: props.brandPrimary,
            fontSize: 16,
        },
        listCountView: {
            flexDirection: 'row',
            marginHorizontal: 23,
            marginBottom: 20,
            alignItems: 'center',
        },
        highlightedText: {
            fontSize: 16,
            color: '#1B2541',
        },
        itemContainer: {
            backgroundColor: '#FFFFFF',
            borderRadius: 6,
            paddingHorizontal: 10,
            paddingVertical: 10,
            marginHorizontal: 23,
            marginBottom: 20,
            elevation: 3,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            flexDirection: 'row',
        },
        itemRow: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        itemIcon: {
            marginEnd: 10,
            width: 30,
            height: 30,
        },
        noSeekersFoundImageView: {
            alignItems: 'center',
            justifyContent: 'center',
        },
        noSeekersFoundImage: {
            height: 140,
            width: 140,
            resizeMode: 'contain',
            marginBottom: 10,
        },
        noSeekersFoundText: {
            flex: 0.4,
            textAlign: 'center',
            color: '#3A3A3A',
            fontSize: 20,
            marginTop: 35,
        },
    });
