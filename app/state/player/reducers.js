import { SET_VIDEO_PAUSE } from './types';

const initial = {
    hasVideoPaused: false,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_VIDEO_PAUSE:
            return {
                ...previousState,
                hasVideoPaused: action.payload,
            };
    }

    return previousState;
};
