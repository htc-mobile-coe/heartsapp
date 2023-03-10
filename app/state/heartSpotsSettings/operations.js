import {
    setHeartsSpotsSettingState as setHeartsSpotsSettingStateAction,
    setUserCurrentLocation as setUserCurrentLocationAction,
    clearLocationCoordinates as clearLocationCoordinatesAction,
    setLocationStatus as setLocationStatusAction,
} from './actions';

export const setHeartsSpotsSettings = (
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
    return dispatch => {
        dispatch(
            setHeartsSpotsSettingStateAction(
                latitude,
                longitude,
                postalCode,
                addressLine1,
                addressLine2,
                addressLine3,
                city,
                state,
                country,
            ),
        );
    };
};

export const setUserCurrentLocation = (latitude, longitude) => {
    return dispatch => {
        dispatch(setUserCurrentLocationAction(latitude, longitude));
    };
};

export const clearLocationCoordinates = () => {
    return dispatch => {
        dispatch(clearLocationCoordinatesAction());
    };
};
export const setLocationStatus = status => {
    return dispatch => {
        dispatch(setLocationStatusAction(status));
    };
};
