import { setVideoPause as setVideoPauseAction } from './actions';

export const setVideoPause = pause => {
    return dispatch => {
        dispatch(setVideoPauseAction(pause));
    };
};
