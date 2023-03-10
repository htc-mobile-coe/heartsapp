import React, { Component } from 'react';
import { Alert } from 'react-native';
import { openSettings } from 'react-native-permissions';
import { isEqual } from 'lodash';
import SeekerBarcodeScannedResult from './SeekerBarcodeScannedResult';
import PermissionService from '../../../../services/PermissionService';

export class SeekerBarcodeScannedResultContainer extends Component {
    state = {
        enableFlash: 'off',
        showBarCodeScanner: true,
    };
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    _handleFlashButtonPress = () => {
        const { enableFlash } = this.state;

        this.setState({
            enableFlash: isEqual(enableFlash, 'off') ? 'torch' : 'off',
        });
    };
    _handleBarcodeScanButtonPress = () => {
        this.setState({
            showBarCodeScanner: true,
        });
    };
    _handleBarcodeRead = data => {
        const { onBarcodeScanned } = this.props;
        onBarcodeScanned(data);

        this.setState({
            showBarCodeScanner: false,
        });
    };
    _handleAddSeekerPress = () => {
        const { onAddSeekerPress } = this.props;
        onAddSeekerPress();
    };
    _handleSeekerSelectionPress = () => {
        const { onSelectedSeekersPress } = this.props;
        onSelectedSeekersPress();
    };

    _checkCameraPermission = async () => {
        const { t } = this.props;

        const hasCameraPermissionBlocked = await PermissionService.hasCameraPermissionBlocked();
        if (hasCameraPermissionBlocked) {
            Alert.alert(
                '',
                t('profileImagePicker:cameraAccessPrompt'),
                [
                    {
                        text: t('profileImagePicker:ok'),
                        onPress: () => {
                            openSettings();
                        },
                    },
                ],
                { cancelable: false },
            );
            return;
        }
        await PermissionService.requestCameraPermission();
    };
    componentDidMount = () => {
        this._checkCameraPermission();
    };

    _enableAddSeekerButton = () => {
        const { barcodeSearchedResult } = this.props;
        const enableAddSeekerButton =
            barcodeSearchedResult.length > 0 ? true : false;
        return enableAddSeekerButton;
    };

    render() {
        const { selectedSeekersCount, barcodeSearchedResult } = this.props;

        return (
            <SeekerBarcodeScannedResult
                seekerList={barcodeSearchedResult}
                enableFlash={this.state.enableFlash}
                showBarCodeScanner={this.state.showBarCodeScanner}
                onBackPress={this._handleBackPress}
                onAddSeekerBarcode={this._handleBarcodeScanButtonPress}
                onBarcodeFlashPress={this._handleFlashButtonPress}
                onBarcodeRead={this._handleBarcodeRead}
                onAddSeekerPress={this._handleAddSeekerPress}
                onSelectedSeekersPress={this._handleSeekerSelectionPress}
                selectedSeekersCount={selectedSeekersCount}
                enableAddSeekerButton={this._enableAddSeekerButton()}
            />
        );
    }
}

export default SeekerBarcodeScannedResultContainer;
