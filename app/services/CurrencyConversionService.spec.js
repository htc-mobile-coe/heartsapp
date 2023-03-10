import { getConversion } from './CurrencyConversionService';

describe('CurrencyConversionService', () => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ rates: { USD: 72 } }),
        }),
    );

    afterEach(() => {
        fetch.mockClear();
    });

    it('should call getConversion', async () => {
        const props = { currency: 'USD', donationAmount: 10 };
        const rate = await getConversion(props);

        expect(rate).toEqual('720.00');
        expect(fetch).toHaveBeenCalledTimes(1);
    });

    it('should receive Invalid response when unsupported currency is passed', async () => {
        fetch.mockImplementationOnce(() =>
            Promise.resolve({
                json: () =>
                    Promise.resolve({ error: "Base 'AA' is not supported." }),
            }),
        );
        const props = { currency: 'AA', donationAmount: 100 };
        const response = await getConversion(props);
        expect(response).toEqual('Invalid');
    });

    it('should return empty string when there is an exception', async () => {
        fetch.mockImplementationOnce(() => Promise.reject('API is down'));

        const props = { currency: 'USD', donationAmount: 100 };
        const rate = await getConversion(props);

        expect(rate).toEqual('');
        expect(fetch).toHaveBeenCalledWith(
            'https://static-gatsby.web.app/rates/INR.json',
        );
    });
});
