import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Text } from 'app/views/shared/Text';
import { styles as CityListItemStyles } from './CityPickerUsingMySRCM.styles';
import CityListItemImages from 'app/views/shared/Images';
import { Image, TouchableOpacity } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
class CityListItem extends Component {
    _handleListItemSelected = () => {
        const { onPress, item } = this.props;
        onPress(item);
    };

    render() {
        const { styles, images, item } = this.props;
        const { formattedAddress } = item;
        return (
            <TouchableOpacity
                testID="cityListItem_cityList--Item"
                onPress={this._handleListItemSelected}
                style={styles.searchItem}>
                <Image source={images.location} style={styles.locationIcon} />
                <Text
                    testID="cityListItem__cityName--text"
                    style={styles.cityText}>
                    {formattedAddress}
                </Text>
            </TouchableOpacity>
        );
    }
}

export default withTranslation()(
    withTheme(CityListItem, CityListItemStyles, CityListItemImages),
);
