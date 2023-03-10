import reducer from './reducers';
import {
    SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    SET_HEARTS_SPOTS_LOCATION_DETAILS,
    CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    SET_HEARTS_SPOTS_LOCATION_STATUS,
} from './types';

describe('heartSpotsSettingsReducers', () => {
    it('Should set initial state null by default to indicate not yet determined', () => {
        expect(reducer(undefined, {})).toEqual({
            heartSpotsLocation: {
                latitude: 0.0,
                longitude: 0.0,
                postalCode: undefined,
                addressLine1: undefined,
                addressLine2: undefined,
                addressLine3: undefined,
                city: undefined,
                state: undefined,
                country: undefined,
            },
            currentLocationCoordinates: {
                latitude: undefined,
                longitude: undefined,
            },
            locationStatus: undefined,
        });
    });

    it('Should set SET_HEARTS_SPOTS_LOCATION_DETAILS values based on payload', () => {
        expect(
            reducer(
                {},
                {
                    type: SET_HEARTS_SPOTS_LOCATION_DETAILS,
                    payload: {
                        latitude: 12.2322,
                        longitude: 81.32242,
                        postalCode: 600118,
                        addressLine1: 'addressLine1Mock',
                        addressLine2: 'addressLine2Mock',
                        addressLine3: 'addressLine3Mock',
                        city: 'Los Angeles',
                        state: 'California',
                        country: 'United States',
                    },
                },
            ),
        ).toEqual({
            heartSpotsLocation: {
                latitude: 12.2322,
                longitude: 81.32242,
                postalCode: 600118,
                addressLine1: 'addressLine1Mock',
                addressLine2: 'addressLine2Mock',
                addressLine3: 'addressLine3Mock',
                city: 'Los Angeles',
                state: 'California',
                country: 'United States',
            },
        });
    });

    it('Should set SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES values based on payload', () => {
        expect(
            reducer(
                {},
                {
                    type: SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
                    payload: {
                        latitude: 12.2322,
                        longitude: 81.32242,
                    },
                },
            ),
        ).toEqual({
            currentLocationCoordinates: {
                latitude: 12.2322,
                longitude: 81.32242,
            },
        });
    });

    it('Should clear CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES', () => {
        expect(
            reducer(
                {},
                {
                    type: CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
                },
            ),
        ).toEqual({
            heartSpotsLocation: {
                latitude: 0.0,
                longitude: 0.0,
                postalCode: undefined,
                addressLine1: undefined,
                addressLine2: undefined,
                addressLine3: undefined,
                city: undefined,
                state: undefined,
                country: undefined,
            },
            currentLocationCoordinates: {
                latitude: undefined,
                longitude: undefined,
            },
        });
    });
    it('Should set SET_HEARTS_SPOTS_LOCATION_STATUS values based on payload', () => {
        expect(
            reducer(
                {},
                {
                    type: SET_HEARTS_SPOTS_LOCATION_STATUS,
                    payload: 'FAILED',
                },
            ),
        ).toEqual({
            locationStatus: 'FAILED',
        });
    });
});
