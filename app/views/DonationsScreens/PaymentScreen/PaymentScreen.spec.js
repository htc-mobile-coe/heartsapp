import React from 'react';
import { findByProps, render, fireEvent, find } from '../../../utils/TestUtils';
import PaymentScreen from './PaymentScreen';
import { WebView } from 'react-native-webview';
import { Check as CheckIcon, Exclamation } from '../../shared/Icon';
import { Button, MediumBoldText, Text } from '../../shared';
import { ActivityIndicator } from 'react-native';
import OptionsScreenHeader from '../../shared/OptionsScreenHeader';

describe('PaymentScreen', () => {
    const backToHomeButton = 'PaymentScreen__backToHome--button';
    const retryButton = 'PaymentScreen__retry--button';
    const onActivityIndicatorVisibilityChangeMock = jest.fn();

    const Component = (props) => {
        return render(<PaymentScreen
            onActivityIndicatorVisibilityChange={
                onActivityIndicatorVisibilityChangeMock
            }
            {...props}
        />);
    };
    it('Should exist', () => {
        const { container } = Component({
            isPaymentInProgress: true,
        });
        expect(container).toBeDefined();
    });

    it('Should have 2 Button component for Home and Retry when payment not successfull', () => {
        const { container } = Component({
            isPaymentSuccess: false,
        });
        expect(container.findAllByType(Button)).toHaveLength(2);
    });

    it('Should not show OptionsScreenHeader component when showOptionsScreenHeader is false', () => {
        const { container } = Component({
            isPaymentInProgress: true,
            showOptionsScreenHeader: false,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(0);
    });

    it('Should handle onPress event for backToHomeButton when back button is pressed and call onGoToHomePress', () => {
        const onGoToHomePressMock = jest.fn();
        const { container } = Component({
            onGoToHomePress: onGoToHomePressMock,
            isPaymentInProgress: false,
        });
        fireEvent.press(find(container, backToHomeButton));
        expect(onGoToHomePressMock).toHaveBeenCalled();
    });

    it('Should handle press event for retryButton when retry button is pressed', () => {
        const retryPressMock = jest.fn();
        const { container } = Component({
            isPaymentSuccess: false,
            onRetryPaymentPress: retryPressMock,
        });
        fireEvent.press(find(container, retryButton));
        expect(retryPressMock).toHaveBeenCalled();
    });

    it('Should show a CheckIcon component when payment is successfull ', () => {
        const { container } = Component({
            isPaymentSuccess: true,
        });
        expect(container.findAllByType(CheckIcon)).toHaveLength(1);
    });

    it('Should show a Exclamation icon component when payment is not successfull', () => {
        const { container } = Component({
            isPaymentSuccess: false,
        });
        expect(container.findAllByType(Exclamation)).toHaveLength(1);
    });

    it('Should have a MediumBoldText for transaction title value', () => {
        const { container } = Component({
            isPaymentSuccess: true,
        });
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });

    it('Should show transaction title value in MediumBoldText', () => {
        const { container } = Component({
            isPaymentSuccess: true,
            transactionTitle: 'thankYou',
        });
        expect(findByProps(container, 'isPaymentSuccess', true)).toBeDefined();
        expect(findByProps(container, 'transactionTitle', 'thankYou')).toBeDefined();
    });

    it('Should have a transaction message Text ', () => {
        const { container } = Component({})
        expect(container.findAllByType(Text)).toHaveLength(1);
    });

    it('Should show ActivityIndicator when webView is loading ', () => {
        const { container } = Component({
            isPaymentInProgress: true,
            showActivityIndicator: true,
        });
        expect(container.findAllByType(ActivityIndicator)).toHaveLength(1);
    });

    it('Should show transaction message in Text after completing the payment', () => {
        const { container } = Component({
            transactionMessage: 'success',
        });
        expect(findByProps(container, 'transactionMessage', 'success')).toBeDefined();
    });

    it('Should have WebView component to render payment gateway', () => {
        const { container } = Component({
            isPaymentInProgress: true,
        });
        expect(container.findAllByType(WebView)).toHaveLength(1);
    });

    it('Should have url for WebView component webViewState', () => {
        const onNavigationStateChangeMock = jest.fn();
        const { container } = Component({
            isPaymentInProgress: true,
            onNavigationStateChange: onNavigationStateChangeMock,
        });
        expect(container.findAllByType(WebView)).toHaveLength(1);
        fireEvent(container.findByType(WebView), 'NavigationStateChange')
        expect(onNavigationStateChangeMock).toHaveBeenCalled();
    });

    it('Should show and hide activityIndicator for WebView component when load end', () => {
        const { container } = Component({
            isPaymentInProgress: true,
        });
        expect(container.findAllByType(WebView)).toHaveLength(1);
        fireEvent(container.findByType(WebView), 'LoadEnd')
        expect(onActivityIndicatorVisibilityChangeMock).toHaveBeenCalled();
        expect(
            findByProps(container, 'showActivityIndicator', false),
        ).toBeDefined();
    });

    it('Should show and hide activityIndicator for WebView component when load start', () => {
        const { container } = Component({
            isPaymentInProgress: true,
        });
        expect(container.findAllByType(WebView)).toHaveLength(1);
        fireEvent(container.findByType(WebView), 'LoadStart')
        expect(onActivityIndicatorVisibilityChangeMock).toHaveBeenCalled();
        expect(
            findByProps(container, 'showActivityIndicator', true),
        ).toBeDefined();
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            showOptionsScreenHeader: true,
            isPaymentInProgress: true,
            onBackButtonPress: backButtonPressMock,
            current: undefined,
            canGoBack: false,
        });
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress')
        expect(backButtonPressMock).toHaveBeenCalled();
    });
});
