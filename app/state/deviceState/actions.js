import {
    SET_APPLICATION_SERVER_REACHABLE,
    SET_CONNECTED_TO_NETWORK,
} from './types';

export const setApplicationServerReachable = reachable => {
    return {
        type: SET_APPLICATION_SERVER_REACHABLE,
        payload: reachable,
    };
};

export const setConnectedToNetwork = connected => {
    return {
        type: SET_CONNECTED_TO_NETWORK,
        payload: connected,
    };
};
