import React, { Component } from 'react';
import CityPicker from './CityPicker';
import {
    isEmpty,
    isEqual,
    isNil,
    get,
    size,
    filter,
    gte,
    lt,
    lowerCase,
    slice,
    toLower,
} from 'lodash';
import { Field } from 'formik';
import { searchCity } from '../../../services/MySRCMService';

const PAGE_SIZE = 10;

class CityPickerContainer extends Component {
    state = {
        showCityPicker: false,
        showCityList: false,
        showSpinner: false,
        cityList: [],
        filteredCityList: [],
    };
    isGooglePlacePicker = () => {
        const { type } = this.props;
        return isEqual(type, CityPickerType.GOOGLE_PLACES);
    };
    _handleListItemSelected = item => {
        const { form, id } = this.props;
        const { setFieldValue } = form;
        setFieldValue(id, item);
        this.setState({
            showCityPicker: false,
            showCityList: false,
            filteredCityList: [],
        });
    };
    _handleCloseCityPicker = () => {
        this.setState({
            showCityPicker: false,
            showCityList: false,
            cityList: [],
            filteredCityList: [],
        });
    };
    _handleShowCityPicker = () => {
        this.setState({ showCityPicker: true });
    };
    _filterCity = searchedText => {
        const filteredCityList = filter(this.state.cityList, value => {
            return lowerCase(value.name).match(lowerCase(searchedText));
        });
        const citiesPage = slice(filteredCityList, 0, PAGE_SIZE);
        this.setState({ filteredCityList: citiesPage, showCityList: true });
    };
    _handleCitySearch = async searchedText => {
        if (!isNil(this._searchTimeout)) {
            clearTimeout(this._searchTimeout);
            this._searchTimeout = null;
        }
        if (gte(size(searchedText), 3) && isEmpty(this.state.cityList)) {
            this.setState({ cityList: [], filteredCityList: [] });

            this._searchTimeout = setTimeout(async () => {
                this.setState({ showSpinner: true });
                const cityList = await searchCity(
                    toLower(searchedText.substring(0, 3)),
                );

                this.setState({ cityList }, () => {
                    this._filterCity(searchedText);
                });

                clearTimeout(this._searchTimeout);
                this._searchTimeout = null;
                this.setState({ showSpinner: false });
            }, 500);
        } else if (lt(size(searchedText), 3)) {
            this.setState({ cityList: [], filteredCityList: [] });
        } else {
            this._filterCity(searchedText);
        }
    };
    _getText = () => {
        const { placeholder, value } = this.props;
        if (isEmpty(value) || isNil(value)) {
            return placeholder;
        }
        return this.isGooglePlacePicker()
            ? get(value, 'description')
            : get(value, 'formattedAddress');
    };
    render() {
        const { containerStyle, error } = this.props;

        return (
            <CityPicker
                error={error}
                isGooglePlacePicker={this.isGooglePlacePicker()}
                showCityPicker={this.state.showCityPicker}
                showCityList={this.state.showCityList}
                showSpinner={this.state.showSpinner}
                text={this._getText()}
                onCloseCityPicker={this._handleCloseCityPicker}
                onShowPicker={this._handleShowCityPicker}
                onPickerItemSelected={this._handleListItemSelected}
                onCitySearch={this._handleCitySearch}
                cityList={this.state.filteredCityList}
                containerStyle={containerStyle}
            />
        );
    }
}
const CityPickerContainerWrapper = ({ ...props }) => {
    return <Field component={CityPickerContainer} {...props} />;
};

export const CityPickerType = {
    GOOGLE_PLACES: 'GOOGLE_PLACES',
    MY_SRCM: 'MY_SRCM',
};
export default CityPickerContainerWrapper;
