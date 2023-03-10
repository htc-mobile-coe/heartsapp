import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import ScreenContainer from '../../shared/ScreenContainer';
import { SITTING_DETAILS_CONTAINER_TYPE } from './SittingDetailsContainerType';
import AddOfflineSittingDetails from './AddOfflineSittingDetails';
import SeekerSelectionComponent from './SeekerSelectionComponent';
import SeekerBarcodeScannedResult from './SeekerBarcodeScannedResult';
import SeekerSearchResult from './SeekerSearchResult';
import SelectedSeekers from './SelectedSeekers';
import { size } from 'lodash';

class SittingDetailsScreen extends Component {
    _renderAddOfflineSittingDetails = () => {
        const {
            onAddOfflineSittingDetailsBackPress,
            selectedSeekers,
            recentSeekersList,
            onMultiSelectionDropDownSeekerSelection,
            onMultiSelectionDropDownRecentSeekerSelected,
            onMultiSelectionDropDownRecentSeekerRemoved,
            onSubmitOfflineSittingForm,
            isTrackNowSession,
            offlineSessionDetails,
            onChangeAddOfflineFormValues,
            isStartTimeAndEndTimeDisabled,
            isOfflineSessionTrackingCompleted,
            isDatePickerDisable,
        } = this.props;

        return (
            <AddOfflineSittingDetails
                onBackPress={onAddOfflineSittingDetailsBackPress}
                selectedSeekers={selectedSeekers}
                recentSeekersList={recentSeekersList}
                onSeekerSelection={onMultiSelectionDropDownSeekerSelection}
                onMultiSelectionDropDownRecentSeekerSelected={
                    onMultiSelectionDropDownRecentSeekerSelected
                }
                onRemoveSeeker={onMultiSelectionDropDownRecentSeekerRemoved}
                offlineSessionDetails={offlineSessionDetails}
                isTrackNowSession={isTrackNowSession}
                isDatePickerDisable={isDatePickerDisable}
                onSubmitOfflineSittingForm={onSubmitOfflineSittingForm}
                onChangeFormValues={onChangeAddOfflineFormValues}
                isStartTimeAndEndTimeDisabled={isStartTimeAndEndTimeDisabled}
                isOfflineSessionTrackingCompleted={
                    isOfflineSessionTrackingCompleted
                }
            />
        );
    };
    _renderSeekerSelectionComponent = () => {
        const {
            onBackPress,
            onBarcodeScannerPress,
            onSearchButtonPress,
            onSelectedSeekersPress,
            onBarcodeScannerInfoPress,
            selectedSeekers,
        } = this.props;

        return (
            <SeekerSelectionComponent
                onBackPress={onBackPress}
                onBarcodeScannerPress={onBarcodeScannerPress}
                onSearchButtonPress={onSearchButtonPress}
                onSelectedSeekersPress={onSelectedSeekersPress}
                onBarcodeScannerInfoPress={onBarcodeScannerInfoPress}
                selectedSeekersCount={size(selectedSeekers)}
            />
        );
    };
    _renderSeekerBarcodeScannedResult = () => {
        const {
            onBackPress,
            onBarcodeScannedResultAddSeekerPress,
            onSelectedSeekersPress,
            selectedSeekers,
            onBarcodeScanned,
            barcodeSearchedResult,
        } = this.props;

        return (
            <SeekerBarcodeScannedResult
                onBackPress={onBackPress}
                onAddSeekerPress={onBarcodeScannedResultAddSeekerPress}
                onSelectedSeekersPress={onSelectedSeekersPress}
                selectedSeekersCount={size(selectedSeekers)}
                onBarcodeScanned={onBarcodeScanned}
                barcodeSearchedResult={barcodeSearchedResult}
            />
        );
    };
    _renderSeekerSearchResult = () => {
        const {
            searchResult,
            searchOptions,
            onSeekerSearchResultAddSeekerButtonPress,
            onSeekerSearchResultRegisterNewSeekerPress,
            onSelectedSeekersPress,
            selectedSeekers,
            isSeekerSelected,
            onBackPress,
        } = this.props;

        return (
            <SeekerSearchResult
                searchResult={searchResult}
                searchOptions={searchOptions}
                isSeekerSelected={isSeekerSelected}
                onAddSeekerButtonPress={
                    onSeekerSearchResultAddSeekerButtonPress
                }
                onRegisterNewSeekerPress={
                    onSeekerSearchResultRegisterNewSeekerPress
                }
                onBackPress={onBackPress}
                onSelectedSeekersPress={onSelectedSeekersPress}
                selectedSeekersCount={size(selectedSeekers)}
            />
        );
    };
    _renderSelectedSeekers = () => {
        const {
            onBackPress,
            selectedSeekers,
            onGoToSessionDetailsPress,
        } = this.props;

        return (
            <SelectedSeekers
                onBackPress={onBackPress}
                selectedSeekersList={selectedSeekers}
                onGoToSessionDetailsPress={onGoToSessionDetailsPress}
            />
        );
    };

    _renderContainer = () => {
        const { containerType } = this.props;

        switch (containerType) {
            case SITTING_DETAILS_CONTAINER_TYPE.ADD_OFFLINE_SITTING_DETAILS:
                return this._renderAddOfflineSittingDetails();
            case SITTING_DETAILS_CONTAINER_TYPE.SEEKER_SELECTION_COMPONENT:
                return this._renderSeekerSelectionComponent();
            case SITTING_DETAILS_CONTAINER_TYPE.SEEKER_BARCODE_SCANNED_RESULT:
                return this._renderSeekerBarcodeScannedResult();
            case SITTING_DETAILS_CONTAINER_TYPE.SEEKER_SEARCH_RESULT:
                return this._renderSeekerSearchResult();
            case SITTING_DETAILS_CONTAINER_TYPE.SELECTED_SEEKERS:
                return this._renderSelectedSeekers();
        }
    };

    render() {
        return (
            <ScreenContainer enableScroll={false}>
                {this._renderContainer()}
            </ScreenContainer>
        );
    }
}

export default withTranslation()(withTheme(SittingDetailsScreen));
