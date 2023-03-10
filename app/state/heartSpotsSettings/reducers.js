import {
    SET_HEARTS_SPOTS_LOCATION_DETAILS,
    SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    SET_HEARTS_SPOTS_LOCATION_STATUS,
} from './types';
const initial = {
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
    currentLocationCoordinates: { latitude: undefined, longitude: undefined },
    locationStatus: undefined,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_HEARTS_SPOTS_LOCATION_DETAILS:
            return { ...previousState, heartSpotsLocation: action.payload };
        case SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES:
            return {
                ...previousState,
                currentLocationCoordinates: { ...action.payload },
            };
        case CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES:
            return {
                ...previousState,
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
            };
        case SET_HEARTS_SPOTS_LOCATION_STATUS:
            return {
                ...previousState,
                locationStatus: action.payload,
            };
        default:
            return previousState;
    }
};
