import {
    setCurrency,
    setDonationAmount,
    setConvertedDonationAmount,
    setPaymentGatewayRequestMethod,
    setDonationPaymentURL as donationPaymentURL,
    setUserEmail,
    setAmountSuggestions,
} from './actions';

export const saveCurrency = currency => {
    return dispatch => {
        dispatch(setCurrency(currency));
    };
};

export const saveAmountSuggestions = amountSuggestions => {
    return dispatch => {
        dispatch(setAmountSuggestions(amountSuggestions));
    };
};

export const saveDonationAmount = amount => {
    return dispatch => {
        dispatch(setDonationAmount(amount));
    };
};

export const saveConvertedDonationAmount = amount => {
    return dispatch => {
        dispatch(setConvertedDonationAmount(amount));
    };
};

export const savePaymentGatewayRequestMethod = requestMethod => {
    return dispatch => {
        dispatch(setPaymentGatewayRequestMethod(requestMethod));
    };
};

export const setDonationPaymentURL = url => {
    return dispatch => {
        dispatch(donationPaymentURL(url));
    };
};

export const saveUserEmail = email => {
    return dispatch => {
        dispatch(setUserEmail(email));
    };
};
