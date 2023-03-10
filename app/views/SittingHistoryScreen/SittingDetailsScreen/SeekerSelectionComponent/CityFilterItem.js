import React from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { View } from 'native-base';
import { MediumBoldText } from '../../../shared/Text';
import { styles as SeekerSelectionComponentStyle } from './SeekerSelectionComponent.styles';
import CityPicker, { CityPickerType } from '../../../shared/CityPicker';

class CityFilterItem extends React.Component {
    render() {
        const { label, styles, id, value } = this.props;

        return (
            <View style={styles.searchSeekerContainer}>
                <View style={styles.searchItemLabelView}>
                    <MediumBoldText>{label} </MediumBoldText>
                </View>
                <View style={[styles.searchInputContainer, styles.searchItem]}>
                    <CityPicker
                        type={CityPickerType.MY_SRCM}
                        id={id}
                        placeholder={label}
                        value={value}
                        containerStyle={styles.citySearchItem}
                    />
                </View>
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(CityFilterItem, SeekerSelectionComponentStyle),
);
