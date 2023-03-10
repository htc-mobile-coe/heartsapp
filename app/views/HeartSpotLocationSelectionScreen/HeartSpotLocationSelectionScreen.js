import React from 'react';
import { Image } from 'react-native';
import { View } from 'native-base';

import { withTranslation } from 'react-i18next';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {
    styles as heartsSportsStyle,
    googlePlacesAutocompleteStyles,
} from './HeartSpotLocationSelectionScreen.styles';
import ScreenContainer from '../shared/ScreenContainer';
import { withTheme } from 'app/styles/theme/WithThemeHOC';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import { Text, MediumBoldText } from '../shared';
import { Button } from '../shared';
import heartSpotImages from './img';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { get, isUndefined } from 'lodash';
import { Search } from '../shared/Icon';
import { LOCATION_CONFIG } from '../../shared/Constants';
const AUTO_COMPLETE_CONFIG = {
    key: LOCATION_CONFIG.GOOGLE_PLACE_API_KEY,
    language: 'en',
};
class HeartSpotLocationSelectionScreen extends React.Component {
    _renderSearchIcon = () => {
        const { styles } = this.props;
        return <Search style={styles.searchIcon} />;
    };
    _renderSearchItem = data => {
        const { styles, images } = this.props;
        return (
            <View style={styles.searchItem}>
                <Image
                    source={images.location}
                    style={styles.searchLocationIcon}
                />
                <Text>{get(data, 'description')}</Text>
            </View>
        );
    };
    _renderSearchBox = () => {
        const { t, styles, onLocationSelected } = this.props;
        return (
            <View style={styles.searchParentView}>
                <View style={styles.searchBorder}>
                    <GooglePlacesAutocomplete
                        textInputProps={{
                            keyboardType: 'number-pad',
                            style: styles.autoCompleteInput,
                        }}
                        placeholder={t(
                            'heartSpotLocationSelectionScreen:typePostalCode',
                        )}
                        onPress={onLocationSelected}
                        query={AUTO_COMPLETE_CONFIG}
                        listViewDisplayed={null}
                        enablePoweredByContainer={false}
                        renderLeftButton={this._renderSearchIcon}
                        renderRow={this._renderSearchItem}
                        styles={googlePlacesAutocompleteStyles}
                    />
                </View>
            </View>
        );
    };
    _renderAddressContainer = () => {
        const {
            styles,
            t,
            images,
            formattedAddress,
            onConfirmGPSLocationPress,
            selectedMapLocation,
        } = this.props;

        if (isUndefined(selectedMapLocation)) {
            return;
        }
        const { latitude, longitude, postalCode } = selectedMapLocation;
        const coordinates = `${latitude}: ${longitude}`;

        return (
            <View style={styles.bottomContainer}>
                <Text style={styles.selectedLocationHeading}>
                    {t('heartSpotLocationSelectionScreen:selectGPSLocation')}
                </Text>
                <View style={styles.locationContainer}>
                    <Image
                        style={styles.locationIcon}
                        source={images.selectedLocation}
                    />
                    <MediumBoldText style={styles.pinCodeText}>
                        {postalCode}
                    </MediumBoldText>
                </View>
                <View style={styles.locationDetailsContainer}>
                    <Text style={styles.addressText}>{formattedAddress}</Text>
                    <View style={styles.locationContainer}>
                        <Text style={styles.addressText}>
                            {t('heartSpotLocationSelectionScreen:latLong')}
                        </Text>

                        <Text style={styles.addressText}>{coordinates}</Text>
                    </View>
                </View>
                <Button
                    testID="heartSpotLocationSelectionScreen__gpsLocation--button"
                    rounded={true}
                    style={styles.confirmLocationButton}
                    textStyle={styles.gpsLocationButtonTitle}
                    onPress={onConfirmGPSLocationPress}
                    text={t('heartSpotLocationSelectionScreen:confirmLocation')}
                />
            </View>
        );
    };
    _renderMarkIfLocationAvailable = () => {
        const { images, selectedMapLocation, formattedAddress } = this.props;
        if (isUndefined(selectedMapLocation)) {
            return;
        }
        const { latitude, longitude } = selectedMapLocation;
        return (
            <Marker
                coordinate={{ latitude, longitude }}
                description={formattedAddress}
                image={images.heartIcon}
            />
        );
    };
    render() {
        const {
            styles,
            t,
            onBackPress,
            onPickedLocation,
            coordinates,
        } = this.props;
        return (
            <ScreenContainer enableScroll={false}>
                <OptionsScreenHeader
                    title={t('heartSpotLocationSelectionScreen:title')}
                    style={styles.headingContainer}
                    onBackPress={onBackPress}
                />
                <View style={styles.topContainer}>
                    {this._renderSearchBox()}
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        currentLocation={true}
                        region={coordinates}
                        onPress={onPickedLocation}>
                        {this._renderMarkIfLocationAvailable()}
                    </MapView>
                </View>
                {this._renderAddressContainer()}
            </ScreenContainer>
        );
    }
}

export default withTranslation()(
    withTheme(
        HeartSpotLocationSelectionScreen,
        heartsSportsStyle,
        heartSpotImages,
    ),
);
