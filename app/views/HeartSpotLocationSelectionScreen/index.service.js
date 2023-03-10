import { get, isNull, isUndefined, join, compact } from 'lodash';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { saveProfile } from '../../services/grpc/ProfileService';

const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message.split(':')[1];
    }
};

export const getFormattedAddress = selectedMapLocation => {
    if (isUndefined(selectedMapLocation)) {
        return;
    }
    const items = [];
    items.push(selectedMapLocation.addressLine1);
    items.push(selectedMapLocation.addressLine2);
    items.push(selectedMapLocation.addressLine3);
    items.push(selectedMapLocation.city);
    items.push(selectedMapLocation.state);
    items.push(selectedMapLocation.country);
    return join(compact(items), ', ');
};
export const updateLocation = async props => {
    const { userProfile, setHfnProfile, heartSpotsLocation } = props;

    const latitude = get(heartSpotsLocation, 'latitude');
    const longitude = get(heartSpotsLocation, 'longitude');
    const isLocationVisibleToPublic = get(
        userProfile,
        'isLocationVisibleToPublic.kind',
    );
    const isNameVisibleToPublic = get(
        userProfile,
        'isNameVisibleToPublic.kind',
    );
    const isPhotoVisibleToPublic = get(
        userProfile,
        'isPhotoVisibleToPublic.kind',
    );
    const profileParam = {
        email: get(userProfile, 'email'),
        profileId: get(userProfile, 'profileId'),
        uId: get(userProfile, 'uId'),
        gender: get(userProfile, 'gender'),
        firstName: get(userProfile, 'firstName'),
        lastName: get(userProfile, 'lastName'),
        phone: get(userProfile, 'phone'),
        addressLine1: get(userProfile, 'addressLine1'),
        addressLine2: get(userProfile, 'addressLine2'),
        addressLine3: get(userProfile, 'addressLine3'),
        city: get(userProfile, 'city'),
        stateName: get(userProfile, 'stateName'),
        countryName: get(userProfile, 'countryName'),
        postalCode: get(userProfile, 'postalCode'),
        latitude: latitude,
        longitude: longitude,
        isLocationVisibleToPublic: isLocationVisibleToPublic,
        isNameVisibleToPublic: isNameVisibleToPublic,
        isPhotoVisibleToPublic: isPhotoVisibleToPublic,
    };

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const saveProfileResponse = await saveProfile(profileParam);
            setHfnProfile({
                ...saveProfileResponse,
                providerId: get(userProfile, 'providerId'),
            });
            return null;
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};
