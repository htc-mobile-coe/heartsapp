import { get, map, join } from 'lodash';
import { NativeModules } from 'react-native';
import { MYSRCM_CLIENT_ID, MY_SRCM_CITIES_URL } from '../shared/Constants';
import { onError } from '../utils/ErrorHandlingUtils';
import { idToken } from './firebase/AuthService';
import ServerReachabilityCheck from './ServerReachabilityCheckService';

const _doRequest = async (url, method) => {
    const idTokenResult = await idToken();

    return fetch(url, {
        method,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idTokenResult.token}`,
            'x-client-id': MYSRCM_CLIENT_ID,
        },
    });
};

export const searchAbhyasis = async (values, phoneNo) => {
    const SEARCH_SEEKER_URL =
        NativeModules.ApplicationConstants.SEARCH_SEEKER_URL;

    try {
        const queryString = join(
            map(Object.keys(values), key => key + '=' + values[key]),
            '&',
        );
        const params = encodeURI(queryString);
        const encodedPhoneNumber = encodeURIComponent(phoneNo);
        const url = `${SEARCH_SEEKER_URL}/?${params}&mobile=${encodedPhoneNumber}`;
        return await _doRequest(url, 'GET');
    } catch (error) {
        onError(error, 'MySRCM-SS');
    }
};

export const searchCity = async searchedText => {
    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const url = `${MY_SRCM_CITIES_URL}/${searchedText}.json`;

            const response = await fetch(url);
            const data = await response.json();

            const results = get(data, 'results');

            const cityList = map(results, item => {
                const { id, name, state, country } = item;
                const formattedAddress = `${name}, ${state}, ${country}`;

                return {
                    id,
                    name,
                    formattedAddress,
                };
            });
            return cityList;
        } catch (err) {
            return null;
        }
    }
};
