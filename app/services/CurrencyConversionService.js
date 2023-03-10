import { Alert } from 'react-native';
import { get } from 'lodash';

export const getConversion = async props => {
    const { currency, donationAmount } = props;
    try {
        const response = await fetch(
            'https://static-gatsby.web.app/rates/INR.json',
        );
        const json = await response.json();
        if (json.error) {
            return 'Invalid';
        } else {
            const INR_rate = get(json.rates, currency);
            return Math.round(donationAmount * INR_rate).toFixed(2);
        }
    } catch (error) {
        Alert.alert('Error = ', error);
    }
    return '';
};
