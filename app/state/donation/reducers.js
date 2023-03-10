import {
    SET_CURRENCY,
    SET_DONATION_AMOUNT,
    SET_CONVERTED_DONATION_AMOUNT,
    SET_PAYMENT_GATEWAY_REQUEST_METHOD,
    SET_DONATION_PAYMENT_URL,
    SET_USER_EMAIL,
    SET_AMOUNT_SUGGESTIONS,
} from './types';
import { find } from 'lodash';
import { getMicroDonationCurrencyConfig } from '../../services/firebase/RemoteConfigService';

const initial = {
    currency: 'INR',
    amountSuggestions: find(getMicroDonationCurrencyConfig(), { value: 'INR' })
        .amounts,
    donationAmount: undefined,
    convertedDonationAmount: undefined,
    paymentGatewayRequestMethod: undefined,
    donationPaymentURL: undefined,
    userEmail: undefined,
};

export default (previousState = initial, action) => {
    switch (action.type) {
        case SET_CURRENCY:
        case SET_AMOUNT_SUGGESTIONS:
        case SET_DONATION_AMOUNT:
        case SET_CONVERTED_DONATION_AMOUNT:
        case SET_PAYMENT_GATEWAY_REQUEST_METHOD:
        case SET_DONATION_PAYMENT_URL:
        case SET_USER_EMAIL:
            return {
                ...previousState,
                ...action.payload,
            };

        default:
            return previousState;
    }
};
