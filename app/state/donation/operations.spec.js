import {
    saveCurrency,
    saveDonationAmount,
    saveConvertedDonationAmount,
    setDonationPaymentURL,
    saveUserEmail,
    saveAmountSuggestions,
    savePaymentGatewayRequestMethod,
} from './operations';
import {
    SET_CURRENCY,
    SET_DONATION_AMOUNT,
    SET_CONVERTED_DONATION_AMOUNT,
    SET_DONATION_PAYMENT_URL,
    SET_USER_EMAIL,
    SET_AMOUNT_SUGGESTIONS,
    SET_PAYMENT_GATEWAY_REQUEST_METHOD,
} from './types';

describe('donationOperations', () => {
    describe('#saveCurrency', () => {
        it('should set currency properly', () => {
            const dispatchMock = jest.fn();
            saveCurrency('INR')(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    currency: 'INR',
                },
                type: SET_CURRENCY,
            });
        });
    });

    describe('#saveAmountSuggestions', () => {
        it('should set amountSuggestions properly', () => {
            const dispatchMock = jest.fn();
            saveAmountSuggestions(['50', '100', '150'])(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    amountSuggestions: ['50', '100', '150'],
                },
                type: SET_AMOUNT_SUGGESTIONS,
            });
        });
    });

    describe('#saveDonationAmount', () => {
        it('should set amount properly', () => {
            const dispatchMock = jest.fn();
            saveDonationAmount(19)(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    donationAmount: 19,
                },
                type: SET_DONATION_AMOUNT,
            });
        });
    });

    describe('#saveConvertedDonationAmount', () => {
        it('should set converted donation amount properly', () => {
            const dispatchMock = jest.fn();
            saveConvertedDonationAmount(19)(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    convertedDonationAmount: 19,
                },
                type: SET_CONVERTED_DONATION_AMOUNT,
            });
        });
    });

    describe('#savePaymentGatewayRequestMethod', () => {
        it('should set payment gateway request method properly', () => {
            const dispatchMock = jest.fn();
            savePaymentGatewayRequestMethod('POST')(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    paymentGatewayRequestMethod: 'POST',
                },
                type: SET_PAYMENT_GATEWAY_REQUEST_METHOD,
            });
        });
    });

    describe('#setDonationPaymentURL', () => {
        it('should set converted donation amount properly', () => {
            const dispatchMock = jest.fn();
            setDonationPaymentURL('www.google.com')(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    donationPaymentURL: 'www.google.com',
                },
                type: SET_DONATION_PAYMENT_URL,
            });
        });
    });

    describe('#saveUserEmail', () => {
        it('should set user email value properly', () => {
            const dispatchMock = jest.fn();
            saveUserEmail('preceptor.23@mailinator.com')(dispatchMock);

            expect(dispatchMock).toHaveBeenCalledWith({
                payload: {
                    userEmail: 'preceptor.23@mailinator.com',
                },
                type: SET_USER_EMAIL,
            });
        });
    });
});
