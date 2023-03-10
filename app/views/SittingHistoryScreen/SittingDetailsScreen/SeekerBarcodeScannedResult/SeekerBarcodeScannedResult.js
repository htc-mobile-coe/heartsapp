import React from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { map } from 'lodash';
import { TouchableOpacity, Image, ScrollView } from 'react-native';
import SittingDetailsHeader from '../SittingDetailsHeader';
import { Button } from '../../../shared';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SeekerBarcodeScannedResultStyle } from './SeekerBarcodeScannedResult.styles';
import SeekerBarcodeScannedResultImages from './img';
import SeekerBarcodeScannedItem from './SeekerBarcodeScannedItem';
import BarcodeScanner from './BarcodeScanner';

class SeekerBarcodeScannedResult extends React.Component {
    _renderListItem = (item, index) => {
        return <SeekerBarcodeScannedItem item={item} key={index} />;
    };

    _renderList() {
        const { seekerList } = this.props;

        return map(seekerList, this._renderListItem);
    }

    _renderListCount() {
        const { t, seekerList, styles } = this.props;

        return (
            <View style={styles.listCountView}>
                <Text style={styles.listCountText}>
                    {t('seekerBarcodeScannedResult:adding')}{' '}
                </Text>
                <MediumBoldText testID="seekerBarcodeScannedResult__noOfSeekers_text">
                    {seekerList.length}{' '}
                    {t('seekerBarcodeScannedResult:seekers')}
                </MediumBoldText>
            </View>
        );
    }

    _renderBarcodeScanner = () => {
        const {
            showBarCodeScanner,
            onBackPress,
            enableFlash,
            onBarcodeFlashPress,
            onBarcodeRead,
        } = this.props;

        if (showBarCodeScanner) {
            return (
                <BarcodeScanner
                    onBackPress={onBackPress}
                    enableFlash={enableFlash}
                    onBarcodeFlashPress={onBarcodeFlashPress}
                    onBarcodeRead={onBarcodeRead}
                />
            );
        }
    };

    _renderBottomButtonContainer = () => {
        const {
            t,
            styles,
            images,
            onAddSeekerBarcode,
            onAddSeekerPress,
            enableAddSeekerButton,
        } = this.props;

        const bottomButtonStyle = enableAddSeekerButton
            ? styles.bottomButton
            : styles.disabledBottomButton;
        return (
            <View>
                <View style={styles.barcodeIcon}>
                    <TouchableOpacity
                        onPress={onAddSeekerBarcode}
                        testID="seekerBarcodeScannedResult__barcode_button">
                        <Image
                            style={styles.itemIcon}
                            source={images.barcode}
                            testID="seekerBarcodeScannedResult__barcode--Image"
                        />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomButtonContainer}>
                    <Button
                        disabled={!enableAddSeekerButton}
                        rounded={true}
                        style={bottomButtonStyle}
                        onPress={onAddSeekerPress}
                        text={t('seekerBarcodeScannedResult:addSeeker')}
                        testID="seekerBarcodeScannedResult__addSeeker--button"
                    />
                </View>
            </View>
        );
    };

    render() {
        const {
            t,
            onBackPress,
            onSelectedSeekersPress,
            selectedSeekersCount,
            styles,
        } = this.props;

        return (
            <View style={styles.containerView}>
                <SittingDetailsHeader
                    title={t('seekerBarcodeScannedResult:addSeeker')}
                    onBackPress={onBackPress}
                    onSelectedSeekersPress={onSelectedSeekersPress}
                    selectedSeekersCount={selectedSeekersCount}
                    showRightIcon={true}
                />
                <View style={styles.bodyContainer}>
                    {this._renderBarcodeScanner()}
                    <ScrollView style={styles.listContainer}>
                        {this._renderListCount()}
                        {this._renderList()}
                    </ScrollView>
                    {this._renderBottomButtonContainer()}
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        SeekerBarcodeScannedResult,
        SeekerBarcodeScannedResultStyle,
        SeekerBarcodeScannedResultImages,
    ),
);
