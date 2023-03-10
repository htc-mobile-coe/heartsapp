import { SET_BUSY_STATUS } from './types';

const initial = { busy: false };

export default (previousState = initial, action) => {
    if (action.type === SET_BUSY_STATUS) {
        return { busy: action.payload };
    }

    return previousState;
};
