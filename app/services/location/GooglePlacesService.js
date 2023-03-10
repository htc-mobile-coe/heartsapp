import { NativeModules } from 'react-native';
import {
    get,
    isEmpty,
    isNil,
    filter,
    includes,
    first,
    compact,
    join,
} from 'lodash';
import { LOCATION_CONFIG } from '../../shared/Constants';
const GOOGLE_GEOCODE_URL =
    NativeModules.ApplicationConstants.GOOGLE_GEOCODE_URL;
const GOOGLE_PLACE_DETAILS_URL =
    NativeModules.ApplicationConstants.GOOGLE_PLACE_DETAILS_URL;

class GooglePlacesService {
    _getPlacesNameFromAddressComponents = (
        addressComponents,
        type,
        nameLength,
    ) => {
        const place = filter(addressComponents, e => {
            const types = get(e, 'types');
            return includes(types, type);
        });
        return get(first(place), nameLength);
    };
    getPlaceDetailsFromCoordinate = async (latitude, longitude) => {
        const response = await fetch(
            `${GOOGLE_GEOCODE_URL}?latlng=${latitude},${longitude}&sensor=true/false&key=${
                LOCATION_CONFIG.GOOGLE_PLACE_API_KEY
            }`,
        );
        const json = await response.json();
        const results = get(json, 'results', []);
        if (!isEmpty(results)) {
            const result = results[0];
            const place_id = get(result, 'place_id');
            return this.getPlaceDetailsFromPlaceID(place_id);
        }
    };
    getPlaceDetailsFromPlaceID = async placeId => {
        const response = await fetch(
            `${GOOGLE_PLACE_DETAILS_URL}?&key=${
                LOCATION_CONFIG.GOOGLE_PLACE_API_KEY
            }&place_id=${placeId}`,
        );
        const json = await response.json();
        const result = get(json, 'result');
        if (!isNil(result)) {
            const geometry = get(result, 'geometry.location');
            const address_components = get(result, 'address_components', []);

            const postal_code = this._getPlacesNameFromAddressComponents(
                address_components,
                'postal_code',
                'short_name',
            );

            const streetNumber = this._getPlacesNameFromAddressComponents(
                address_components,
                'street_number',
                'long_name',
            );
            const route = this._getPlacesNameFromAddressComponents(
                address_components,
                'route',
                'long_name',
            );
            const sublocalityLevel3 = this._getPlacesNameFromAddressComponents(
                address_components,
                'sublocality_level_3',
                'long_name',
            );
            const sublocalityLevel2 = this._getPlacesNameFromAddressComponents(
                address_components,
                'sublocality_level_2',
                'long_name',
            );
            const sublocalityLevel1 = this._getPlacesNameFromAddressComponents(
                address_components,
                'sublocality_level_1',
                'long_name',
            );

            const cityName = this._getPlacesNameFromAddressComponents(
                address_components,
                'locality',
                'long_name',
            );
            const stateName = this._getPlacesNameFromAddressComponents(
                address_components,
                'administrative_area_level_1',
                'long_name',
            );
            const countryName = this._getPlacesNameFromAddressComponents(
                address_components,
                'country',
                'long_name',
            );
            const addressLines3 = [sublocalityLevel2, sublocalityLevel1];
            const addressLine1 = join(compact([streetNumber, route]), ', ');
            const addressLine3 = join(compact(addressLines3), ', ');

            return {
                latitude: get(geometry, 'lat'),
                longitude: get(geometry, 'lng'),
                postalCode: postal_code,
                addressLine1,
                addressLine2: sublocalityLevel3,
                addressLine3,
                city: cityName,
                state: stateName,
                country: countryName,
            };
        }
    };
}

export default new GooglePlacesService();
