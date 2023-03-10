import reducer from './reducers';
import { SET_BUSY_STATUS } from './types';

describe('AppBusyStatusReducers', () => {
    it('Should set initial state to busy false by default', () => {
        expect(reducer(undefined, {})).toEqual({ busy: false });
    });

    it('Should set busy to true if SET_BUSY_STATUS called', () => {
        expect(
            reducer({ busy: false }, { type: SET_BUSY_STATUS, payload: true }),
        ).toEqual({
            busy: true,
        });
    });

    it('Should not handle other actions', () => {
        expect(
            reducer(
                {
                    busy: true,
                },
                {
                    type: 'RandomeAction',
                    payload: {
                        day1: '1',
                        day2: '2',
                        day3: '3',
                    },
                },
            ),
        ).toEqual({
            busy: true,
        });
    });
});
