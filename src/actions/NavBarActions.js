import { 
    SET_NAV_BAR
} from './types';

import { handleBackPress } from '../config/BackActions';

export const setNavbar = (payload) => {
    return {
        type: SET_NAV_BAR,
        payload: payload
    };
}

export const goBack = () => {
    return (dispatch, getState) => {
        handleBackPress(getState, dispatch);
    }
}