import GooglePlacesService from './GooglePlacesService';
import operations from '../../state/operations';
import Geolocation from 'react-native-geolocation-service';
import { Alert } from 'react-native';
import i18n from 'i18next';
import { LOCATION_STATUS } from '../../shared/Constants';
class LocationService {
    initialize = (dispatch, getState) => {
        this.dispatch = dispatch;
        this.getState = getState;
    };
    populateCurrentLocation = () => {
        Geolocation.getCurrentPosition(
            position => {
                const { coords } = position;
                operations.heartSpotsSettings.setUserCurrentLocation(
                    coords.latitude,
                    coords.longitude,
                )(this.dispatch);
                operations.heartSpotsSettings.setLocationStatus(
                    LOCATION_STATUS.SUCCESS,
                )(this.dispatch);
            },
            error => {
                Alert.alert(
                    i18n.t('locationService:locationErrorTitle'),
                    error.message,
                );
                operations.heartSpotsSettings.setLocationStatus(
                    LOCATION_STATUS.FAILED,
                )(this.dispatch);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
        );
    };
    getLocationDetails = async (latitude, longitude) => {
        return await GooglePlacesService.getPlaceDetailsFromCoordinate(
            latitude,
            longitude,
        );
    };
    getPlaceDetails = async placeId => {
        return await GooglePlacesService.getPlaceDetailsFromPlaceID(placeId);
    };
}

export default new LocationService();
