import { StyleSheet } from 'react-native';

export const styles = props =>
    StyleSheet.create({
        header: {
            flex: null,
        },
        container: {
            flex: 1,
            justifyContent: 'space-around',
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
            alignItems: 'center',
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
        },
        searchIcon: {
            alignSelf: 'center',
            fontSize: 20,
            marginLeft: 10,
        },
        searchBoxView: {
            position: 'absolute',
            flexDirection: 'row',
            marginTop: 30,
            marginHorizontal: 40,
        },
        inputView: {
            flex: 5,
        },
        spinner: {
            aspectRatio: 2,
            resizeMode: 'contain',
        },
        flex: {
            flex: 1,
        },
        searchItem: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -5,
            paddingVertical: 15,
            paddingLeft: 5,
            borderBottomColor: '#AFAFAF',
            borderBottomWidth: 0.5,
            overflow: 'hidden',
        },
        cityText: {
            fontSize: 14,
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
        bottomContainer: {
            flex: 1,
            marginTop: 10,
            backgroundColor: '#FFFFFF',
        },
        bottomImageView: {
            flex: 1,
            flexDirection: 'column',
            alignSelf: 'center',
            justifyContent: 'flex-end',
        },
        cityListContainer: {
            padding: 10,
            marginHorizontal: 40,
            backgroundColor: '#FFFFFF',
        },
        cityListView: {
            top: 123,
            bottom: 0,
            position: 'absolute',
            width: '100%',
        },
        placeholderTextColor:'#AFAFAF'
    });
