import { makeDonation, fetchProfile } from './index.service';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import * as PersonalInfoService from '../../services/grpc/ProfileService';
import * as DonationService from '../../services/grpc/DonationService';
import { getDonationID } from '../../services/firebase/RemoteConfigService';

describe('DonationService', () => {
    let determineNetworkConnectivityStatusMock;
    let getProfileMock;
    let donateMock;

    const savePaymentGatewayRequestMethodMock = jest.fn();
    const setDonationPaymentURLMock = jest.fn();

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

    const updateGetProfileResponse = response => {
        getProfileMock = jest
            .spyOn(PersonalInfoService, 'getProfile')
            .mockImplementation(() => {
                return response;
            });
    };
    const donateResponse = response => {
        donateMock = jest
            .spyOn(DonationService, 'donate')
            .mockImplementation(() => {
                return response;
            });
    };

    const citizenship = 'IN';

    const form = {
        convertedDonationAmount: '100',
        country: { title: 'India' },
        state: { title: 'M.P' },
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        city: 'city',
        postalCode: 'postalCode',
        phoneNumber: 'phoneNumber',
        panNumber: 'panNumber',
    };

    const formDataWithEmptyStateValue = {
        convertedDonationAmount: '100',
        country: { title: 'India' },
        state: undefined,
        currency: 'currency',
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'email',
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        city: 'city',
        postalCode: 'postalCode',
        phoneNumber: 'phoneNumber',
        panNumber: 'panNumber',
    };

    const donationRequestParam = {
        citizenshipCountry: citizenship,
        amount: form.convertedDonationAmount,
        country: form.country.title,
        state: form.state.title,
        currency: form.currency,
        id: getDonationID(),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        city: form.city,
        postalCode: form.postalCode,
        phoneNumber: form.phoneNumber,
        taxId: form.panNumber,
    };

    const donationRequestParamWithoutStateValue = {
        citizenshipCountry: citizenship,
        amount: formDataWithEmptyStateValue.convertedDonationAmount,
        country: formDataWithEmptyStateValue.country.title,
        state: '',
        currency: formDataWithEmptyStateValue.currency,
        id: getDonationID(),
        firstName: formDataWithEmptyStateValue.firstName,
        lastName: formDataWithEmptyStateValue.lastName,
        email: formDataWithEmptyStateValue.email,
        addressLine1: formDataWithEmptyStateValue.addressLine1,
        addressLine2: formDataWithEmptyStateValue.addressLine2,
        city: formDataWithEmptyStateValue.city,
        postalCode: formDataWithEmptyStateValue.postalCode,
        phoneNumber: formDataWithEmptyStateValue.phoneNumber,
        taxId: formDataWithEmptyStateValue.panNumber,
    };

    const donateResponsePOSTData = {
        paymentGatewayRequestMethod: 'POST',
        paymentGatewayRequestParamMap:
            '{"amount" : "150","firstname" : "Abhyasi 30 ","phone" : "9876543210","furl" : "https://donation-service.qa.heartfulnessinstitute.in/donations/payments/payu/redirectAck", "service_provider" : "payu_paisa",  "surl" : "https://donation-service.qa.heartfulnessinstitute.in/donations/payments/payu/redirectAck",  "productinfo" : "SF-18443:The Green Kanha Initiative",  "udf2" : "SF-18443",  "key" : "5VzoKI",  "hash" : "cd48e423cd51ab8636f7d3083b4296f59567b2d3fb5b3a4966f8b4e70ab06ac84f9fbc5eed0da7ba77cca12727df235a316b5355b4a7d665df9f9f19893c8700",  "email" : "abhyasi.30@mailinator.com",  "txnid" : "SF-18443"}',
        paymentGatewayUrl: 'https://sandboxsecure.payu.in/_payment',
        userId: 'wFEkReU1W1SPwtAJhSPo3xsueZZ2',
    };
    const donateResponseTestData = {
        paymentGatewayRequestMethod: 'Test',
        paymentGatewayRequestParamMap:
            '{"amount" : "150","firstname" : "Abhyasi 30 ","phone" : "9876543210", "furl" : "https://donation-service.qa.heartfulnessinstitute.in/donations/payments/payu/redirectAck","service_provider" : "payu_paisa","surl" : "https://donation-service.qa.heartfulnessinstitute.in/donations/payments/payu/redirectAck","productinfo" : "SF-18443:The Green Kanha Initiative","udf2" : "SF-18443","key" : "5VzoKI","hash" : "cd48e423cd51ab8636f7d3083b4296f59567b2d3fb5b3a4966f8b4e70ab06ac84f9fbc5eed0da7ba77cca12727df235a316b5355b4a7d665df9f9f19893c8700","email" : "abhyasi.30@mailinator.com","txnid" : "SF-18443"}',
        paymentGatewayUrl: 'https://sandboxsecure.payu.in/_payment',
        userId: 'wFEkReU1W1SPwtAJhSPo3xsueZZ2',
    };
    const donateResponseData = {
        paymentGatewayRequestMethod: 'GET',
        paymentGatewayRequestParamMap: '',
        paymentGatewayUrl:
            'https://donation-service.qa.heartfulnessinstitute.in/donations/paymentSuccess?trkId=315a036f8c6946fc9a1043233b2fa284&amount=50.0&currency=INR&txnId=315a036f8c6946fc9a1043233b2fa284&status=success&refNo=SF-18546',
        userId: 'wFEkReU1W1SPwtAJhSPo3xsueZZ2',
    };

    afterEach(() => {
        if (getProfileMock) {
            getProfileMock.mockClear();
            getProfileMock = undefined;
        }

        if (donateMock) {
            donateMock.mockClear();
            donateMock = undefined;
        }

        if (determineNetworkConnectivityStatusMock) {
            determineNetworkConnectivityStatusMock.mockClear();
            determineNetworkConnectivityStatusMock = undefined;
        }
    });

    it('should call getProfile', async () => {
        const setHfnProfileMock = jest.fn();
        const clearUserDetailsMock = jest.fn();

        updateGetProfileResponse(Promise.resolve());

        await fetchProfile({
            setHfnProfile: setHfnProfileMock,
            clearUserDetails: clearUserDetailsMock,
        });

        expect(getProfileMock).toBeCalled();
    });

    it('should call donate and when we receive paymentGatewayRequestMethod as POST', async () => {
        updateDetermineNetworkConnectivityStatus(true);

        const donateResponseData = JSON.stringify(donateResponsePOSTData)
        donateResponse(donateResponseData);

        await makeDonation(form, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });

        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).toHaveBeenCalledWith(donationRequestParam);
        expect(savePaymentGatewayRequestMethodMock).toHaveBeenCalledWith(
            'POST',
        );
    });
    it('should call donate and when we not receive paymentGatewayRequestMethod as POST or GET', async () => {
        updateDetermineNetworkConnectivityStatus(true);
        const donateResponseTestDataMock = JSON.stringify(donateResponseTestData)
        donateResponse(donateResponseTestDataMock);
        await makeDonation(form, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });
        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).toHaveBeenCalledWith(donationRequestParam);
    });
    it('should call donate and when we receive paymentGatewayRequestMethod as GET', async () => {
        updateDetermineNetworkConnectivityStatus(true);

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return donateResponseData;
        });

        donateResponse(donateResponseData);

        await makeDonation(form, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });

        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).toHaveBeenCalledWith(donationRequestParam);
        expect(savePaymentGatewayRequestMethodMock).toHaveBeenCalledWith('GET');
        expect(setDonationPaymentURLMock).toHaveBeenCalledWith(
            donateResponseData.paymentGatewayUrl,
        );
    });

    it('should call donate and when state value is not selected', async () => {
        updateDetermineNetworkConnectivityStatus(true);

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return donateResponseData;
        });

        donateResponse(donateResponseData);

        await makeDonation(formDataWithEmptyStateValue, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });

        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).toHaveBeenCalledWith(
            donationRequestParamWithoutStateValue,
        );
        expect(savePaymentGatewayRequestMethodMock).toHaveBeenCalledWith('GET');
        expect(setDonationPaymentURLMock).toHaveBeenCalledWith(
            donateResponseData.paymentGatewayUrl,
        );
    });

    it('Should return the error message when some error is thrown by donate service call', async () => {
        updateDetermineNetworkConnectivityStatus(true);

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return undefined;
        });

        donateResponse(Promise.reject({ message: 'Error:mockError' }));

        const returnValue = await makeDonation(form, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });

        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).toHaveBeenCalledWith(donationRequestParam);
        expect(returnValue).toEqual('mockError');
    });
    it('Should return the error message when some error is thrown by donate service call', async () => {
        updateDetermineNetworkConnectivityStatus(true);

        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return undefined;
        });

        donateResponse(Promise.reject({ message: 'Error:mockError' }));
        const returnValue = await makeDonation(form, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });
        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).toHaveBeenCalledWith(donationRequestParam);
        expect(returnValue).toEqual('mockError');
    });
    it('should not call donate, when internet is not available', async () => {
        updateDetermineNetworkConnectivityStatus(false);
        JSON.parse = jest.fn().mockImplementationOnce(() => {
            return donateResponseData;
        });

        donateResponse(donateResponseData);
        await makeDonation(form, citizenship, {
            savePaymentGatewayRequestMethod: savePaymentGatewayRequestMethodMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
        });
        expect(determineNetworkConnectivityStatusMock).toHaveBeenCalled();
        expect(donateMock).not.toHaveBeenCalled();
    });
});
