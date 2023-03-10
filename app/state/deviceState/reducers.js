import {
    SET_APPLICATION_SERVER_REACHABLE,
    SET_CONNECTED_TO_NETWORK,
} from './types';

const initial = {
    isApplicationServerReachable: true,
    isConnectedToNetwork: true,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_APPLICATION_SERVER_REACHABLE:
            return {
                ...previousState,
                isApplicationServerReachable: action.payload,
            };

        case SET_CONNECTED_TO_NETWORK:
            return {
                ...previousState,
                isConnectedToNetwork: action.payload,
            };

        default:
            return previousState;
    }
};
