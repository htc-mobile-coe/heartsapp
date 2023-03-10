import React from 'react';
import { RecurringDonationScreenContainer, mapStateToProps } from './index';
import RecurringDonationScreen from './RecurringDonationScreen';
import { Actions } from 'react-native-router-flux';
import {
    getRecurringDonationSource,
    getLocateTrainerErrorHTMLContent,
} from '../../../services/firebase/RemoteConfigService';
import { render, fireEvent, findByProps } from '../../../utils/TestUtils';

describe('RecurringDonationScreenContainer', () => {
    const goBackMock = jest.fn();

    const Component = (props) => {
        return render(<RecurringDonationScreenContainer t={jest.fn()} {...props} />);
    };

    afterEach(() => {
        goBackMock.mockClear();
    });

    it('By default should have RecurringDonationScreen component', () => {
        const { container } = Component();
        expect(container.findAllByType(RecurringDonationScreen)).toHaveLength(1);
    });

    it('Should update the value of canGoBack when user is able to navigate back to previous webpage', () => {
        const url = 'https://donations-staging-hfi.web.app';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: true, url: url });
        expect(findByProps(container, 'canGoBack', true)).toBeDefined();

    });

    it('Should update the value of canGoBack when user is on main webpage and is not able to go back to previous webpage', () => {
        const url = 'https://donations-staging-hfi.web.app';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: false, url: url });
        expect(findByProps(container, 'canGoBack', false)).toBeDefined();
    });
    it('Should update the value of isPaymentSuccess to true when DONATION STATUS IS SUCCESS', () => {
        const url = 'https://donations-staging-hfi.web.app?status=success';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: false, url: url });
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentInProgress', false);
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentSuccess', true);
    });
    it('Should update the value of isPaymentSuccess to false when DONATION STATUS IS STATUS_FAILURE', () => {
        const url = 'https://donations-staging-hfi.web.app?status=failure';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: false, url: url });
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentInProgress', false);
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentSuccess', false);

    });
    it('Should update the value of showEmailTransactionMessage to true when DONATION STATUS IS EMAIL_SUCCESS', () => {
        const url = 'https://donations-staging-hfi.web.app?status=emailsuccess';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: false, url: url });
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentInProgress', false);
        expect(findByProps(container, 'showEmailTransactionMessage', true)).toBeDefined();
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentSuccess', true);


    });
    it('Should update the value of showEmailTransactionMessage to true when DONATION STATUS IS EMAIL_FAILURE', () => {
        const url = 'https://donations-staging-hfi.web.app?status=emailfailure';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: false, url: url });
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentInProgress', false);
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentSuccess', false);
        expect(findByProps(container, 'showEmailTransactionMessage', true)).toBeDefined();
    });
    it('Should update the value of showEmailTransactionMessage to false when url does not contain RECURRING_DONATION_URL', () => {
        const url = 'https://heartfulness.com?status=emailfailure';
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: false, url: url });
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentInProgress', true);
        expect(container.findAllByType(RecurringDonationScreen)[0]).toHaveProp('isPaymentSuccess', false);
        expect(findByProps(container, 'showEmailTransactionMessage', false)).toBeDefined();
    });

    it('Should able to call onWebPageLoadStart when web page load starts', () => {
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'WebPageLoadStart');
        expect(findByProps(container, 'showActivityIndicator', true)).toBeDefined();
    });

    it('Should able to call onWebPageLoadEnd when web page load ends', () => {
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'WebPageLoadEnd');
        expect(findByProps(container, 'showActivityIndicator', false)).toBeDefined();
    });

    it('should handle onBackPress event, when back button is pressed and canGoBack is true', () => {
        const url = 'https://donations-staging-hfi.web.app';
        const { container } = Component();
        const webViewMock = {
            canGoBack: true,
            current: { goBack: goBackMock },
        };
        fireEvent(container.findByType(RecurringDonationScreen), 'NavigationStateChange', { canGoBack: true, url: url });
        fireEvent(container.findByType(RecurringDonationScreen), 'BackPress', webViewMock);
        expect(findByProps(container, 'canGoBack', true)).toBeDefined();
        expect(goBackMock).toBeCalled();
    });

    it('Should handle onGoToHomePress event, when go to home button is pressed', () => {
        const actionMock = jest.spyOn(Actions, 'replace');
        const { container } = Component();
        fireEvent(container.findByType(RecurringDonationScreen), 'GoToHomePress');
        expect(actionMock).toHaveBeenCalledWith('home');
    });

    it('should handle onBackPress event, when back button is pressed and canGoBack is false', () => {
        const popMock = jest.spyOn(Actions, 'pop');
        const { container } = Component();
        const webViewMock = {
            canGoBack: false,
            current: { goBack: goBackMock },
        };
        fireEvent(container.findByType(RecurringDonationScreen), 'BackPress', webViewMock);
        expect(findByProps(container, 'canGoBack', false)).toBeDefined();
        expect(popMock).toBeCalled();
    });

    it('Should able to load webview source as uri when internet is available and user is anonymous', () => {
        const { container } = Component({
            isApplicationServerReachable: true,
            isAnonymousUser: true,
        });
        expect(container.findByType(RecurringDonationScreen)).toHaveProp('uri', { uri: getRecurringDonationSource() });
    });

    it('Should able to load webview source as uri when internet is available and user is logged in', () => {
        const { container } = Component({
            isApplicationServerReachable: true,
            addressLine1: 'HNo 4 near city mall',
            addressLine2: 'HNo 4 near city mall',
            email: 'hae.baxter@mailinator.com',
            firstName: 'Hae',
            lastName: 'Baxter',
            phone: '+919876543210',
            postalCode: '100001',
            city: 'Delhi',
            cityPlaceId: 'XXXXX_MOCK',
            countryName: 'India',
            isAnonymousUser: false,
        });
        const params =
            '?addressLine1=HNo%204%20near%20city%20mall&addressLine2=HNo%204%20near%20city%20mall&email=hae.baxter@mailinator.com&firstName=Hae&lastName=Baxter&postalCode=100001&cityPlaceId=XXXXX_MOCK&city=Delhi&countryName=India&phone=%2B919876543210';
        expect(container.findByType(RecurringDonationScreen)).toHaveProp('uri', { uri: getRecurringDonationSource() + params });
    });

    it('Should able to load webview source as html error content when internet is not available', () => {
        const { container } = Component({
            isApplicationServerReachable: false
        });
        expect(container.findByType(RecurringDonationScreen)).toHaveProp('uri', { html: getLocateTrainerErrorHTMLContent() });
    });

    it('Should able to map state To Props from redux', () => {
        expect(
            mapStateToProps({
                user: {
                    hfnProfile: {
                        firstName: 'Hae',
                        lastName: 'Baxter',
                        email: 'hae.baxter@mailinator.com',
                        phone: '+919876543210',
                        addressLine1: 'HNo 4 near city mall',
                        postalCode: '100001',
                        city: 'Delhi',
                        cityPlaceId: 'XXXXX_MOCK',
                        countryName: 'India',
                        anonymous: false,
                    },
                },
                deviceState: { isApplicationServerReachable: true },
            }),
        ).toEqual({
            isApplicationServerReachable: true,
            firstName: 'Hae',
            lastName: 'Baxter',
            email: 'hae.baxter@mailinator.com',
            phone: '+919876543210',
            addressLine1: 'HNo 4 near city mall',
            postalCode: '100001',
            city: 'Delhi',
            cityPlaceId: 'XXXXX_MOCK',
            countryName: 'India',
            isAnonymousUser: false,
        });
    });
});
