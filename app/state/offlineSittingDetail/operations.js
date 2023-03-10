import {
    setOfflineSittingDetailUIState as setOfflineSittingDetailUIStateAction,
    setSessionDetails as setSessionDetailsAction,
    clearOfflineSittingDetails as clearOfflineSittingDetailsAction,
} from './actions';
import { get } from 'lodash';
export const setOfflineSittingDetailUIState = value => {
    return dispatch => {
        dispatch(setOfflineSittingDetailUIStateAction(value));
    };
};

export const setSessionDetails = offlineSessionDetails => {
    return dispatch => {
        dispatch(setSessionDetailsAction(offlineSessionDetails));
    };
};

export const clearOfflineSittingDetails = offlineSessionDetails => {
    return dispatch => {
        dispatch(clearOfflineSittingDetailsAction(offlineSessionDetails));
    };
};

export const getOfflineSittingDetailSeekerList = state => {
    return get(state, 'offlineSittingDetail.offlineSessionDetails.seekerList');
};
