import { setBusy as setBusyAction } from './actions';

export const setBusy = busy => {
    return dispatch => {
        dispatch(setBusyAction(busy));
    };
};
