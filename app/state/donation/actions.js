import {
    SET_CONVERTED_DONATION_AMOUNT,
    SET_CURRENCY,
    SET_DONATION_AMOUNT,
    SET_PAYMENT_GATEWAY_REQUEST_METHOD,
    SET_DONATION_PAYMENT_URL,
    SET_USER_EMAIL,
    SET_AMOUNT_SUGGESTIONS,
} from './types';

export const setCurrency = currency => {
    return {
        type: SET_CURRENCY,
        payload: {
            currency,
        },
    };
};

export const setAmountSuggestions = amountSuggestions => {
    return {
        type: SET_AMOUNT_SUGGESTIONS,
        payload: {
            amountSuggestions,
        },
    };
};

export const setDonationAmount = donationAmount => {
    return {
        type: SET_DONATION_AMOUNT,
        payload: {
            donationAmount,
        },
    };
};

export const setConvertedDonationAmount = convertedDonationAmount => {
    return {
        type: SET_CONVERTED_DONATION_AMOUNT,
        payload: {
            convertedDonationAmount,
        },
    };
};

export const setPaymentGatewayRequestMethod = paymentGatewayRequestMethod => {
    return {
        type: SET_PAYMENT_GATEWAY_REQUEST_METHOD,
        payload: {
            paymentGatewayRequestMethod,
        },
    };
};

export const setDonationPaymentURL = donationPaymentURL => {
    return {
        type: SET_DONATION_PAYMENT_URL,
        payload: {
            donationPaymentURL,
        },
    };
};

export const setUserEmail = userEmail => {
    return {
        type: SET_USER_EMAIL,
        payload: {
            userEmail,
        },
    };
};
