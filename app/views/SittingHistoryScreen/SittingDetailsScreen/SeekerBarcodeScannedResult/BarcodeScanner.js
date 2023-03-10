import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { RNCamera } from 'react-native-camera';
import { TouchableOpacity, Image, Modal } from 'react-native';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SeekerBarcodeScannedResultStyle } from './SeekerBarcodeScannedResult.styles';
import SeekerBarcodeScannedResultImages from './img';
import BackButton from '../../../shared/BackButton';

class BarcodeScanner extends React.Component {
    _onBarcodeRead = event => {
        const { onBarcodeRead } = this.props;
        onBarcodeRead(event.data);
    };

    _renderChildContainer = () => {
        const { onBarcodeFlashPress, images, styles, onBackPress, t } = this.props;

        return (
            <View style={styles.barcodeContentContainer}>
                        <View style={styles.barcodeTitleContainer}>
                            <BackButton onBackPress={onBackPress} />
                            <MediumBoldText style={styles.barcodeTitleText}>
                                {t('seekerBarcodeScannedResult:addSeeker')}
                            </MediumBoldText>
                        </View>
                        <View style={styles.barcodeDescriptionView}>
                            <Text style={styles.barcodeSubtitleText}>
                                {t(
                                    'seekerBarcodeScannedResult:scanTheBarcodeToAddSeekers',
                                )}
                            </Text>

                            <Image
                                style={styles.barcodeFrame}
                                source={images.barcodeCameraFrame}
                                testID="barcodeScanner__frame--Image"
                            />
                        </View>

                        <View style={styles.flashIconView}>
                            <TouchableOpacity
                                onPress={onBarcodeFlashPress}
                                testID="barcodeScanner__flash_button">
                                <Image
                                    source={images.flash}
                                    testID="barcodeScanner__flash--Image"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
        );

    };

    render() {
        const {
            styles,
            onBackPress,
            enableFlash,
        } = this.props;

        return (
            <Modal onRequestClose={onBackPress} visible={true}>
                <RNCamera
                    barCodeTypes={[RNCamera.Constants.BarCodeType.code128]}
                    cameraType={'back'}
                    flashMode={enableFlash}
                    onBarCodeRead={this._onBarcodeRead}
                    style={styles.barcodeScanner}
                    children={this._renderChildContainer}/>
            </Modal>
        );
    }
}

export default withTranslation()(
    withTheme(
        BarcodeScanner,
        SeekerBarcodeScannedResultStyle,
        SeekerBarcodeScannedResultImages,
    ),
);
