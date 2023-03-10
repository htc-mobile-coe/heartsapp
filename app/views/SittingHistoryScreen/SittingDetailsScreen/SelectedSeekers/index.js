import React, { Component } from 'react';
import SelectedSeekers from './SelectedSeekers';

export class SelectedSeekersContainer extends Component {
    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress();
    };
    _handleGoToSessionDetailsPressPress = () => {
        const { onGoToSessionDetailsPress } = this.props;
        onGoToSessionDetailsPress();
    };

    render() {
        const { selectedSeekersList } = this.props;

        return (
            <SelectedSeekers
                selectedSeekersList={selectedSeekersList}
                onBackPress={this._handleBackPress}
                onGoToSessionDetailsPress={
                    this._handleGoToSessionDetailsPressPress
                }
            />
        );
    }
}

export default SelectedSeekersContainer;
