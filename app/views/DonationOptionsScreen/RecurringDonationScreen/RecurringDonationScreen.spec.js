import React from 'react';
import { ActivityIndicator } from 'react-native';
import RecurringDonationScreen from './RecurringDonationScreen';
import { WebView } from 'react-native-webview';
import OptionsScreenHeader from '../../shared/OptionsScreenHeader';
import { render, fireEvent, find } from '../../../utils/TestUtils';
import { MediumBoldText } from '../../shared';
import { Check as CheckIcon, Exclamation } from '../../shared/Icon';
describe('RecurringDonationScreen', () => {
    const backHomeButton = 'PaymentScreen__backToHome--button';
    const Component = (props) => {
        return render(<RecurringDonationScreen t={jest.fn()} {...props} />);
    };
    it('Should have a OptionsScreenHeader component', () => {
        const { container } = Component({
            isPaymentInProgress: true,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });
    it('Should have a CheckIcon component when payment is success', () => {
        const { container } = Component({ isPaymentSuccess: true });
        expect(container.findAllByType(CheckIcon)).toHaveLength(1);
    });

    it('Should have a Exclamation component', () => {
        const { container } = Component({ isPaymentSuccess: false });
        expect(container.findAllByType(Exclamation)).toHaveLength(1);
    });

    it('Should have a MediumBoldText component', () => {
        const { container } = Component({ isPaymentSuccess: true });
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should have a WebView component', () => {
        const { container } = Component({ isPaymentInProgress: true });
        expect(container.findAllByType(WebView)).toHaveLength(1);
    });
    it('Should have a ActivityIndicator component', () => {
        const { container } = Component({
            isPaymentInProgress: true,
            showActivityIndicator: true,
        });
        expect(container.findAllByType(ActivityIndicator)).toHaveLength(1);
    });
    it('Should have a Button component for going back to home', () => {
        const { container } = Component({ isPaymentInProgress: false });
        expect(find(container, backHomeButton)).toBeDefined();
    });

    it('Should call onWebPageLoadStart and show ActivityIndicator when webView is loading', () => {
        const onWebPageLoadStartMock = jest.fn();
        const { container } = Component({
            onWebPageLoadStart: onWebPageLoadStartMock,
            isPaymentInProgress: true,
        });
        fireEvent(container.findByType(WebView), 'LoadStart', true);
        expect(onWebPageLoadStartMock).toHaveBeenCalledWith(true);
    });

    it('Should call onWebPageLoadEnd and hide ActivityIndicator for WebView component when load end', () => {
        const onWebPageLoadEndMock = jest.fn();
        const { container } = Component({
            onWebPageLoadEnd: onWebPageLoadEndMock,
            isPaymentInProgress: true,
        });
        fireEvent(container.findByType(WebView), 'LoadEnd', false);
        expect(onWebPageLoadEndMock).toHaveBeenCalledWith(false);
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const backPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backPressMock,
            isPaymentInProgress: true,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backPressMock).toHaveBeenCalled();
    });
});
