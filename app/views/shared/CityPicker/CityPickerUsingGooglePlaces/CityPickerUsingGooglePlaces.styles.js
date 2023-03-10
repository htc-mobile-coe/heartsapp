import { StyleSheet } from 'react-native';

export const googlePlacesAutocompleteStyles = {
    listView: {
        elevation: 5,
        padding: 2,
        backgroundColor: '#FFFFFF',
        shadowColor: '#000000',
        shadowOpacity: 1,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 1,
        },
    },
};

export const styles = props =>
    StyleSheet.create({
        header:{
            flex: null,
        },
        bodyContainer: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'space-between',
        },
        searchParentView: {
            zIndex: 99,
        },
        searchContainer: {
            paddingHorizontal: 40,
            paddingVertical: 25,
            height: 100,
            flexDirection: 'column',
        },
        searchBorder: {
            flex: 2,
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 2,
            borderRadius: 5,
            borderColor: 'transparent',
            backgroundColor: '#FFFFFF',
        },
        searchIcon: {
            alignSelf: 'center',
            marginLeft: 10,
            fontSize: 24,
        },
        googlePlaceView: {
            zIndex: 99,
            position: 'absolute',
            flexDirection: 'row',
            marginTop: 30,
            marginHorizontal: 40,
        },
        searchItem: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -5,
        },
        locationIcon: {
            marginRight: 12,
        },
        hintView: {
            marginTop: 20,
            paddingHorizontal: 50,
            textAlign: 'center',
        },
        hintText: {
            fontSize: 12,
        },
        footerView: {
            flex: 1,
            marginTop: 10,
            backgroundColor: '#FFFFFF',
        },
        footerImageView: {
            flex: 1,
            flexDirection: 'column',
            alignSelf: 'center',
            justifyContent: 'flex-end',
        },
    });
