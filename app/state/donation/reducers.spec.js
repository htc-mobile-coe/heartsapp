import reducer from './reducers';
import {
    SET_CURRENCY,
    SET_DONATION_AMOUNT,
    SET_CONVERTED_DONATION_AMOUNT,
    SET_DONATION_PAYMENT_URL,
    SET_USER_EMAIL,
    SET_AMOUNT_SUGGESTIONS,
    SET_PAYMENT_GATEWAY_REQUEST_METHOD,
} from './types';

describe('donationsReducers', () => {
    it('Should set initial value of currency to INR by default', () => {
        expect(reducer(undefined, {})).toEqual({
            currency: 'INR',
            amountSuggestions: ['50', '100', '150'],
        });
    });

    it('Should set currency to USD if SET_CURRENCY called', () => {
        expect(
            reducer(
                { currency: 'USD' },
                {
                    type: SET_CURRENCY,
                    payload: {
                        currency: 'USD',
                    },
                },
            ),
        ).toEqual({
            currency: 'USD',
        });
    });

    it('Should set amountSuggestions to {50, 100, 150} if SET_AMOUNT_SUGGESTIONS called', () => {
        expect(
            reducer(
                { amountSuggestions: ['50', '100', '150'] },
                {
                    type: SET_AMOUNT_SUGGESTIONS,
                    payload: {
                        amountSuggestions: ['50', '100', '150'],
                    },
                },
            ),
        ).toEqual({
            amountSuggestions: ['50', '100', '150'],
        });
    });

    it('Should set donationAmount to 100 if SET_DONATION_AMOUNT called', () => {
        expect(
            reducer(
                { donationAmount: 100 },
                {
                    type: SET_DONATION_AMOUNT,
                    payload: {
                        donationAmount: 100,
                    },
                },
            ),
        ).toEqual({
            donationAmount: 100,
        });
    });

    it('Should set convertedDonationAmount to 738 if SET_CONVERTED_DONATION_AMOUNT called', () => {
        expect(
            reducer(
                { convertedDonationAmount: 738 },
                {
                    type: SET_CONVERTED_DONATION_AMOUNT,
                    payload: {
                        convertedDonationAmount: 738,
                    },
                },
            ),
        ).toEqual({
            convertedDonationAmount: 738,
        });
    });

    it('Should set paymentGatewayRequestMethod to POST if SET_PAYMENT_GATEWAY_REQUEST_METHOD called', () => {
        expect(
            reducer(
                { paymentGatewayRequestMethod: 'POST' },
                {
                    type: SET_PAYMENT_GATEWAY_REQUEST_METHOD,
                    payload: {
                        paymentGatewayRequestMethod: 'POST',
                    },
                },
            ),
        ).toEqual({
            paymentGatewayRequestMethod: 'POST',
        });
    });

    it('Should set donationPaymentURL to www.google.com if SET_DONATION_PAYMENT_URL called', () => {
        expect(
            reducer(
                { donationPaymentURL: 'www.google.com' },
                {
                    type: SET_DONATION_PAYMENT_URL,
                    payload: {
                        donationPaymentURL: 'www.google.com',
                    },
                },
            ),
        ).toEqual({
            donationPaymentURL: 'www.google.com',
        });
    });

    it('Should set donationPaymentURL to preceptor.23@mailinator.com if SET_DONATION_PAYMENT_URL called', () => {
        expect(
            reducer(
                { userEmail: 'preceptor.23@mailinator.com' },
                {
                    type: SET_USER_EMAIL,
                    payload: {
                        userEmail: 'preceptor.23@mailinator.com',
                    },
                },
            ),
        ).toEqual({
            userEmail: 'preceptor.23@mailinator.com',
        });
    });
});
