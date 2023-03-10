import { SET_VIDEO_PAUSE } from './types';

export const setVideoPause = pause => {
    return {
        type: SET_VIDEO_PAUSE,
        payload: pause,
    };
};
