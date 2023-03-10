import { StyleSheet } from 'react-native';
import { IsIOS } from 'app/shared/Constants';

export const styles = props =>
    StyleSheet.create({
        containerView: {
            flex: 1,
            backgroundColor: '#F8F8F8',
        },
        bodyContainer: {
            flex: 1,
            flexGrow: 1,
            paddingTop: 28,
        },
        barcodeScanButtonContainer: {
            paddingHorizontal: 25,
        },
        barcodeScanTitleView: {
            flexDirection: 'row',
        },
        searchItemLabelView: {
            flexDirection: 'row',
            paddingLeft: 8,
        },
        infoIcon: {
            color: props.brandPrimary,
            fontSize: 20,
            paddingLeft: 5,
        },
        barcodeScanButtonStyle: {
            backgroundColor: '#FFFFFF',
            alignItems: 'center',
            borderRadius: 10,
            marginTop: 18,
            elevation: 3,
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.5,
            shadowRadius: 2,
            paddingVertical: 10,
            paddingHorizontal: 20,
            flexDirection: 'row',
        },
        barcodeIcon: {
            aspectRatio: 1,
            width: 60,
            height: 60,
            marginEnd: 20,
        },
        barcodeScanButtonText: {
            color: props.brandPrimary,
            fontSize: 13,
            textAlign: 'center',
        },
        searchSeekerContainer: {
            paddingHorizontal: 25,
            marginBottom: 24,
        },
        searchOptionsTitleView: {
            paddingHorizontal: 25,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
        },
        searchOptionsContainer: {
            marginTop: 17,
        },
        searchInputContainer: {
            marginBottom: 20,
            marginTop: 10,
            flexDirection: 'column',
        },
        searchItem: {
            borderRadius: 6,
            borderColor: props.brandPrimary,
            borderWidth: 0.5,
            height: 46,
            backgroundColor: '#FFFFFF',
            flex: 7,
        },
        inputStyle: {
            fontSize: 13,
            paddingLeft: 15,
            backgroundColor: '#FFFFFF',
        },
        phoneHintText: {
            marginTop: 5,
            fontSize: 10,
            marginLeft: 5,
            color: 'grey',
        },
        bottomButtonContainer: {
            flex: 1,
            justifyContent: 'flex-end',
        },
        buttonStyle: {
            padding: 24,
            backgroundColor: '#FFFFFF',
        },
        searchButton: {
            textAlign: 'center',
            backgroundColor: props.brandPrimary,
            fontSize: 16,
        },
        errorContainer: {
            marginHorizontal: 25,
            paddingBottom: 10,
        },
        error: {
            color: '#FF0000',
            fontSize: 12,
            alignSelf: 'flex-end',
        },
        atLeastOneLabel: {
            marginTop: IsIOS ? 3 : 0,
        },
        citySearchItem: { borderWidth: 0, marginTop: 0 },
    });
