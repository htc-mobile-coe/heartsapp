import { get, isNull } from 'lodash';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { getProfile, saveProfile } from '../../services/grpc/ProfileService';
import { onError } from '../../utils/ErrorHandlingUtils';
import LocationService from '../../services/location/LocationService';
const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message.split(':')[1];
    }
};

export const fetchProfile = async props => {
    const { setHfnProfile, userProfile, setHeartsSpotsSettings } = props;
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const user = await getProfile();

            const latitude = get(user, 'latitude');
            const longitude = get(user, 'longitude');

            if (!isNull(user)) {
                setHfnProfile({
                    ...user,
                    providerId: get(userProfile, 'providerId'),
                });
                const locations = await LocationService.getLocationDetails(
                    latitude,
                    longitude,
                );
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
            }
        } catch (err) {
            onError(err, 'HSSS-FP');
        }
    }
};

export const updateProfile = async (form, props) => {
    const { userProfile, setHfnProfile } = props;

    const profileParam = {
        email: get(userProfile, 'email'),
        profileId: get(userProfile, 'profileId'),
        uId: get(userProfile, 'uId'),
        gender: get(userProfile, 'gender'),
        firstName: get(userProfile, 'firstName'),
        lastName: get(userProfile, 'lastName'),
        isLocationVisibleToPublic: form.isLocationVisibleToPublic,
        isNameVisibleToPublic: form.isNameVisibleToPublic,
        isPhotoVisibleToPublic: form.isPhotoVisibleToPublic,
        latitude: get(userProfile, 'latitude'),
        longitude: get(userProfile, 'longitude'),
        addressLine1: get(userProfile, 'addressLine1'),
        addressLine2: get(userProfile, 'addressLine2'),
        addressLine3: get(userProfile, 'addressLine3'),
        city: get(userProfile, 'city'),
        phone: get(userProfile, 'phone'),
        stateName: get(userProfile, 'stateName'),
        countryName: get(userProfile, 'countryName'),
        postalCode: get(userProfile, 'postalCode'),
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
