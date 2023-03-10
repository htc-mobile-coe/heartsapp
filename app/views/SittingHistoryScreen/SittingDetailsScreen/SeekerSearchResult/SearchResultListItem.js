import React, { Component } from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { styles as SearchResultListItemStyle } from './SearchResultListItem.styles';
import { View } from 'native-base';
import { BoldText, Text } from '../../../shared/Text';
import { withTheme } from '../../../../styles/theme/WithThemeHOC';
import SeekerSearchResultImages from './img';

class SearchResultListItem extends Component {
    _handleSelection = () => {
        const { index, onSelect, item } = this.props;
        onSelect(index, item);
    };

    _renderSelectedTick = () => {
        const { styles, images, item } = this.props;
        const { isSelected } = item;
        if (isSelected) {
            return (
                <View style={styles.tickImageContainer}>
                    <Image
                        source={images.tick}
                        style={styles.tickImage}
                        testID="SearchResultListItem__tickMark"
                    />
                </View>
            );
        }
    };

    render = () => {
        const { styles, item, images } = this.props;
        const { name, email, seekerId, phoneNo } = item;

        return (
            <View>
                <TouchableOpacity
                    onPress={this._handleSelection}
                    testID="SearchResultListItem__listItem">
                    <View style={styles.rowContainer}>
                        <View style={styles.listItemContainer}>
                            <View style={styles.listSubItemContainer}>
                                <Image
                                    source={images.name}
                                    style={styles.iconStyle}
                                />
                                <BoldText style={styles.nameText}>
                                    {name}
                                </BoldText>
                            </View>
                            <View style={styles.listSubItemContainer}>
                                <Image
                                    source={images.seekerId}
                                    style={styles.iconStyle}
                                />
                                <Text style={styles.primaryColorText}>
                                    {seekerId}
                                </Text>
                            </View>
                            <View style={styles.listSubItemContainer}>
                                <Image
                                    source={images.phoneNo}
                                    style={styles.iconStyle}
                                />
                                <Text style={styles.primaryColorText}>
                                    {phoneNo}
                                </Text>
                            </View>
                            <View style={styles.listSubItemContainer}>
                                <Image
                                    source={images.email}
                                    style={styles.iconStyle}
                                />
                                <Text style={styles.primaryColorText}>
                                    {email}
                                </Text>
                            </View>
                        </View>
                    </View>
                    {this._renderSelectedTick()}
                </TouchableOpacity>
            </View>
        );
    };
}

export default withTheme(
    SearchResultListItem,
    SearchResultListItemStyle,
    SeekerSearchResultImages,
);
