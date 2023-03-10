import { filter, size } from 'lodash';
import React, { Component } from 'react';
import SeekerSearchResult from './SeekerSearchResult';
import { Toast } from 'native-base';
import { withTranslation } from 'react-i18next';
import { isNil } from 'lodash';
import { OFFLINE_SEEKERS_SELECTED_LIMIT } from '../../../../shared/Constants';

export class SeekerSearchResultContainer extends Component {
    state = {
        selectedSeekers: [],
    };

    static getDerivedStateFromProps(props, state) {
        const { searchResult } = props;
        const searchedSelectedSeekersList = filter(searchResult, 'isSelected');
        return {
            selectedSeekers: searchedSelectedSeekersList,
        };
    }

    _handleOnListItemSelected = (index, item) => {
        const { searchResult, isSeekerSelected, t } = this.props;
        const isSelected = isSeekerSelected(item.firebase_uid);
        if (isSelected) {
            Toast.show({
                description: t('seekerSearchResult:seekerAlreadySelected'),
                duration: 4000,
            });
        } else {
            searchResult.splice(index, 1, {
                ...item,
                isSelected: !item.isSelected,
            });
            const searchedSelectedSeekersList = filter(
                searchResult,
                'isSelected',
            );
            this.setState({ selectedSeekers: searchedSelectedSeekersList });
        }
    };
    _handleRegisterNewSeekerPress = () => {
        const { onRegisterNewSeekerPress } = this.props;
        onRegisterNewSeekerPress();
    };
    _handleAddSeekerButtonPress = () => {
        const { onAddSeekerButtonPress, selectedSeekersCount, t } = this.props;

        const totalCount =
            size(this.state.selectedSeekers) + selectedSeekersCount;
        if (totalCount <= OFFLINE_SEEKERS_SELECTED_LIMIT) {
            onAddSeekerButtonPress(this.state.selectedSeekers);
        } else {
            Toast.show({
                description: t('seekerSearchResult:seekerLimit'),
                duration: 2000,
            });
        }
    };
    isSearchResultEmpty = () => {
        const { searchResult } = this.props;
        return isNil(searchResult) || searchResult.length < 1;
    };
    _hideRightResultButton = () => this.props.selectedSeekersCount <= 0;
    render() {
        const {
            searchResult,
            searchOptions,
            onBackPress,
            onSelectedSeekersPress,
            selectedSeekersCount,
        } = this.props;

        return (
            <SeekerSearchResult
                onBackPress={onBackPress}
                isSearchResultEmpty={this.isSearchResultEmpty()}
                hideRightResultButton={this._hideRightResultButton()}
                selectedSeekers={this.state.selectedSeekers}
                searchResult={searchResult}
                searchOptions={searchOptions}
                onListItemSelected={this._handleOnListItemSelected}
                onAddSeekerButtonPress={this._handleAddSeekerButtonPress}
                onRegisterNewSeekerPress={this._handleRegisterNewSeekerPress}
                onSelectedSeekersPress={onSelectedSeekersPress}
                selectedSeekersCount={selectedSeekersCount}
            />
        );
    }
}
export default withTranslation()(SeekerSearchResultContainer);
