import React from 'react';
import { Alert } from 'react-native';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import { Toast } from 'native-base';
import { get, isEmpty, isEqual, isNil } from 'lodash';
import HeartsSportsSettingsScreen from './HeartSpotSettingsScreen';
import { goBack } from '../../services/BackButtonService';
import { operations } from '../../state';
import {
    LOCATION_CONFIG,
    LOCATION_STATUS,
    Scenes,
} from '../../shared/Constants';
import { withTranslation } from 'react-i18next';
import PermissionService from '../../services/PermissionService';
import LocationService from '../../services/location/LocationService';
import { fetchProfile, updateProfile } from './index.service';
import { openSettings } from 'react-native-permissions';
import { isNull } from 'lodash';
import { getFirstLetter } from '../../utils/string-utils';

export class HeartsSportsSettingsScreenContainer extends React.Component {
    state = {
        isProfileToggleOn: false,
        isPhotoToggledOn: false,
    };
    componentDidMount = async () => {
        await this._fetchUserProfile();
        await this._fetchGPSLocation();
    };

    _fetchUserProfile = async () => {
        await fetchProfile(this.props);
        const { userProfile } = this.props;

        const isLocationVisibleToPublic = get(
            userProfile,
            'isLocationVisibleToPublic.kind',
        );
        const isPhotoVisibleToPublic = get(
            userProfile,
            'isPhotoVisibleToPublic.kind',
        );

        this.setState({
            isProfileToggleOn: isLocationVisibleToPublic,
            isPhotoToggledOn: isPhotoVisibleToPublic,
        });
    };

    _fetchGPSLocation = async () => {
        const { t, setLocationStatus } = this.props;
        setLocationStatus(LOCATION_STATUS.FETCHING);
        const blocked = await PermissionService.hasLocationPermissionBlocked();
        if (blocked) {
            Alert.alert(
                '',
                t('heartSpotLocationSelectionScreen:locationAccessPrompt'),
                [
                    {
                        text: t('heartSpotLocationSelectionScreen:ok'),
                        onPress: () => {
                            openSettings();
                        },
                    },
                ],
                { cancelable: false },
            );

            setLocationStatus(LOCATION_STATUS.FAILED);
            return;
        }
        await PermissionService.requestLocationPermission();
        LocationService.populateCurrentLocation();
    };

    _getPhotoURL = () => {
        const { photoURL } = this.props;
        if (!isEmpty(photoURL) && !isEqual(photoURL, 'null')) {
            return {
                uri: photoURL,
            };
        } else {
            return null;
        }
    };
    _getProfilePhotoText = () => {
        const { firstName, lastName } = this.props;
        return getFirstLetter(firstName, lastName);
    };
    _getName = () => {
        const { printName, firstName } = this.props;
        if (!isEmpty(printName)) {
            return printName;
        }
        return firstName;
    };
    _getCurrentLocationCoordinates = () => {
        const { currentLocationCoordinates, heartSpotsLocation } = this.props;

        const latitude = heartSpotsLocation.latitude;
        const longitude = heartSpotsLocation.longitude;
        if (!isEqual(latitude, 0.0) && !isEqual(longitude, 0.0)) {
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
    _handleBackPress = () => {
        this.props.goBack();
    };
    _handleGPSLocationPress = () => {
        Actions.push(Scenes.heartSpotLocationSelectionScreen);
    };

    _updateProfile = async (profileVisibility, photoVisibility) => {
        const { setBusy } = this.props;
        setBusy(true);
        const form = {
            isLocationVisibleToPublic: profileVisibility,
            isPhotoVisibleToPublic: photoVisibility,
            isNameVisibleToPublic: false,
        };
        await updateProfile(form, this.props);
        setBusy(false);
    };
    _getProfileMessage = (
        isProfileToggleOn,
        isPhotoToggledOn,
        newProfileValue,
    ) => {
        const { t } = this.props;
        if (isProfileToggleOn && isPhotoToggledOn && !newProfileValue) {
            return t('heartSpotSettingsScreen:profileAndPhotoInVisibleMessage');
        }
        return newProfileValue
            ? t('heartSpotSettingsScreen:profileVisibleMessage')
            : t('heartSpotSettingsScreen:profileInVisibleMessage');
    };
    _handleToggleMyProfileVisible = async newValue => {
        const { isPhotoToggledOn, isProfileToggleOn } = this.state;
        const message = this._getProfileMessage(
            isPhotoToggledOn,
            isProfileToggleOn,
            newValue,
        );
        if (newValue) {
            this.setState({ isProfileToggleOn: true });
            await this._updateProfile(true, isPhotoToggledOn);
        } else {
            this.setState({
                isProfileToggleOn: false,
                isPhotoToggledOn: false,
            });
            await this._updateProfile(false, false);
        }
        Toast.show({
            description: message,
            duration: 3000,
        });
    };
    _handleToggleMyPhotoVisible = async newValue => {
        const { t } = this.props;
        const { isProfileToggleOn } = this.state;

        if (isProfileToggleOn) {
            this.setState({ isPhotoToggledOn: newValue });
            await this._updateProfile(isProfileToggleOn, newValue);
            const message = newValue
                ? t('heartSpotSettingsScreen:profilePhotoVisibleMessage')
                : t('heartSpotSettingsScreen:profilePhotoInVisibleMessage');
            Toast.show({
                description: message,
                duration: 3000,
            });
        }
    };
    _getShowLocationNotAvailableStatus = () => {
        const coordinates = this._getCurrentLocationCoordinates();
        return isNull(coordinates);
    };
    render() {
        const { locationStatus } = this.props;
        return (
            <HeartsSportsSettingsScreen
                isProfileToggleOn={this.state.isProfileToggleOn}
                isPhotoToggledOn={this.state.isPhotoToggledOn}
                coordinates={this._getCurrentLocationCoordinates()}
                name={this._getName()}
                photoURL={this._getPhotoURL()}
                profilePhotoText={this._getProfilePhotoText()}
                onBackPress={this._handleBackPress}
                onGPSLocationPress={this._handleGPSLocationPress}
                onToggleMyProfileVisible={this._handleToggleMyProfileVisible}
                onToggleMyPhotoVisible={this._handleToggleMyPhotoVisible}
                showLocationNotAvailable={this._getShowLocationNotAvailableStatus()}
                locationStatus={locationStatus}
            />
        );
    }
}

export const mapStateToProps = state => {
    return {
        firstName: get(state.user, 'hfnProfile.firstName'),
        lastName: get(state.user, 'hfnProfile.lastName'),
        printName: get(state.user, 'hfnProfile.printName'),
        photoURL: get(state.user, 'hfnProfile.photoURL'),
        userProfile: get(state.user, 'hfnProfile'),
        currentLocationCoordinates: get(
            state.heartSpotsSettings,
            'currentLocationCoordinates',
        ),
        heartSpotsLocation: get(state.heartSpotsSettings, 'heartSpotsLocation'),
        locationStatus: get(state.heartSpotsSettings, 'locationStatus'),
    };
};

const mapDispatchToProps = {
    ...operations.appBusyStatus,
    ...operations.user,
    ...operations.heartSpotsSettings,
    goBack,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(withTranslation()(HeartsSportsSettingsScreenContainer));
