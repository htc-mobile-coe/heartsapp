import React from 'react';
import { PaymentScreenContainer, mapStateToProps } from './index';
import { findByProps, render, fireEvent } from '../../../utils/TestUtils';
import PaymentScreen from './PaymentScreen';
import { Actions } from 'react-native-router-flux';

describe('PaymentScreenContainer', () => {
    const setCountriesMock = jest.fn();
    const donationPaymentURLMock =
        'https://donation-service.qa.heartfulnessinstitute.in/donations/paymentSuccess?trkId=315a036f8c6946fc9a1043233b2fa284&amount=50.0&currency=INR&txnId=315a036f8c6946fc9a1043233b2fa284&status=success&refNo=SF-18546';
    const Component = (props) => {
        return render(<PaymentScreenContainer
            {...props}
            setCountries={setCountriesMock} />);
    };
    it('Should exist', () => {
        const { container } = Component({
            donationPaymentURL: donationPaymentURLMock,
        });
        expect(container).toBeDefined();
    });

    it('By default should render PaymentScreen component', () => {
        const { container } = Component({
            donationPaymentURL: donationPaymentURLMock,
        });
        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
    });

    it('Should handle onActivityIndicatorVisibilityChange event, when activity indicator visibility change button is pressed', () => {
        const { container } = Component({
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        fireEvent(container.findByType(PaymentScreen), 'ActivityIndicatorVisibilityChange');
        expect(
            findByProps(container, 'showActivityIndicator', true),
        ).toBeDefined();
    });
    it('should handle onBackButtonPress event when back button is pressed and payment is not in progress', () => {
        const setDonationPaymentURLMock = jest.fn();
        const saveCurrencyMock = jest.fn();
        const goBackMock = jest.fn();
        const saveDonationAmountMock = jest.fn();
        const saveAmountSuggestionsMock = jest.fn();
        const tMock = jest.fn();
        const { container } = Component({
            saveCurrency: saveCurrencyMock,
            saveDonationAmount: saveDonationAmountMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
            donationPaymentURL: donationPaymentURLMock,
            saveAmountSuggestions: saveAmountSuggestionsMock,
            t: tMock,
            donationPaymentURL: donationPaymentURLMock,

        });

        fireEvent(container.findByType(PaymentScreen), 'NavigationStateChange',
            {
                canGoBack: true,
                canGoForward: false,
                loading: false,
                target: 3785,
                title: 'Payment Successful - MOJO1208705N54567807',
                url:
                    'https://donation-service.qa.heartfulnessinstitute.in/donations/paymentSuccess?trkId=315a036f8c6946fc9a1043233b2fa284&amount=50.0&currency=INR&txnId=315a036f8c6946fc9a1043233b2fa284&status=success&refNo=SF-18546',
            });
        fireEvent(container.findByType(PaymentScreen), 'BackButtonPress',
            {
                canGoBack: true,
            },
            {
                current: {
                    goBack: goBackMock,
                    state: { lastErrorEvent: false },
                },
            });
        expect(saveCurrencyMock).toHaveBeenCalledWith('INR');

    });
    it('When back button is pressed should call onBackButtonPress and goBack when canGoBack is true and lastErrorEvent is false', async () => {
        const setDonationPaymentURLMock = jest.fn();
        const saveCurrencyMock = jest.fn();
        const goBackMock = jest.fn();
        const saveDonationAmountMock = jest.fn();
        const saveAmountSuggestionsMock = jest.fn();
        const tMock = jest.fn();
        const { container } = Component({
            saveCurrency: saveCurrencyMock,
            saveDonationAmount: saveDonationAmountMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
            donationPaymentURL: donationPaymentURLMock,
            saveAmountSuggestions: saveAmountSuggestionsMock,
            t: tMock,
            donationPaymentURL: donationPaymentURLMock,

        });

        await expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        await fireEvent(container.findByType(PaymentScreen), 'GoToHomePress');
        await fireEvent(container.findByType(PaymentScreen), 'BackButtonPress',
            {
                canGoBack: false,
            },
            {
                current: {
                    goBack: goBackMock,
                    state: { lastErrorEvent: false },
                },
            });
        expect(setDonationPaymentURLMock).toHaveBeenCalled();
    });



    it('Should call onNavigationStateChange and payment is success, then should call onDonationPaymentSuccess', () => {
        const saveCurrencyMock = jest.fn();
        const setDonationPaymentURLMock = jest.fn();
        const saveAmountSuggestionsMock = jest.fn();
        const tMock = jest.fn();

        const { container } = Component({
            saveCurrency: saveCurrencyMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
            saveAmountSuggestions: saveAmountSuggestionsMock,
            donationPaymentURL: donationPaymentURLMock,
            t: tMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        fireEvent(container.findByType(PaymentScreen), 'NavigationStateChange',
            {
                canGoBack: true,
                canGoForward: false,
                loading: false,
                target: 3785,
                title: 'Payment Successful - MOJO1208705N54567807',
                url:
                    'https://donation-service.qa.heartfulnessinstitute.in/donations/paymentSuccess?trkId=315a036f8c6946fc9a1043233b2fa284&amount=50.0&currency=INR&txnId=315a036f8c6946fc9a1043233b2fa284&status=success&refNo=SF-18546',
            });
        expect(saveCurrencyMock).toHaveBeenCalledWith('INR');
        expect(setDonationPaymentURLMock).toHaveBeenCalledWith(undefined);
        expect(saveAmountSuggestionsMock).toHaveBeenCalledWith([
            '50',
            '100',
            '150',
        ]);

        expect(
            findByProps(container, 'isPaymentInProgress', false),
        ).toBeDefined();
        expect(findByProps(container, 'isPaymentSuccess', true)).toBeDefined();
    });

    it('Should call onNavigationStateChange and payment is failed, then should call onDonationPaymentFailed', () => {
        const saveCurrencyMock = jest.fn();
        const setDonationPaymentURLMock = jest.fn();
        const saveAmountSuggestionsMock = jest.fn();
        const saveDonationAmountMock = jest.fn();
        const tMock = jest.fn();

        const { container } = Component({
            saveCurrency: saveCurrencyMock,
            setDonationPaymentURL: setDonationPaymentURLMock,
            saveAmountSuggestions: saveAmountSuggestionsMock,
            saveDonationAmount: saveDonationAmountMock,
            donationPaymentURL: donationPaymentURLMock,
            t: tMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        fireEvent(container.findByType(PaymentScreen), 'NavigationStateChange', {
            canGoBack: true,
            canGoForward: false,
            loading: false,
            target: 813,
            title: 'Payment Failure - MOJO1208105N54567809',
            url:
                'https://donation-service.qa.heartfulnessinstitute.in/donations/paymentFailure?trkId=9cd8ae074eaa47168a0d4d5392d36385&amount=50.0&currency=INR&status=test',
        });
        fireEvent(container.findByType(PaymentScreen), 'NavigationStateChange', {
            canGoBack: true,
            canGoForward: false,
            loading: false,
            target: 813,
            title: 'Payment Failure - MOJO1208105N54567809',
            url:
                'https://donation-service.qa.heartfulnessinstitute.in/donations/paymentFailure?trkId=9cd8ae074eaa47168a0d4d5392d36385&amount=50.0&currency=INR&status=failure',
        });
        fireEvent(container.findByType(PaymentScreen), 'NavigationStateChange', {
            canGoBack: true,
            canGoForward: false,
            loading: false,
            target: 813,
            title: 'Payment Failure - MOJO1208105N54567809',
            url:
                'https://donation-service.qa/donations/paymentFailure?trkId&amount=50.0&currency=INR&status=status=AUTHENTICATION_FAILED',
        });
        fireEvent(container.findByType(PaymentScreen), 'NavigationStateChange', {
            canGoBack: true,
            canGoForward: false,
            loading: false,
            target: 813,
            title: 'Payment Failure - MOJO1208105N54567809',
            url: 'https://donation-service.qa/donations/undefined',
        });
        expect(saveDonationAmountMock).toHaveBeenCalledWith('');
        expect(saveCurrencyMock).toHaveBeenCalledWith('INR');
        expect(setDonationPaymentURLMock).toHaveBeenCalledWith(undefined);
        expect(saveAmountSuggestionsMock).toHaveBeenCalledWith([
            '50',
            '100',
            '150',
        ]);

        expect(
            findByProps(container, 'isPaymentInProgress', false),
        ).toBeDefined();
        expect(findByProps(container, 'isPaymentSuccess', false)).toBeDefined();
    });

    it('Should handle onGoToHomePress event, when go to home button is pressed', async () => {
        const actionMock = jest.spyOn(Actions, 'replace');
        const saveDonationAmountMock = jest.fn();
        const saveCurrencyMock = jest.fn();
        const saveAmountSuggestionsMock = jest.fn();

        const { container } = Component({
            saveDonationAmount: saveDonationAmountMock,
            saveCurrency: saveCurrencyMock,
            saveAmountSuggestions: saveAmountSuggestionsMock,
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        fireEvent(container.findByType(PaymentScreen), 'GoToHomePress');
        expect(saveDonationAmountMock).toHaveBeenCalledWith('');
        expect(saveCurrencyMock).toHaveBeenCalledWith('INR');
        expect(saveAmountSuggestionsMock).toHaveBeenCalledWith([
            '50',
            '100',
            '150',
        ]);
        expect(
            findByProps(container, 'isPaymentInProgress', true),
        ).toBeDefined();
        expect(findByProps(container, 'isPaymentSuccess', false)).toBeDefined();
        expect(actionMock).toHaveBeenCalledWith('home');
    });

    it('Should handle onRetryPaymentPress event, when retry payment button is pressed', async () => {
        const actionMock = jest.spyOn(Actions, 'replace');

        const { container } = Component({
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        fireEvent(container.findByType(PaymentScreen), 'RetryPaymentPress');
        expect(actionMock).toHaveBeenCalledWith('DonationFormScreen');
    });

    it('Should get source type as html source when paymentGatewayRequestMethod is passed as POST', () => {
        const paymentGatewayRequestMethodMock = 'POST';
        const { container } = Component({
            paymentGatewayRequestMethod: paymentGatewayRequestMethodMock,
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        expect(findByProps(container.findByType(PaymentScreen)).props.source).toEqual({
            html: donationPaymentURLMock,
        });
    });

    it('Should get source type as uri source when paymentGatewayRequestMethod is passed as GET', () => {
        const paymentGatewayRequestMethodMock = 'GET';
        const { container } = Component({
            paymentGatewayRequestMethod: paymentGatewayRequestMethodMock,
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        expect(findByProps(container.findByType(PaymentScreen)).props.source).toEqual({
            uri: donationPaymentURLMock,
        });
    });

    it('Should set state value of showOptionsScreenHeader to false if donationPaymentURL includes payu', () => {
        const { container } = Component({
            donationPaymentURL:
                'https://www.payu.com/sandbox/payment/payment/chkMerchantTxnStatus',
        });

        expect(
            findByProps(container, 'showOptionsScreenHeader', false),
        ).toBeDefined();
    });

    it('Should set state value of showOptionsScreenHeader to true if donationPaymentURL does not includes payu', () => {
        const { container } = Component({
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(
            findByProps(container, 'showOptionsScreenHeader', true),
        ).toBeDefined();
    });
    it('should handle onBackButtonPress event, when back button is pressed and canGoBack is false', async () => {
        const setDonationPaymentURLMock = jest.fn();
        const goBackMock = jest.fn();
        const { container } = Component({
            setDonationPaymentURL: setDonationPaymentURLMock,
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        await fireEvent(container.findByType(PaymentScreen), 'BackButtonPress',
            {
                canGoBack: false,
            },
            {
                current: {
                    goBack: goBackMock,
                    state: { lastErrorEvent: true },
                },
            });
        expect(setDonationPaymentURLMock).toHaveBeenCalled();
    });
    it('Should populate donationAmount value from redux', () => {
        expect(
            mapStateToProps({
                donationAmount: undefined,
                paymentGatewayRequestMethod: undefined,
            }),
        ).toEqual({
            donationAmount: undefined,
            paymentGatewayRequestMethod: undefined,
        });
    });
    it('should handle onBackButtonPress event, when back button is pressed and canGoBack is true', async () => {
        const setDonationPaymentURLMock = jest.fn();
        const goBackMock = jest.fn();
        const { container } = Component({
            setDonationPaymentURL: setDonationPaymentURLMock,
            donationPaymentURL: donationPaymentURLMock,
        });

        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        expect(container.findAllByType(PaymentScreen)).toHaveLength(1);
        await fireEvent(container.findByType(PaymentScreen), 'BackButtonPress',
            {
                canGoBack: true,
            },
            {
                current: {
                    goBack: goBackMock,
                    state: { lastErrorEvent: true },
                },
            });
        expect(setDonationPaymentURLMock).toHaveBeenCalled();
    });
});
