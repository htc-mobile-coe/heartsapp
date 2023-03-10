import {
    SET_HEARTS_SPOTS_LOCATION_DETAILS,
    SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    SET_HEARTS_SPOTS_LOCATION_STATUS,
} from './types';

export const setHeartsSpotsSettingState = (
    latitude,
    longitude,
    postalCode,
    addressLine1,
    addressLine2,
    addressLine3,
    city,
    state,
    country,
) => {
    return {
        type: SET_HEARTS_SPOTS_LOCATION_DETAILS,
        payload: {
            latitude,
            longitude,
            postalCode,
            addressLine1,
            addressLine2,
            addressLine3,
            city,
            state,
            country,
        },
    };
};

export const setUserCurrentLocation = (latitude, longitude) => {
    return {
        type: SET_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
        payload: {
            latitude,
            longitude,
        },
    };
};

export const clearLocationCoordinates = () => {
    return {
        type: CLEAR_HEARTS_SPOTS_CURRENT_LOCATION_COORDINATES,
    };
};
export const setLocationStatus = status => {
    return {
        type: SET_HEARTS_SPOTS_LOCATION_STATUS,
        payload: status,
    };
};
