import { SET_BUSY_STATUS } from './types';

export const setBusy = busy => {
    return {
        type: SET_BUSY_STATUS,
        payload: busy,
    };
};
