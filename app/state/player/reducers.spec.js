import reducer from './reducers';
import { SET_VIDEO_PAUSE } from './types';

describe('videoPlayer', () => {
    it('Should set initial state by default', () => {
        expect(reducer(undefined, {})).toEqual({
            hasVideoPaused: false,
        });
    });

    it('Should set video pause to true if SET_VIDEO_PAUSE called', () => {
        expect(
            reducer(
                { hasVideoPaused: false },
                { type: SET_VIDEO_PAUSE, payload: true },
            ),
        ).toEqual({
            hasVideoPaused: true,
        });
    });
});
