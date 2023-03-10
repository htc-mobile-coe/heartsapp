import React, { Component } from 'react';
import SeekerSelectionComponent from './SeekerSelectionComponent';

export class SeekerSelectionComponentContainer extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    _handleBarcodeScannerPress = () => {
        const { onBarcodeScannerPress } = this.props;
        onBarcodeScannerPress();
    };
    _handleSearchPress = values => {
        const { onSearchButtonPress } = this.props;
        onSearchButtonPress(values);
    };
    _handleSeekerSelectionPress = () => {
        const { onSelectedSeekersPress } = this.props;
        onSelectedSeekersPress();
    };
    _handleBarcodeScannerInfoPress = () => {
        const { onBarcodeScannerInfoPress } = this.props;
        onBarcodeScannerInfoPress();
    };

    render() {
        const { selectedSeekersCount } = this.props;
        return (
            <SeekerSelectionComponent
                onBackPress={this._handleBackPress}
                onBarcodeScannerInfoPress={this._handleBarcodeScannerInfoPress}
                onBarcodeScannerButtonPress={this._handleBarcodeScannerPress}
                onSearchButtonPress={this._handleSearchPress}
                onSelectedSeekersPress={this._handleSeekerSelectionPress}
                selectedSeekersCount={selectedSeekersCount}
            />
        );
    }
}

export default SeekerSelectionComponentContainer;
