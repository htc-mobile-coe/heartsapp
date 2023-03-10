import React from 'react';
import { StyleSheet, View } from 'react-native';
import { connect } from 'react-redux';
import OrderedListBulletCalculator from '../../../config/OrderedListBulletCalculator';

import TwoLevelOrderedListItem from './TwoLevelOrderedListItem/TwoLevelOrderedListItem'

class TwoLevelOrderedList extends React.Component {

    constructor(props) {
        super(props);
    };

    styles() {
        return StyleSheet.create({
            container: {
                flexDirection: 'column',
            }
        });
    }

    renderChild(child, i) {
        return (
            <TwoLevelOrderedListItem key={i} model={child} bullet={OrderedListBulletCalculator(this.props.model.attributes, i)} />
        );
    };

    render() {
        const listItems = this.props.model.children.map((child, i) => {
            return this.renderChild(child, i);
        });

        return (
            <View style={this.styles().container}>
                {listItems}
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        ...state.theme
    };
}

export default connect(mapStateToProps)(TwoLevelOrderedList);