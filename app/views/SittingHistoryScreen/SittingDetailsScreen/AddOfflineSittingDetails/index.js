import React, { Component } from 'react';
import AddOfflineSittingDetails from './AddOfflineSittingDetails';

export class AddOfflineSittingDetailsContainer extends Component {
    _handleRecentSeekerSelected = recentSeekersSelectedList => {
        const { onMultiSelectionDropDownRecentSeekerSelected } = this.props;
        onMultiSelectionDropDownRecentSeekerSelected(recentSeekersSelectedList);
    };
    _handleSubmit = values => {
        const { onSubmitOfflineSittingForm } = this.props;
        onSubmitOfflineSittingForm(values);
    };

    render() {
        const {
            onBackPress,
            selectedSeekers,
            recentSeekersList,
            onRemoveSeeker,
            onSeekerSelection,
            isTrackNowSession,
            offlineSessionDetails,
            onChangeFormValues,
            isStartTimeAndEndTimeDisabled,
            isOfflineSessionTrackingCompleted,
            isDatePickerDisable,
        } = this.props;

        return (
            <AddOfflineSittingDetails
                onBackPress={onBackPress}
                offlineSessionDetails={offlineSessionDetails}
                isTrackNowSession={isTrackNowSession}
                shouldValidateStartAndEndTime={isTrackNowSession}
                isStartTimeAndEndTimeDisabled={isStartTimeAndEndTimeDisabled}
                hideBackButton={isOfflineSessionTrackingCompleted}
                isDatePickerDisable={isDatePickerDisable}
                onSubmit={this._handleSubmit}
                selectedSeekers={selectedSeekers}
                recentSeekersList={recentSeekersList}
                onSeekerSelection={onSeekerSelection}
                onRecentSeekerSelected={this._handleRecentSeekerSelected}
                onRemoveSeeker={onRemoveSeeker}
                onChangeFormValues={onChangeFormValues}
            />
        );
    }
}

export default AddOfflineSittingDetailsContainer;
