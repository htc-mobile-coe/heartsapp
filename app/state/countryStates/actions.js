import { SET_COUNTRIES, SET_STATE_LIST } from './types';

export const setCountries = countries => {
    return {
        type: SET_COUNTRIES,
        payload: {
            countries,
        },
    };
};
export const setStateList = stateList => {
    return {
        type: SET_STATE_LIST,
        payload: {
            stateList,
        },
    };
};
