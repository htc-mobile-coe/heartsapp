import {
    setCountries as setCountriesAction,
    setStateList as setStateListAction,
} from './actions';
import Countries from '../../shared/Countries';
import { isUndefined, isNull, get, map, sortBy, concat } from 'lodash';
import { NativeModules } from 'react-native';

const GET_STATE_URL = NativeModules.ApplicationConstants.STATES_IN_COUNTRY_URL;

export const setCountries = () => {
    return dispatch => {
        const list = map(Countries, country => {
            return {
                ...country,
                title: country.value,
                value: country.dial_code,
            };
        });

        dispatch(setCountriesAction(sortBy(list, country => country.title)));
    };
};

export const setStateList = county => {
    return async dispatch => {
        try {
            dispatch(setStateListAction(null));
            const url = `${GET_STATE_URL}?country=${county}&page=1`;
            const stateList = await getStatesInCountry(url, []);
            const states = map(stateList, stateOfCountry => {
                return { ...stateOfCountry, title: stateOfCountry.name };
            });
            dispatch(setStateListAction(sortBy(states, state => state.title)));
        } catch (err) {
            dispatch(setStateListAction([]));
        }
    };
};

const getStatesInCountry = async (url, list) => {
    const response = await fetch(url);
    const json = await response.json();
    const stateList = concat(list, get(json, 'results'));
    const next = get(json, 'next');
    if (!isUndefined(next) && !isNull(next)) {
        return getStatesInCountry(next, stateList);
    }
    return stateList;
};
