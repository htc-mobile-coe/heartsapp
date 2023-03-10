import { fetchDonationItems, fetchDonations, donate } from './DonationService';
import * as AuthService from '../firebase/AuthService';
import { NativeModules } from 'react-native';
import * as ErrorHandlingUtils from '../../utils/ErrorHandlingUtils';

describe('DonationService', () => {
    let authServiceMock;
    let errorHandlingUtilsOnErrorMock;

    afterEach(() => {
        if (authServiceMock) {
            authServiceMock.mockClear();
            authServiceMock = undefined;
        }

        if (errorHandlingUtilsOnErrorMock) {
            errorHandlingUtilsOnErrorMock.mockClear();
            errorHandlingUtilsOnErrorMock = undefined;
        }
    });

    beforeEach(() => {
        authServiceMock = jest
            .spyOn(AuthService, 'idToken')
            .mockReturnValueOnce(
                Promise.resolve({
                    token: 'mockToken',
                    firebaseId: 'mockFirebaseId',
                }),
            );

        errorHandlingUtilsOnErrorMock = jest
            .spyOn(ErrorHandlingUtils, 'onError')
            .mockImplementation(() => {});
    });

    describe('#fetchDonationItems', () => {
        const prepare = fetchDonationItemsMock => {
            NativeModules.DonationService = {
                fetchDonationItems: fetchDonationItemsMock,
            };
        };

        it('Should make a native call to make donation service grpc call', async () => {
            const fetchDonationItemsMock = jest.fn().mockReturnValue({});
            prepare(fetchDonationItemsMock);

            await fetchDonationItems('IN');

            expect(fetchDonationItemsMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    uId: 'mockFirebaseId',
                    idToken: 'mockToken',
                    citizenshipCountry: 'IN',
                }),
            });
        });

        it('Should log the error and return null if some error is thrown from native module', async () => {
            const fetchDonationItemsMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(fetchDonationItemsMock);
            const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

            await fetchDonationItems('IN');

            expect(fetchDonationItemsMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    uId: 'mockFirebaseId',
                    idToken: 'mockToken',
                    citizenshipCountry: 'IN',
                }),
            });
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'DNS-FDI',
            );
        });
    });

    describe('#fetchDonations', () => {
        const prepare = fetchDonationsMock => {
            NativeModules.DonationService = {
                fetchDonations: fetchDonationsMock,
            };
        };

        it('Should make a native call to make donation service grpc call', async () => {
            const fetchDonationsMock = jest.fn().mockReturnValue({});
            prepare(fetchDonationsMock);

            await fetchDonations();

            expect(fetchDonationsMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    uId: 'mockFirebaseId',
                    idToken: 'mockToken',
                }),
            });
        });

        it('Should log the error and return null if some error is thrown from native module', async () => {
            const fetchDonationsMock = jest.fn().mockImplementation(() =>
                Promise.reject({
                    message: 'Error message',
                }),
            );

            prepare(fetchDonationsMock);
            const onErrorMock = jest.spyOn(ErrorHandlingUtils, 'onError');

            await fetchDonations();

            expect(fetchDonationsMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    uId: 'mockFirebaseId',
                    idToken: 'mockToken',
                }),
            });
            expect(onErrorMock).toHaveBeenCalledWith(
                { message: 'Error message' },
                'DNS-FD',
            );
        });
    });

    describe('#donate', () => {
        const prepare = donateMock => {
            NativeModules.DonationService = {
                donate: donateMock,
            };
        };

        const param = {
            email: 'mockEmail',
            firstName: 'mockFirstName',
            lastName: 'mockLastName',
            phoneNumber: 'mockPhoneNumber',
            amount: '100',
            country: 'mockCountry',
            currency: 'INR',
            id: 'mockId',
            citizenshipCountry: 'IN',
            state: 'state',
            address: 'address',
            postalCode: 'postalCode',
            taxId: 'taxId',
        };
        const request = {
            userProfile: {
                userId: 'mockFirebaseId',
                firstName: param.firstName,
                lastName: param.lastName,
                emailAddress: param.email,
                phoneNumber: param.phoneNumber,
                addressLine1: param.addressLine1,
                addressLine2: param.addressLine2,
                city: param.city,
                state: param.state,
                postalCode: param.postalCode,
                country: param.country,
                memberId: '',
                taxId: param.taxId,
                citizenshipCountry: param.citizenshipCountry,
                role: null,
            },
            lineItems: [
                {
                    id: '',
                    donationItem: {
                        id: param.id,
                        name: '',
                        description: '',
                        region: '',
                        currency: '',
                        billingAccountName: '',
                        isActive: false,
                    },
                    currency: 'INR',
                    amount: param.amount,
                    isRecurring: false,
                    recurringStartDate: '',
                    recurringFrequency: '',
                },
            ],
            currency: null,
            amount: null,
            description: null,
            clientSuccessRedirectUrl: '',
            clientFailureRedirectUrl: '',
        };

        it('Should make a native call to make donation service grpc call', async () => {
            const donateMock = jest.fn().mockReturnValue(request);
            prepare(donateMock);

            await donate(param);

            expect(donateMock).toHaveBeenCalledWith({
                firebaseIdToken: 'mockToken',
                message: JSON.stringify({
                    uId: 'mockFirebaseId',
                    idToken: 'mockToken',
                    request: request,
                }),
            });
        });
    });
});
