import React, { Component } from 'react';
import { View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as dottedListItemStyles } from './MultiSelectionDropDown.styles';
import { Text } from 'app/views/shared/Text';
import { Close } from 'app/views/shared/Icon';

class DottedListItem extends Component {
    _handleRemovePress = () => {
        const { index, item, onRemove } = this.props;
        onRemove(item, index);
    };

    render() {
        const { index, item, styles } = this.props;

        return (
            <View key={index} style={styles.selectedSeekersContainer}>
                <View style={styles.pointStyle} />
                <Text
                    testID="dottedListItem__seekerName--text"
                    style={styles.seekerName}>
                    {item.name}
                </Text>
                <TouchableOpacity
                    testID="dottedListItem__removeSeeker--button"
                    onPress={this._handleRemovePress}>
                    <Close
                        testID="dottedListItem__removeSeeker--icon"
                        style={styles.removeSeeker}
                    />
                </TouchableOpacity>
            </View>
        );
    }
}

export default withTheme(DottedListItem, dottedListItemStyles);
