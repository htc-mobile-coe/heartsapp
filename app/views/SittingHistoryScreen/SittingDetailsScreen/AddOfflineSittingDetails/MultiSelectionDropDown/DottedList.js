import React, { Component } from 'react';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import DottedListItem from './DottedListItem';
import { map } from 'lodash';

class DottedList extends Component {
    _renderSeekerNames = (item, index) => {
        const { onRemove } = this.props;

        return <DottedListItem index={index} item={item} onRemove={onRemove} key={index}/>;
    };

    render() {
        const { selectedSeekers } = this.props;
        return map(selectedSeekers, this._renderSeekerNames);
    }
}

export default withTheme(DottedList);
