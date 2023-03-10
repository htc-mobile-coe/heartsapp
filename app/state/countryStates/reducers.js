import { SET_COUNTRIES, SET_STATE_LIST } from './types';

const initial = {
    countries: [],
    stateList: [],
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_COUNTRIES:
            return {
                ...previousState,
                countries: action.payload.countries,
            };

        case SET_STATE_LIST:
            return {
                ...previousState,
                stateList: action.payload.stateList,
            };
        default:
            return previousState;
    }
};
