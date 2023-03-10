import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as sittingHistoryStyles } from './SittingHistoryScreen.styles';
import { Text } from '../shared/Text';
import { AngleDown } from '../shared/Icon';
import sittingHistoryImages from './img';

class CollapsedItem extends Component {
    _handleOnListItemSelected = () => {
        const { index, onListItemSelected } = this.props;
        onListItemSelected(index);
    };

    render() {
        const { styles, item } = this.props;
        const { date, startTime } = item;
        return (
            <View>
                <TouchableOpacity
                    onPress={this._handleOnListItemSelected}
                    testID="collapsedItem__itemContainer">
                    <View style={styles.listItemContainer}>
                        <Text style={styles.listItemText}>{date}</Text>

                        <View style={styles.listItemRightView}>
                            <Text style={styles.listItemRightText}>
                                {startTime}
                            </Text>
                            <AngleDown style={styles.angleRightIcon} />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(CollapsedItem, sittingHistoryStyles, sittingHistoryImages),
);
