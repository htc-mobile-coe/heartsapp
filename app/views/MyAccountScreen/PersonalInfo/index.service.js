import { get, isNull, last } from 'lodash';
import { onError } from '../../../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from '../../../services/ServerReachabilityCheckService';
import { getProfile, saveProfile } from '../../../services/grpc/ProfileService';

const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message.split(':')[1];
    }
};

export const fetchProfile = async props => {
    const { setHfnProfile, userProfile } = props;
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const user = await getProfile();
            if (!isNull(user)) {
                setHfnProfile({
                    ...user,
                    providerId: get(userProfile, 'providerId'),
                });
            }
        } catch (err) {
            onError(err, 'PIS-FP');
        }
    }
};

export const updateProfile = async (form, props) => {
    const { userProfile, setHfnProfile } = props;

    const city = get(form, 'city.description');
    const cityPlaceId = get(form, 'city.place_id');
    const terms = get(form, 'city.terms');
    const countryName = get(last(terms), 'value');

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
        firstName: form.firstName,
        lastName: form.lastName,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city,
        cityPlaceId,
        countryName,
        postalCode: form.postalCode,
        phone: form.phoneNumber,
        isLocationVisibleToPublic: isLocationVisibleToPublic,
        isNameVisibleToPublic: isNameVisibleToPublic,
        isPhotoVisibleToPublic: isPhotoVisibleToPublic,
        latitude: get(userProfile, 'latitude'),
        longitude: get(userProfile, 'longitude'),
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
