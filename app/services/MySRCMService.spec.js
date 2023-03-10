import { searchAbhyasis, searchCity } from './MySRCMService';
import * as AuthService from './firebase/AuthService';
import * as ErrorHandlingUtils from '../utils/ErrorHandlingUtils';
import ServerReachabilityCheck from './ServerReachabilityCheckService';

describe('MySRCMService', () => {
    let authServiceMock;
    let determineNetworkConnectivityStatusMock;

    const updateDetermineNetworkConnectivityStatus = state => {
        determineNetworkConnectivityStatusMock = jest
            .spyOn(
                ServerReachabilityCheck,
                'determineNetworkConnectivityStatus',
            )
            .mockImplementation(() => {
                return Promise.resolve(state);
            });
    };

    afterEach(() => {
        if (authServiceMock) {
            authServiceMock.mockClear();
            authServiceMock = undefined;
        }
        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
    });

    describe('#searchSeeker ', () => {
        const prepare = response => {
            authServiceMock = jest
                .spyOn(AuthService, 'idToken')
                .mockImplementation(() =>
                    Promise.resolve({
                        token: 'mockToken',
                        firebaseId: 'mockFirebaseId',
                    }),
                );
            global.fetch = jest.fn(() => response);
        };

        it('Should be able to make api call when internet is available', async () => {
            const responseMock = { json: () => jest.fn() };
            prepare(Promise.resolve(responseMock));

            const returnValue = await searchAbhyasis(
                {
                    name: 'Abhyasi',
                    ref: 'abhyasiIdMock',
                    email: 'abhyasi.55@mailinator.com',
                    city_id: 876,
                },
                '+919876541230',
            );

            expect(returnValue).toEqual(responseMock);
        });

        it('Should be able to make api call and some error is thrown', async () => {
            const errorHandlingUtilsOnErrorMock = jest
                .spyOn(ErrorHandlingUtils, 'onError')
                .mockImplementation(() => {});
            prepare(Promise.reject({ message: 'errorMock' }));

            const returnValue = await searchAbhyasis(
                {
                    name: 'Abhyasi',
                    ref: 'abhyasiIdMock',
                    email: 'abhyasi.55@mailinator.com',
                    city_id: 876,
                },
                '+919876541230',
            );

            expect(returnValue).toEqual(undefined);
            expect(errorHandlingUtilsOnErrorMock).toBeCalledWith(
                { message: 'errorMock' },
                'MySRCM-SS',
            );
        });
    });

    describe('#searchCity ', () => {
        const prepare = (internet, response) => {
            updateDetermineNetworkConnectivityStatus(internet);
            global.fetch = jest.fn(() => response);
        };
        it('Should be able to make call when internet is available', async () => {
            prepare(
                true,
                Promise.resolve({
                    json: () =>
                        Promise.resolve({
                            results: [
                                {
                                    id: 82928,
                                    name: 'Delhi',
                                    state: 'Delhi',
                                    country: 'India',
                                },
                            ],
                        }),
                }),
            );

            const returnValue = await searchCity('delh');

            expect(returnValue).toEqual([
                {
                    id: 82928,
                    name: 'Delhi',
                    formattedAddress: 'Delhi, Delhi, India',
                },
            ]);
        });

        it('Should not be able to make call when internet is not available', async () => {
            prepare(false);

            const returnValue = await searchCity('delh');

            expect(returnValue).toEqual(undefined);
        });

        it('Should be able to make call and some error is thrown', async () => {
            prepare(true, Promise.reject({ message: 'mockError' }));

            const returnValue = await searchCity('delh');

            expect(returnValue).toEqual(null);
        });
    });
});
