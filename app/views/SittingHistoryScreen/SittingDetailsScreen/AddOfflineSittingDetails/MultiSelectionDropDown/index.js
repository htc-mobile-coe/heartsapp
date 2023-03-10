import React, { Component } from 'react';
import MultiSelectionDropDownMenu from './MultiSelectionDropDownMenu';

export class MultiSelectionDropDownContainer extends Component {
    state = {
        isExpanded: false,
    };
    _handleMultiSelectionSeekerDropDownPress = () => {
        this.setState({
            isExpanded: !this.state.isExpanded,
        });
    };
    _handleRadioButtonPress = item => {
        const { onRecentSeekerSelected } = this.props;
        onRecentSeekerSelected(item);
        this.setState({
            isExpanded: false,
        });
    };
    render() {
        const {
            seekersList,
            onRemoveSeeker,
            selectedSeekers,
            onSeekerSelection,
        } = this.props;

        return (
            <MultiSelectionDropDownMenu
                isExpanded={this.state.isExpanded}
                seekersList={seekersList}
                onRadioButtonPress={this._handleRadioButtonPress}
                onRemove={onRemoveSeeker}
                selectedSeekers={selectedSeekers}
                onDropDownPress={this._handleMultiSelectionSeekerDropDownPress}
                onSeekerSelection={onSeekerSelection}
            />
        );
    }
}

export default MultiSelectionDropDownContainer;
