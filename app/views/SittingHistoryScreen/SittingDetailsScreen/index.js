import React, { Component } from 'react';
import { Alert } from 'react-native';
import SittingDetailsScreen from './SittingDetailsScreen';
import { connect } from 'react-redux';
import { Toast } from 'native-base';
import { withTranslation } from 'react-i18next';
import {
    goBack,
    backButtonHandlers,
} from '../../../services/BackButtonService';
import { Actions } from 'react-native-router-flux';
import {
    OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS,
    OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE,
} from 'app/shared/Constants';

import OfflineSittingDetailService from '../../../services/meditation/OfflineSittingDetailService';
import {
    getRecentSeekersList,
    submitAddOfflineSittingDetailsForm,
    searchSeeker,
    searchSeekerUsingID,
    shouldAllowPreceptorToSearchSeeker,
} from './index.service';
import { operations } from '../../../state';
import { onError } from '../../../utils/ErrorHandlingUtils';
import {
    isNil,
    isNull,
    concat,
    findIndex,
    gte,
    get,
    isEqual,
    pullAt,
    map,
    first,
    find,
    set,
} from 'lodash';
import { REGISTER } from '../../TrainersSectionScreen/TrainersSectionData';

export class SittingDetailsScreenContainer extends Component {
    constructor(props) {
        super(props);
        backButtonHandlers.setSittingDetailsScreenHandler(
            this._handleBackPress,
        );
    }

    state = {
        recentSeekersList: [],
        searchResult: [],
        barcodeSearchedResult: [],
        searchOptions: [],
        offlineSessionDetails: null,
    };

    static getDerivedStateFromProps(props, state) {
        const { offlineSessionDetails } = props;

        if (isNil(state.offlineSessionDetails)) {
            return {
                offlineSessionDetails: offlineSessionDetails,
            };
        }
        return null;
    }
    _setSelectedSeekers = seekers => {
        const details = this.state.offlineSessionDetails;
        this.setState({
            offlineSessionDetails: { ...details, seekerList: seekers },
        });
    };
    _handleAddOfflineSittingDetailsBackPress = () => {
        const { trackOptions } = this.props;
        if (
            isEqual(
                trackOptions,
                OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW_COMPLETED,
            )
        ) {
            return;
        }
        OfflineSittingDetailService.onGoBack();
    };
    _handleBackPress = () => {
        OfflineSittingDetailService.onGoBack();
    };
    _handleMultiSelectionDropDownSeekerSelection = async () => {
        const { t } = this.props;
        const canShowSeekerSearch = await shouldAllowPreceptorToSearchSeeker();

        if (canShowSeekerSearch) {
            OfflineSittingDetailService.onShowSeekersSelection();
            return;
        }
        Toast.show({
            description: t(
                'seekerBarcodeScannedResult:preceptorAbnormalSearchBlockMessage',
            ),
            duration: 6000,
        });
    };

    _handleMultiSelectionDropDownRecentSeekerSelected = selectedSeeker => {
        const { t } = this.props;
        const selectedSeekers = this._getSelectedSeekers();
        const { recentSeekersList } = this.state;

        const isSeekerSelected = this._isSeekerSelected(
            selectedSeeker.firebase_uid,
        );
        if (isSeekerSelected && !selectedSeeker.isSelected) {
            Toast.show({
                description: t('seekerSearchResult:seekerAlreadySelected'),
                duration: 4000,
            });
            return;
        }
        const seekerItem = find(recentSeekersList, {
            firebase_uid: selectedSeeker.firebase_uid,
        });
        set(seekerItem, 'isSelected', !selectedSeeker.isSelected);
        this.setState({ recentSeekersList });
        const index = findIndex(selectedSeekers, {
            firebase_uid: selectedSeeker.firebase_uid,
        });

        if (isEqual(index, -1)) {
            const seekers = concat(this._getSelectedSeekers(), selectedSeeker);

            this._setSelectedSeekers(seekers);
        } else {
            pullAt(selectedSeekers, index);
            this._setSelectedSeekers(selectedSeekers);
        }
    };
    _handleMultiSelectionDropDownRecentSeekerRemoved = (removedItem, index) => {
        const { recentSeekersList } = this.state;
        const selectedSeekers = this._getSelectedSeekers();
        pullAt(selectedSeekers, index);
        const updatedRecentSeekersList = map(recentSeekersList, item => {
            if (isEqual(item, removedItem)) {
                return {
                    firebase_uid: item.firebase_uid,
                    name: item.name,
                    email: item.email,
                    isSelected: !item.isSelected,
                };
            } else {
                return item;
            }
        });
        this.setState({
            recentSeekersList: updatedRecentSeekersList,
        });
        this._setSelectedSeekers(selectedSeekers);
    };
    _handleSubmitOfflineSittingForm = async values => {
        const { trackOptions, setSessionDetails } = this.props;
        if (
            isEqual(
                trackOptions,
                OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
            )
        ) {
            setSessionDetails({
                date: values.date,
                startTime: values.startTime,
                endTime: values.endTime,
                duration: values.duration,
                numberOfPeople: values.numberOfPeople,
                seekerList: this._getSelectedSeekers(),
                comments: values.comments,
            });
            Actions.pop();
        } else {
            const errorMessage = await submitAddOfflineSittingDetailsForm(
                this.state.offlineSessionDetails,
                this.props,
            );
            if (isNil(errorMessage)) {
                values.resetForm();
            } else {
                onError(errorMessage, 'SDS-SAOSDF');
            }
        }
    };

    _handleBarcodeScannerPress = () => {
        OfflineSittingDetailService.onShowSeekerBarcodeScannedResult();
    };

    _handleSearchButtonPress = async values => {
        const { t } = this.props;
        const canSeekerSearch = await shouldAllowPreceptorToSearchSeeker();

        if (!canSeekerSearch) {
            Toast.show({
                description: t(
                    'seekerBarcodeScannedResult:preceptorAbnormalSearchBlockMessage',
                ),
                duration: 6000,
            });
            return;
        }

        const seekerSearchResult = await searchSeeker(values, this.props);

        if (!isNull(seekerSearchResult)) {
            this.setState({
                searchResult: seekerSearchResult,
                searchOptions: values,
            });
        }
        OfflineSittingDetailService.onShowSeekerSearchResult();
    };

    _handleBarcodeScanned = async abhyasiId => {
        const { t } = this.props;
        const canSeekerSearch = await shouldAllowPreceptorToSearchSeeker();

        if (!canSeekerSearch) {
            Toast.show({
                description: t(
                    'seekerBarcodeScannedResult:preceptorAbnormalSearchBlockMessage',
                ),
                duration: 6000,
            });
            return;
        }

        const barcodeSearchedResult = await searchSeekerUsingID(
            abhyasiId,
            this.props,
        );
        const barcodeSearchResultItem = first(barcodeSearchedResult);
        const isSeekerSelected = this._isSeekerSelected(
            barcodeSearchResultItem.firebase_uid,
        );
        if (isSeekerSelected) {
            Toast.show({
                description: t('seekerSearchResult:seekerAlreadySelected'),
                duration: 4000,
            });
            return;
        }

        const searchResults = this.state.barcodeSearchedResult;

        const index = findIndex(searchResults, { abhyasiId });
        if (gte(index, 0)) {
            Toast.show({
                description: t(
                    'seekerBarcodeScannedResult:theSeekerHasBeenAlreadyAdded',
                ),
                duration: 2000,
            });
            return;
        }
        const results = concat(searchResults, barcodeSearchedResult);
        this.setState({ barcodeSearchedResult: results });
    };
    _handleBarcodeScannedResultAddSeekerPress = () => {
        const { barcodeSearchedResult } = this.state;
        const seekers = concat(
            this._getSelectedSeekers(),
            barcodeSearchedResult,
        );

        this._setSelectedSeekers(seekers);
        this.setState({ barcodeSearchedResult: [] });

        OfflineSittingDetailService.onAddingSeekers(seekers);
    };

    _handleSeekerSearchResultAddSeekerButtonPress = selectedSeekersFromSearchResulList => {
        const seekers = concat(
            this._getSelectedSeekers(),
            selectedSeekersFromSearchResulList,
        );
        this._setSelectedSeekers(seekers);
        OfflineSittingDetailService.onAddingSeekers(seekers);
    };
    _handleSeekerSearchResultRegisterNewSeekerPress = () => {
        Actions.trainersSectionWebViewScreen({
            trainersSectionSelectedOption: REGISTER,
        });
    };

    _handleGoToSessionDetailsPress = () => {
        OfflineSittingDetailService.onShowSessionDetails(
            this._getSelectedSeekers(),
        );
    };
    _handleSelectedSeekersPress = () => {
        OfflineSittingDetailService.onShowSelectedSeekers();
    };
    _handleBarcodeScannerInfoPress = () => {
        const { t } = this.props;
        Alert.alert(
            t('seekerSelectionComponent:info'),
            t('seekerSelectionComponent:scanDetails'),
            [{ text: t('seekerSelectionComponent:okay') }],
        );
    };

    _getRecentSeekersList = async () => {
        const recentSeekersList = await getRecentSeekersList();
        this.setState({ recentSeekersList });
    };

    _handleChangeAddOfflineFormValues = newValue => {
        this.setState({
            offlineSessionDetails: {
                ...newValue,
                seekerList: this._getSelectedSeekers(),
            },
        });
    };

    componentDidMount = () => {
        this._getRecentSeekersList();
    };

    _isTrackNowSession = () => {
        const { trackOptions } = this.props;
        return isEqual(
            trackOptions,
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
        );
    };
    _isDatePickerDisable = () => {
        const { trackOptions } = this.props;
        return !isEqual(
            trackOptions,
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_PAST,
        );
    };
    _isStartTimeAndEndTimeDisabled = () => {
        const { offlinePreceptorMeditationUiState, trackOptions } = this.props;
        return (
            isEqual(
                offlinePreceptorMeditationUiState,
                OFFLINE_PRECEPTOR_MEDITATION_SESSION_UI_STATE.MEDITATION_YET_TO_START,
            ) &&
            isEqual(
                trackOptions,
                OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW,
            )
        );
    };
    _isOfflineSessionTrackingCompleted = () => {
        const { trackOptions } = this.props;
        return isEqual(
            trackOptions,
            OFFLINE_MEDITATION_SESSION_TRACK_OPTIONS.TRACK_NOW_COMPLETED,
        );
    };

    _getSelectedSeekers = () => {
        return get(this.state, 'offlineSessionDetails.seekerList', []);
    };

    _isSeekerSelected = firebaseId => {
        const seekerList = this._getSelectedSeekers();
        const index = findIndex(seekerList, {
            firebase_uid: firebaseId,
        });
        return gte(index, 0);
    };
    render() {
        const { uiState } = this.props;

        return (
            <SittingDetailsScreen
                containerType={uiState}
                selectedSeekers={this._getSelectedSeekers()}
                isSeekerSelected={this._isSeekerSelected}
                isDatePickerDisable={this._isDatePickerDisable()}
                recentSeekersList={this.state.recentSeekersList}
                searchResult={this.state.searchResult}
                searchOptions={this.state.searchOptions}
                barcodeSearchedResult={this.state.barcodeSearchedResult}
                onAddOfflineSittingDetailsBackPress={
                    this._handleAddOfflineSittingDetailsBackPress
                }
                onBackPress={this._handleBackPress}
                onMultiSelectionDropDownSeekerSelection={
                    this._handleMultiSelectionDropDownSeekerSelection
                }
                onMultiSelectionDropDownRecentSeekerSelected={
                    this._handleMultiSelectionDropDownRecentSeekerSelected
                }
                onMultiSelectionDropDownRecentSeekerRemoved={
                    this._handleMultiSelectionDropDownRecentSeekerRemoved
                }
                isTrackNowSession={this._isTrackNowSession()}
                isStartTimeAndEndTimeDisabled={this._isStartTimeAndEndTimeDisabled()}
                isOfflineSessionTrackingCompleted={this._isOfflineSessionTrackingCompleted()}
                onSubmitOfflineSittingForm={
                    this._handleSubmitOfflineSittingForm
                }
                onBarcodeScannerPress={this._handleBarcodeScannerPress}
                onSearchButtonPress={this._handleSearchButtonPress}
                onBarcodeScanned={this._handleBarcodeScanned}
                onBarcodeScannedResultAddSeekerPress={
                    this._handleBarcodeScannedResultAddSeekerPress
                }
                onSeekerSearchResultAddSeekerButtonPress={
                    this._handleSeekerSearchResultAddSeekerButtonPress
                }
                offlineSessionDetails={this.state.offlineSessionDetails}
                onChangeAddOfflineFormValues={
                    this._handleChangeAddOfflineFormValues
                }
                onSeekerSearchResultRegisterNewSeekerPress={
                    this._handleSeekerSearchResultRegisterNewSeekerPress
                }
                onGoToSessionDetailsPress={this._handleGoToSessionDetailsPress}
                onSelectedSeekersPress={this._handleSelectedSeekersPress}
                onBarcodeScannerInfoPress={this._handleBarcodeScannerInfoPress}
            />
        );
    }
}
export const mapStateToProps = state => {
    return {
        offlinePreceptorMeditationUiState: get(
            state.offlinePreceptorMeditationSession,
            'uiState',
        ),
        uiState: state.offlineSittingDetail.uiState,
        trackOptions: get(
            state.offlinePreceptorMeditationSession,
            'trackOptions',
        ),
        offlineSessionDetails: get(
            state.offlineSittingDetail,
            'offlineSessionDetails',
        ),
    };
};
const mapDispatchToProps = {
    ...operations.offlinePreceptorMeditationSession,
    ...operations.offlineSittingDetail,
    goBack,
    ...operations.appBusyStatus,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(SittingDetailsScreenContainer));
