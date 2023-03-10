import { donate } from '../../services/grpc/DonationService';
import ServerReachabilityCheck from '../../services/ServerReachabilityCheckService';
import { getDonationID } from '../../services/firebase/RemoteConfigService';
import { get, isEqual, isNull, chain, keys, isUndefined } from 'lodash';
import { getProfile } from '../../services/grpc/ProfileService';

const _getErrorMessage = error => {
    if (!isNull(error.message)) {
        return error.message.split(':')[1];
    }
};

const _createHTMLForm = (donationItem, url) => {
    const paramsMap = get(donationItem, 'paymentGatewayRequestParamMap');
    const params = JSON.parse(paramsMap);
    const inputs = chain(keys(params))
        .map(
            key =>
                `<input name='${key}' type='hidden' value='${params[key]}' />`,
        )
        .join('')
        .value();
    return `
    <html>
        <head></head> 
        <body onload='form1.submit()'>
            <form id='form1' action='${url}' method='post'> ${inputs} </form>
        </body>
    </html>`;
};

const _getStateTitle = form => {
    const title = get(form, 'state.title');
    if (isUndefined(title)) {
        return '';
    }
    return title;
};

export const makeDonation = async (form, citizenship, props) => {
    const { savePaymentGatewayRequestMethod, setDonationPaymentURL } = props;

    const donationItemsParam = {
        citizenshipCountry: citizenship,
        amount: form.convertedDonationAmount,
        country: form.country.title,
        state: _getStateTitle(form),
        city: form.city,
        currency: form.currency,
        id: getDonationID(),
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        addressLine1: form.addressLine1,
        addressLine2: form.addressLine2,
        postalCode: form.postalCode,
        phoneNumber: form.phoneNumber,
        taxId: form.panNumber,
    };

    const canDoNetworkCalls = await ServerReachabilityCheck.determineNetworkConnectivityStatus();
    if (canDoNetworkCalls) {
        try {
            const donateResponse = await donate(donationItemsParam);
            const donationItem = JSON.parse(donateResponse);

            const paymentGatewayRequestMethod = get(
                donationItem,
                'paymentGatewayRequestMethod',
            );
            const url = get(donationItem, 'paymentGatewayUrl');

            savePaymentGatewayRequestMethod(paymentGatewayRequestMethod);

            if (isEqual(paymentGatewayRequestMethod, 'POST')) {
                const htmlForm = _createHTMLForm(donationItem, url);
                setDonationPaymentURL(htmlForm);
            } else if (isEqual(paymentGatewayRequestMethod, 'GET')) {
                setDonationPaymentURL(url);
            }
            return null;
        } catch (err) {
            return _getErrorMessage(err);
        }
    }
};

export const fetchProfile = async props => {
    const { setHfnProfile, clearUserDetails } = props;
    clearUserDetails();
    const user = await getProfile();
    setHfnProfile(user);
};
