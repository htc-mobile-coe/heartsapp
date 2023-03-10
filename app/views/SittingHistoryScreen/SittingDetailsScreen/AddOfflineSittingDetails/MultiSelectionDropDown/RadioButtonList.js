import React, { Component } from 'react';
import { View } from 'native-base';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as radioButtonListStyles } from './MultiSelectionDropDown.styles';
import radioButtonListImages from './img';
import Radio from 'app/views/shared/Radio';
import { map } from 'lodash';
class RadioButtonList extends Component {
    _renderDropDownItem = (item, index) => {
        const { styles, theme, onRadioButtonPress } = this.props;
        const itemTextStyle = item.isSelected
            ? styles.itemTextStyleChecked
            : styles.itemTextStyle;

        return (
            <View key={index} style={styles.dropDownItemStyle}>
                <Radio
                    style={styles.radio}
                    onPress={onRadioButtonPress}
                    color={styles.radioColor.color}
                    selectedColor={theme.brandPrimary}
                    text={item.name}
                    textStyle={itemTextStyle}
                    data={item}
                    selected={item.isSelected}
                    key={index}
                />
            </View>
        );
    };

    _renderRecentSeekerList = () => {
        const { seekersList } = this.props;
        return map(seekersList, this._renderDropDownItem);
    };

    render() {
        return <View>{this._renderRecentSeekerList()}</View>;
    }
}

export default withTranslation()(
    withTheme(RadioButtonList, radioButtonListStyles, radioButtonListImages),
);
