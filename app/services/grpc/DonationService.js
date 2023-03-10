import { NativeModules } from 'react-native';
import { idToken } from '../firebase/AuthService';
import { onError } from '../../utils/ErrorHandlingUtils';
import AuthenticationException from '../../shared/AuthenticationException';

export const fetchDonationItems = async citizenshipCountry => {
    try {
        const idTokenResult = await idToken();

        const fetchDonationItemsResponse = await NativeModules.DonationService.fetchDonationItems(
            {
                firebaseIdToken: idTokenResult.token,
                message: JSON.stringify({
                    uId: idTokenResult.firebaseId,
                    idToken: idTokenResult.token,
                    citizenshipCountry: citizenshipCountry,
                }),
            },
        );

        return JSON.parse(fetchDonationItemsResponse);
    } catch (err) {
        onError(err, 'DNS-FDI');
        return null;
    }
};

export const fetchDonations = async () => {
    try {
        const idTokenResult = await idToken();

        const fetchDonationsResponse = await NativeModules.DonationService.fetchDonations(
            {
                firebaseIdToken: idTokenResult.token,
                message: JSON.stringify({
                    uId: idTokenResult.firebaseId,
                    idToken: idTokenResult.token,
                }),
            },
        );

        return JSON.parse(fetchDonationsResponse);
    } catch (err) {
        onError(err, 'DNS-FD');
        return null;
    }
};

export const donate = async param => {
    try {
        const idTokenResult = await idToken();

        const request = {
            userProfile: {
                userId: idTokenResult.firebaseId,
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

        const donateResponse = await NativeModules.DonationService.donate({
            firebaseIdToken: idTokenResult.token,
            message: JSON.stringify({
                uId: idTokenResult.firebaseId,
                idToken: idTokenResult.token,
                request: request,
            }),
        });

        return donateResponse;
    } catch (err) {
        throw new AuthenticationException(err.message, err.code);
    }
};
