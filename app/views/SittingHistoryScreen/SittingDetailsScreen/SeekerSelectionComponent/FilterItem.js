import React from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { View, Box } from 'native-base';
import { Input } from 'app/views/shared';
import { MediumBoldText, Text } from '../../../shared/Text';
import { styles as SeekerSelectionComponentStyle } from './SeekerSelectionComponent.styles';
import { isNil } from 'lodash';

class FilterItem extends React.Component {
    _onInputTextChange = text => {
        const { id, onSearchOptionValueChange } = this.props;
        onSearchOptionValueChange(text, id);
    };
    _renderError = () => {
        const { styles, error } = this.props;

        if (!isNil(error)) {
            return <Text style={styles.error}>{error.searchText}</Text>;
        }
        return null;
    };
    _renderHint = () => {
        const { styles, hint } = this.props;

        if (isNil(hint)) {
            return;
        }
        return <Text style={styles.phoneHintText}>{hint}</Text>;
    };

    render() {
        const { label, value, styles } = this.props;

        return (
            <View style={styles.searchSeekerContainer}>
                <View style={styles.searchItemLabelView}>
                    <MediumBoldText>{label} </MediumBoldText>
                </View>
                <Box style={styles.searchInputContainer}>
                    <Input
                        placeholder={label}
                        value={value}
                        autoCapitalize="none"
                        onChangeText={this._onInputTextChange}
                        style={styles.inputStyle}
                        placeholderTextColor="#AFAFAF"
                    />
                    {this._renderHint()}
                </Box>
                {this._renderError()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(FilterItem, SeekerSelectionComponentStyle),
);
