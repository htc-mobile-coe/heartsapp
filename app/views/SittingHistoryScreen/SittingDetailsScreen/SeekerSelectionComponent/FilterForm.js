import React from 'react';
import { withTranslation } from 'react-i18next';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { View } from 'native-base';
import { styles as SeekerSelectionComponentStyle } from './SeekerSelectionComponent.styles';
import FilterItem from './FilterItem';
import { Button, Text } from '../../../shared';
import { isNil } from 'lodash';
import CityFilterItem from './CityFilterItem';

class FilterForm extends React.Component {
    renderErrorMessage = () => {
        const { styles, errors } = this.props;

        if (!isNil(errors.errorMessage)) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.error} testID="filterForm__errorMessage--text">{errors.errorMessage}</Text>
                </View>
            );
        }
    };

    _renderBottomButtonContainer = () => {
        const { t, styles, handleSubmit } = this.props;
        return (
            <View style={styles.bottomButtonContainer}>
                <View style={styles.buttonStyle}>
                    <Button
                        rounded={true}
                        style={styles.searchButton}
                        onPress={handleSubmit}
                        text={t('seekerSelectionComponent:search')}
                        testID="filterForm__search--button"
                    />
                </View>
            </View>
        );
    };

    render() {
        const { t, values, errors, handleChange } = this.props;

        return (
            <View>
                <FilterItem
                    id={values.name.id}
                    label={values.name.label}
                    value={values.name.searchText}
                    error={errors.name}
                    onSearchOptionValueChange={handleChange('name.searchText')}
                />
                <FilterItem
                    id={values.abhyasiId.id}
                    label={values.abhyasiId.label}
                    value={values.abhyasiId.searchText}
                    error={errors.abhyasiId}
                    onSearchOptionValueChange={handleChange(
                        'abhyasiId.searchText',
                    )}
                />
                <FilterItem
                    id={values.phoneNo.id}
                    label={values.phoneNo.label}
                    value={values.phoneNo.searchText}
                    error={errors.phoneNo}
                    hint={t('validations:phoneNumberHint')}
                    onSearchOptionValueChange={handleChange(
                        'phoneNo.searchText',
                    )}
                />
                <FilterItem
                    id={values.email.id}
                    label={values.email.label}
                    value={values.email.searchText}
                    error={errors.email}
                    onSearchOptionValueChange={handleChange('email.searchText')}
                />

                <CityFilterItem
                    id={'city.searchText'}
                    label={values.city.label}
                    value={values.city.searchText}
                    error={errors.city}
                />
                {this.renderErrorMessage()}
                {this._renderBottomButtonContainer()}
            </View>
        );
    }
}

export default withTranslation()(
    withTheme(FilterForm, SeekerSelectionComponentStyle),
);
