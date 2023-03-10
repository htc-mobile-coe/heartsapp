import reducer from './reducers';
import { SET_COUNTRIES, SET_STATE_LIST } from './types';
import Countries from '../../shared/Countries';
import { map } from 'lodash';

describe('countryStatesReducers', () => {
    const list = map(Countries, country => {
        return {
            ...country,
            title: country.value,
            value: country.dial_code,
        };
    });

    it('Should set countries if SET_COUNTRIES called', () => {
        expect(
            reducer(
                { countries: list },
                {
                    type: SET_COUNTRIES,
                    payload: {
                        countries: list,
                    },
                },
            ),
        ).toEqual({
            countries: list,
        });
    });

    it('Should set stateList if SET_STATE_LIST called', () => {
        expect(
            reducer(
                { stateList: [] },
                {
                    type: SET_STATE_LIST,
                    payload: {
                        stateList: [],
                    },
                },
            ),
        ).toEqual({
            stateList: [],
        });
    });
});
