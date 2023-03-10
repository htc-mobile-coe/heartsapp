import React from 'react';
import { connect } from 'react-redux';
import HeartSpotLocationSelectionScreen from './HeartSpotLocationSelectionScreen';
import { goBack } from '../../services/BackButtonService';
import { get, isNil, isUndefined, isEqual } from 'lodash';
import LocationService from '../../services/location/LocationService';
import { operations } from '../../state';
import { updateLocation, getFormattedAddress } from './index.service';
import { LOCATION_CONFIG } from '../../shared/Constants';

export class HeartSpotLocationSelectionScreenContainer extends React.Component {
    static getDerivedStateFromProps(props, state) {
        const { heartSpotsLocation } = props;

        const latitude = heartSpotsLocation.latitude;
        const longitude = heartSpotsLocation.longitude;
        if (
            !isEqual(latitude, 0.0) &&
            !isEqual(longitude, 0.0) &&
            isUndefined(state.selectedMapLocation)
        ) {
            return { selectedMapLocation: heartSpotsLocation };
        } else {
            return null
        }
    }

    state = {
        selectedMapLocation: undefined,
    };

    _getCurrentLocationCoordinates = () => {
        const { currentLocationCoordinates } = this.props;
        const { selectedMapLocation } = this.state;

        if (!isUndefined(selectedMapLocation)) {
            const latitude = selectedMapLocation.latitude;
            const longitude = selectedMapLocation.longitude;
            return {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LOCATION_CONFIG.LATITUDE_DELTA,
                longitudeDelta: LOCATION_CONFIG.LONGITUDE_DELTA,
            };
        }
        if (isNil(get(currentLocationCoordinates, 'latitude'))) {
            return null;
        }
        return {
            ...currentLocationCoordinates,
            latitudeDelta: LOCATION_CONFIG.LATITUDE_DELTA,
            longitudeDelta: LOCATION_CONFIG.LONGITUDE_DELTA,
        };
    };
    _getMarkerInfo = () => {
        const { currentLocationCoordinates } = this.props;
        if (isNil(get(currentLocationCoordinates, 'latitude'))) {
            return null;
        }
        return currentLocationCoordinates;
    };
    _handleBackPress = () => {
        this.props.goBack();
    };
    _handleLocationSelection = async location => {
        const { setBusy } = this.props;
        setBusy(true);
        const locations = await LocationService.getPlaceDetails(
            location.place_id,
        );
        this.setState({ selectedMapLocation: locations });
        setBusy(false);
    };
    _handlePickedLocation = async ({ nativeEvent }) => {
        const { setBusy } = this.props;
        const coordinate = nativeEvent.coordinate;
        setBusy(true);
        const locations = await LocationService.getLocationDetails(
            coordinate.latitude,
            coordinate.longitude,
        );
        this.setState({ selectedMapLocation: locations });
        setBusy(false);
    };
    _handleConfirmGPSLocationPress = async () => {
        const { setHeartsSpotsSettings } = this.props;
        const locations = this.state.selectedMapLocation;

        await setHeartsSpotsSettings(
            locations.latitude,
            locations.longitude,
            locations.postalCode,
            locations.addressLine1,
            locations.addressLine2,
            locations.addressLine3,
            locations.city,
            locations.state,
            locations.country,
        );
        await updateLocation(this.props);
        this.props.goBack();
    };
    render() {
        const { selectedMapLocation } = this.state;

        return (
            <HeartSpotLocationSelectionScreen
                selectedMapLocation={selectedMapLocation}
                coordinates={this._getCurrentLocationCoordinates()}
                formattedAddress={getFormattedAddress(selectedMapLocation)}
                markerInfo={this._getMarkerInfo()}
                onBackPress={this._handleBackPress}
                onPickedLocation={this._handlePickedLocation}
                onLocationSelected={this._handleLocationSelection}
                onConfirmGPSLocationPress={this._handleConfirmGPSLocationPress}
            />
        );
    }
}

const mapDispatchToProps = {
    goBack,
    ...operations.appBusyStatus,
    ...operations.user,
    ...operations.heartSpotsSettings,
};

export const mapStateToProps = state => {
    return {
        currentLocationCoordinates: get(
            state.heartSpotsSettings,
            'currentLocationCoordinates',
        ),
        userProfile: get(state.user, 'hfnProfile'),
        heartSpotsLocation: get(state.heartSpotsSettings, 'heartSpotsLocation'),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(HeartSpotLocationSelectionScreenContainer);
