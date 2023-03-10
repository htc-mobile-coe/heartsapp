import React, { Component } from 'react';
import { View } from 'native-base';
import { Image, TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as dropDownInputStyles } from './MultiSelectionDropDown.styles';
import dropDownInputImages from './img';
import { Text } from 'app/views/shared/Text';
class DropDownInput extends Component {
    render() {
        const { t, styles, images, onPress } = this.props;
        return (
            <TouchableOpacity
                testID="multiSelectionDropdown__dropDownInput--button"
                onPress={onPress}
                style={styles.dropDownInput}>
                <View style={styles.seekerDropdownHeader}>
                    <Text style={styles.dropDownInputPlaceHolder}>
                        {t('addOfflineSittingDetails:seekersName')}
                    </Text>
                    <Image
                        style={styles.dropDownIcon}
                        source={images.dropDownArrow}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}

export default withTranslation()(
    withTheme(DropDownInput, dropDownInputStyles, dropDownInputImages),
);
