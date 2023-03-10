import React from 'react';
import { render, fireEvent, find, findByProps } from '../../utils/TestUtils';
import WeeklyInspirationScreen from './WeeklyInspirationScreen';
import SubscriptionPopup from './SubscriptionPopup';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';
import WebView from 'react-native-webview';

describe('WeeklyInspirationScreen', () => {
    const webViewScreen = 'weeklyInspirationScreen__webView';
    const ref = { current: { reload: jest.fn() } }
    const createReferenceSpy = jest.spyOn(React, "createRef").mockReturnValue(ref);

    const Component = (props) => {
        return render(<WeeklyInspirationScreen {...props} />);
    };
    it('Should have web view screen component', () => {
        createReferenceSpy()
        const { container } = Component({ requestToWebViewReload: true });
        expect(find(container, webViewScreen)).toBeDefined();
    });

    it('Should have a OptionsScreenHeader component', () => {
        const { container } = Component();
        expect(container.findAllByType(OptionsScreenHeader)).toHaveLength(1);
    });

    it('Should have a SubscriptionPopup component', () => {
        const { container } = Component({ showSubscriptionSuccess: false });
        expect(container.findAllByType(SubscriptionPopup)).toBeDefined();
    });
    it('Should able to reload webview, when internet re-connecting', () => {
        const { container } = Component({ requestToWebViewReload: false });
        expect(findByProps(container, 'requestToWebViewReload', false)).toBeDefined();
        createReferenceSpy()
        expect(findByProps(container, 'requestToWebViewReload', true)).toBeDefined();
    })
    describe('#handleURLOpening', () => {
        const prepareShouldStartRequest = (url, handleURLOpeningMock) => {
            const { container } = Component({
                handleURLOpening: handleURLOpeningMock,
            });
            fireEvent(container.findByType(WebView), 'ShouldStartLoadWithRequest', {
                url,
            });

            return container;
        };
        it('Should able to start loading webview when url is weekly inspiration', () => {
            const handleURLOpeningMock = jest.fn().mockReturnValueOnce(true);
            prepareShouldStartRequest(
                'https://heartfulness.com',
                handleURLOpeningMock,
            );
            expect(handleURLOpeningMock).toBeCalledWith(
                'https://heartfulness.com',
            );
        });
        it('Should able to start loading webview when url is facebook', () => {
            const handleURLOpeningMock = jest.fn().mockReturnValueOnce(false);
            prepareShouldStartRequest(
                'https://www.facebook.com/',
                handleURLOpeningMock,
            );
            expect(handleURLOpeningMock).toBeCalledWith(
                'https://www.facebook.com/',
            );
        });
        it('Should able to start loading webview when url is twitter', () => {
            const handleURLOpeningMock = jest.fn().mockReturnValueOnce(false);
            prepareShouldStartRequest(
                'https://twitter.com',
                handleURLOpeningMock,
            );
            expect(handleURLOpeningMock).toBeCalledWith('https://twitter.com');
        });
    });
});
