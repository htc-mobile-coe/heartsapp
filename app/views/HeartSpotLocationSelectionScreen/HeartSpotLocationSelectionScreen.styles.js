import { StyleSheet } from 'react-native';
export const styles = props =>
    StyleSheet.create({
        headingContainer: {
            flex: null,
        },
        topContainer: {
            flex: 1,
        },
        map: {
            flex: 1,
        },
        confirmLocationButton: {
            justifyContent: 'center',
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
            backgroundColor: props.brandPrimary,
        },
        gpsLocationButtonTitle: {
            color: '#fff',
        },

        bottomContainer: {
            position: 'absolute',
            bottom: 0,
            width: '100%',
            padding: 20,
            paddingHorizontal: 40,
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
        },
        settingsContainer: {
            flexDirection: 'column',
            backgroundColor: '#fff',
            borderRadius: 12,
            shadowOffset: { width: 1, height1: 1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: props.elevation,
        },
        settingsHeading: {
            fontSize: 24,
            marginVertical: 12,
        },
        locationContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginVertical: 12,
        },
        locationDetailsContainer: {
            marginVertical: 12,
        },
        locationIcon: { width: 28, height: 29 },
        searchLocationIcon: {
            width: 12,
            height: 12,
            resizeMode: 'contain',
            marginRight: 10,
        },
        searchContainer: {
            paddingHorizontal: 40,
            paddingVertical: 25,
            height: 40,
            flexDirection: 'column',
        },
        searchParentView: {
            position: 'absolute',
            top: 10,
            left: 20,
            right: 20,
            zIndex: 99,
        },
        searchBorder: {
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0,
            borderRadius: 4,
            borderColor: 'transparent',
            backgroundColor: '#fff',
            shadowOffset: { width: 0.21, height1: 0.1 },
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 0.5,
            elevation: 1,
        },
        autoCompleteInput: {
            flex: 1,
            height: 40,
            marginHorizontal: 6,
            marginVertical: 6,
        },
        searchIcon: {
            color: '#808080',
            alignSelf: 'center',
            marginHorizontal: 6,
        },
        searchItem: {
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -5,
        },
        selectedLocationHeading: {
            color: '#84869B',
        },
        pinCodeText: {
            fontSize: 25,
        },
        addressText: {
            fontSize: 12,
            color: '#4B4B4B',
        },
    });

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
