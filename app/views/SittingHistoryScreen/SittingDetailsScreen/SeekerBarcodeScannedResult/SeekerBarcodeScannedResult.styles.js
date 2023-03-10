import { StyleSheet } from 'react-native';
import { IsIOS } from 'app/shared/Constants';

export const styles = props =>
    StyleSheet.create({
        containerView: {
            backgroundColor: '#F8F8F8',
            flex: 1,
        },
        bodyContainer: {
            flex: 1,
            flexGrow: 1,
            paddingTop: 28,
        },
        barcodeScannerContainer: {
            paddingHorizontal: 25,
            height: 250,
            marginBottom: 20,
        },
        barcodeContentContainer: {
            flex: 1,
        },
        barcodeScanner: {
            flex: 1,
        },
        barcodeTitleContainer: {
            paddingVertical: 30,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        barcodeDescriptionView: {
            paddingTop: 30,
            flex: 1,
        },
        barcodeTitleText: {
            color: '#FFFFFF',
            flex: 0.78,
            fontSize: 20,
            marginTop: 5,
        },
        barcodeSubtitleText: {
            color: '#FFFFFF',
            textAlign: 'center',
            flex: 0.27,
        },
        barcodeFrame: {
            alignSelf: 'center',
        },
        flashIconView: {
            bottom: 50,
            alignItems: 'center',
        },
        listContainer: {
            flex: 1,
        },
        bottomButtonContainer: {
            justifyContent: 'flex-end',
            padding: 24,
            backgroundColor: '#FFFFFF',
        },
        barcodeIcon: {
            alignItems: 'center',
            marginBottom: 10,
        },
        bottomButton: {
            textAlign: 'center',
            backgroundColor: props.brandPrimary,
            fontSize: 16,
        },
        disabledBottomButton: {
            textAlign: 'center',
            backgroundColor: '#CECECE',
            fontSize: 16,
        },
        listCountView: {
            flexDirection: 'row',
            marginHorizontal: 23,
            marginBottom: 20,
            alignItems: 'center',
        },
        listCountText: {
            marginTop: IsIOS ? 4 : 0,
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
        itemUserImageView: {
            justifyContent: 'center',
            marginEnd: 20,
        },
        itemUserImage: {
            width: 60,
            height: 60,
            borderRadius: 6,
        },
        itemIcon: {
            marginEnd: 10,
        },
    });
