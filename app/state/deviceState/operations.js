import {
    setApplicationServerReachable as setApplicationServerReachableAction,
    setConnectedToNetwork as setConnectedToNetworkAction,
} from './actions';
import { get } from 'lodash';

export const setApplicationServerReachable = reachable => {
    return dispatch => {
        dispatch(setApplicationServerReachableAction(reachable));
    };
};

export const setConnectedToNetwork = connected => {
    return dispatch => {
        dispatch(setConnectedToNetworkAction(connected));
    };
};

export const isApplicationServerReachable = state => {
    return get(state.deviceState, 'isApplicationServerReachable');
};
