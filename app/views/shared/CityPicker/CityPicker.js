import React, { Component } from 'react';
import { TouchableOpacity, View, Modal } from 'react-native';
import CityPickerUsingGooglePlaces from './CityPickerUsingGooglePlaces';
import CityPickerUsingMySRCM from './CityPickerUsingMySRCM';
import { Text } from 'app/views/shared/Text';
import { AngleDown } from 'app/views/shared/Icon';
import { isUndefined, isNil } from 'lodash';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { styles as cityStyle } from './CityPicker.styles';

class CityPicker extends Component {
    _handleListItemSelected = item => {
        const { onPickerItemSelected } = this.props;
        if (!isUndefined(onPickerItemSelected)) {
            onPickerItemSelected(item);
        }
    };

    _renderCityScreen = () => {
        const {
            isGooglePlacePicker,
            onCloseCityPicker,
            showCityPicker,
            showSpinner,
            onCitySearch,
            showCityList,
            cityList,
        } = this.props;

        if (isGooglePlacePicker) {
            return (
                <Modal
                    visible={showCityPicker}
                    onRequestClose={onCloseCityPicker}>
                    <CityPickerUsingGooglePlaces
                        onItemSelect={this._handleListItemSelected}
                        onBackPress={onCloseCityPicker}
                    />
                </Modal>
            );
        }

        return (
            <Modal visible={showCityPicker} onRequestClose={onCloseCityPicker}>
                <CityPickerUsingMySRCM
                    onItemSelect={this._handleListItemSelected}
                    onBackPress={onCloseCityPicker}
                    onCitySearch={onCitySearch}
                    showCityList={showCityList}
                    showSpinner={showSpinner}
                    cityList={cityList}
                />
            </Modal>
        );
    };
    _renderError = () => {
        const { error, styles } = this.props;
        if (!isNil(error)) {
            return <Text style={styles.error} testID="cityPicker__errorText--text">{error}</Text>;
        }
    };
    render() {
        const { onShowPicker, text, containerStyle, styles } = this.props;

        return (
            <View style={styles.container}>
                <View style={[styles.borderContainer, containerStyle]}>
                    <TouchableOpacity
                        testID="cityPicker__text--TouchableOpacity"
                        style={styles.button}
                        onPress={onShowPicker}>
                        <Text style={styles.cityText} testID="cityPicker__cityText--text">{text}</Text>
                        <AngleDown />
                    </TouchableOpacity>
                </View>
                {this._renderError()}
                {this._renderCityScreen()}
            </View>
        );
    }
}

export default withTheme(CityPicker, cityStyle);
