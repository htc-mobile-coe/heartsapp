import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import ScreenContainer from 'app/views/shared/ScreenContainer';
import OptionsScreenHeader from 'app/views/shared/OptionsScreenHeader';
import { View } from 'native-base';
import { Text } from 'app/views/shared';
import {
    styles as CityPickerUsingGooglePlacesStyles,
    googlePlacesAutocompleteStyles,
} from './CityPickerUsingGooglePlaces.styles';
import { Search } from 'app/views/shared/Icon';
import { get } from 'lodash';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import CityPickerUsingGooglePlacesImages from 'app/views/shared/Images';
import { Image, NativeModules } from 'react-native';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import { IsIOS } from 'app/shared/Constants';

class CityPickerUsingGooglePlaces extends Component {
    _handleListItemSelected = data => {
        const { onItemSelect } = this.props;
        onItemSelect(data);
    };

    _handleBackPress = () => {
        const { onBackPress } = this.props;
        onBackPress(false);
    };

    _renderSearchIcon = () => {
        const { styles } = this.props;
        return <Search style={styles.searchIcon} />;
    };

    _renderSearchItem = data => {
        const { styles, images } = this.props;
        return (
            <View style={styles.searchItem}>
                <Image source={images.location} style={styles.locationIcon} testID="cityPickerUsingGooglePlaces_location--Image"/>
                <Text>{get(data, 'description')}</Text>
            </View>
        );
    };

    _renderSearchBox = () => {
        const { t, styles } = this.props;
        const parentViewStyle = IsIOS ? styles.searchParentView : null;
        return (
            <View style={parentViewStyle}>
                <View style={styles.searchContainer} />
                <View style={styles.googlePlaceView}>
                    <View style={styles.searchBorder}>
                        <GooglePlacesAutocomplete
                            placeholder={t('cityScreen:search')}
                            onPress={this._handleListItemSelected}
                            query={{
                                key:
                                    NativeModules.ApplicationConstants
                                        .GOOGLE_PLACE_API_KEY,
                                language: 'en',
                            }}
                            listViewDisplayed={null}
                            enablePoweredByContainer={false}
                            keepResultsAfterBlur={true}
                            renderLeftButton={this._renderSearchIcon}
                            renderRow={this._renderSearchItem}
                            styles={googlePlacesAutocompleteStyles}
                        />
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const { t, styles, images } = this.props;
        return (
            <ScreenContainer noBackground={false} enableScroll={false}>
                <OptionsScreenHeader
                    title={t('cityScreen:heading')}
                    onBackPress={this._handleBackPress}
                    style={styles.header}
                />
                <View style={styles.bodyContainer}>
                    {this._renderSearchBox()}
                    <View style={styles.footerView}>
                        <View style={styles.hintView}>
                            <Text style={styles.hintText}>
                                {t('cityScreen:hint')}
                            </Text>
                        </View>
                        <View style={styles.footerImageView}>
                            <Image
                                source={images.place}
                                testID="cityPickerUsingGooglePlaces_footer--Image"
                            />
                        </View>
                    </View>
                </View>  
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        CityPickerUsingGooglePlaces,
        CityPickerUsingGooglePlacesStyles,
        CityPickerUsingGooglePlacesImages,
    ),
);
