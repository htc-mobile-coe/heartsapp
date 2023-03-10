import { setCountries, setStateList } from './operations';
import { SET_COUNTRIES, SET_STATE_LIST } from './types';
import Countries from '../../shared/Countries';
import { map, sortBy } from 'lodash';

describe('countryStatesOperations', () => {
    describe('#setCountries', () => {
        it('should set countries properly', () => {
            const dispatchMock = jest.fn();
            const list = map(Countries, country => {
                return {
                    ...country,
                    title: country.value,
                    value: country.dial_code,
                };
            });
            setCountries(sortBy(list, country => country.title))(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    countries: sortBy(list, country => country.title),
                },
                type: SET_COUNTRIES,
            });
        });
    });

    describe('#setStateList', () => {
        global.fetch = jest.fn(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({
                        next: null,
                        results: [
                            {
                                id: 60,
                                name: 'Australian Capital Territory',
                                code: 'ACT',
                                country: {
                                    id: 267,
                                    name: 'Australia',
                                },
                                latitude: null,
                                longitude: null,
                                active: true,
                            },
                            {
                                id: 67,
                                name: 'Western Australia',
                                code: 'WA',
                                country: {
                                    id: 267,
                                    name: 'Australia',
                                },
                                latitude: null,
                                longitude: null,
                                active: true,
                            },
                        ],
                    }),
            }),
        );
        afterEach(() => {
            fetch.mockClear();
        });

        it('should initially set null in state', () => {
            const dispatchMock = jest.fn();
            setStateList('267')(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    stateList: null,
                },
                type: SET_STATE_LIST,
            });
        });

        it('should set state properly after getting response', async () => {
            const dispatchMock = jest.fn();
            await setStateList('267')(dispatchMock);

            const states = [
                {
                    id: 60,
                    name: 'Australian Capital Territory',
                    code: 'ACT',
                    country: { id: 267, name: 'Australia' },
                    latitude: null,
                    longitude: null,
                    active: true,
                    title: 'Australian Capital Territory',
                },
                {
                    id: 67,
                    name: 'Western Australia',
                    code: 'WA',
                    country: { id: 267, name: 'Australia' },
                    latitude: null,
                    longitude: null,
                    active: true,
                    title: 'Western Australia',
                },
            ];

            expect(dispatchMock).toHaveBeenCalledTimes(2);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: { stateList: null },
                type: SET_STATE_LIST,
            });
            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    stateList: sortBy(states, state => state.title),
                },
                type: SET_STATE_LIST,
            });
        });
    });
});
