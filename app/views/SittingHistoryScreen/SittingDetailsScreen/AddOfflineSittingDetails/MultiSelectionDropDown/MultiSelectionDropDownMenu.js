import React, { Component } from 'react';
import { View } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as multiSelectionDropDownStyles } from './MultiSelectionDropDown.styles';
import multiSelectionDropDownImages from './img';
import { MediumBoldText } from 'app/views/shared/Text';
import DropDownInput from './DropDownInput';
import RadioButtonList from './RadioButtonList';
import DottedList from './DottedList';
import { Add } from 'app/views/shared/Icon';
import { isEmpty } from 'lodash';
class MultiSelectionDropDown extends Component {
    _renderHeaderContainer = () => {
        const { styles, t } = this.props;

        return (
            <View style={styles.dropDownHeaderContainer}>
                <MediumBoldText style={styles.dropDownTitleText}>
                    {t('addOfflineSittingDetails:recentSeekers')}
                </MediumBoldText>
            </View>
        );
    };
    _renderSelectedSeekers = () => {
        const { selectedSeekers, onRemove, styles } = this.props;
        if (!isEmpty(selectedSeekers)) {
            return (
                <View style={styles.multiSelectionDropDownContainer}>
                    <DottedList
                        onRemove={onRemove}
                        selectedSeekers={selectedSeekers}
                    />
                </View>
            );
        }
    };
    _renderMultiSelectionDropDownContainer = () => {
        const {
            styles,
            isExpanded,
            seekersList,
            onRadioButtonPress,
        } = this.props;
        if (isExpanded) {
            return (
                <View style={styles.multiSelectionDropDownContainer}>
                    {this._renderHeaderContainer()}
                    <RadioButtonList
                        onRadioButtonPress={onRadioButtonPress}
                        seekersList={seekersList}
                    />
                </View>
            );
        }
        return <View>{this._renderSelectedSeekers()}</View>;
    };
    render() {
        const {
            styles,
            isExpanded,
            selectedSeekers,
            onDropDownPress,
            onSeekerSelection,
        } = this.props;
        return (
            <View>
                <View style={styles.dropDownInputContainer}>
                    <DropDownInput
                        selectedSeekers={selectedSeekers}
                        isExpanded={isExpanded}
                        onPress={onDropDownPress}
                    />
                    <TouchableOpacity
                        onPress={onSeekerSelection}
                        testID="multiSelectionDropdown__addSeeker--button"
                        style={styles.addSeekerButton}>
                        <Add
                            testID="multiSelectionDropdown__addSeeker--icon"
                            style={styles.addSeekerButtonIcon}
                        />
                    </TouchableOpacity>
                </View>
                {this._renderMultiSelectionDropDownContainer()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(
        MultiSelectionDropDown,
        multiSelectionDropDownStyles,
        multiSelectionDropDownImages,
    ),
);
