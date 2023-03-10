import React from 'react';
import { LocateScreenContainer, mapStateToProps } from './index';
import LocateScreen from './LocateScreen';
import { Actions } from 'react-native-router-flux';
import { Linking } from 'react-native';
import {
    getLocateScreenSource,
    getLocateTrainerErrorHTMLContent,
} from '../../services/firebase/RemoteConfigService';
import { render, fireEvent, spyOnProperty, findByProps } from '../../utils/TestUtils';
import * as Constants from '../../shared/Constants';

describe('LocateScreenContainer', () => {
    const goBackMock = jest.fn();
    const openURLMock = jest
        .spyOn(Linking, 'openURL')
        .mockImplementation(() => { });

    const Component = (props) => {
        return render(<LocateScreenContainer {...props} />);
    };
    const preparePlatform = isIOS => {
        spyOnProperty(Constants, 'IsIOS', isIOS);
        spyOnProperty(Constants, 'IsAndroid', !isIOS);
    };

    afterEach(() => {
        goBackMock.mockClear();
        openURLMock.mockClear();
    });

    it('By default should have LocateScreen component', () => {
        const { container } = Component();
        expect(container.findByType(LocateScreen)).toBeDefined();
    });
    it('Should update the value of canGoBack when user is able to navigate back to previous webpage', () => {
        const { container } = Component();
        fireEvent(container.findByType(LocateScreen), 'NavigationStateChange', { canGoBack: true });
        expect(findByProps(container.findByType(LocateScreen), 'canGoBack', true)).toBeDefined();
    });
    it('Should update the value of canGoBack when user is on main webpage and is not able to go back to previous webpage', () => {
        const { container } = Component();
        fireEvent(container.findByType(LocateScreen), 'NavigationStateChange', { canGoBack: false });
        expect(findByProps(container.findByType(LocateScreen), 'canGoBack', false)).toBeDefined();
    });
    it('Should navigate to previous webpage, when back button is pressed and canGoBack is true', () => {
        const { container } = Component();
        const webViewMock = {
            canGoBack: true,
            current: { goBack: goBackMock },
        };
        fireEvent(container.findByType(LocateScreen), 'NavigationStateChange', { canGoBack: true });
        fireEvent(container.findByType(LocateScreen), 'BackPress', webViewMock);
        expect(goBackMock).toBeCalled();
    });
    it('Should navigate to previous webpage, when back button is pressed and canGoBack is false', () => {
        const popMock = jest.spyOn(Actions, 'pop');
        const { container } = Component();
        const webViewMock = {
            canGoBack: false,
            current: { goBack: goBackMock },
        };
        fireEvent(container.findByType(LocateScreen), 'NavigationStateChange', { canGoBack: false });
        fireEvent(container.findByType(LocateScreen), 'BackPress', webViewMock);
        expect(popMock).toBeCalled();
    });
    it('Should able to open url when source is different from locateScreenSource on iOS', () => {
        preparePlatform(true);
        const url = 'https://heartfulness.com';
        const eventMock = {
            navigationType: 'click',
        };
        const { container } = Component();
        fireEvent(container.findByType(LocateScreen), 'handleURLOpening', url, eventMock);
        expect(openURLMock).toBeCalledWith(url);
    });
    it('Should able to open url when source is different from locateScreenSource on Android', () => {
        preparePlatform(false);
        const url = 'https://heartfulness.com';
        const eventMock = {
            navigationType: 'other',
        };
        const { container } = Component();
        fireEvent(container.findByType(LocateScreen), 'handleURLOpening', url, eventMock);
        expect(openURLMock).toBeCalledWith(url);
    });
    it('Should not open url when source is locateScreenSource on iOS', () => {
        preparePlatform(true);
        const url = getLocateScreenSource();
        const eventMock = {
            navigationType: 'click',
        };
        const { container } = Component({ isApplicationServerReachable: true });
        fireEvent(container.findByType(LocateScreen), 'handleURLOpening', url, eventMock);
        expect(openURLMock).not.toHaveBeenCalled();
    });
    it('Should not open url when source is locateScreenSource on Android', () => {
        preparePlatform(false);
        const url = getLocateScreenSource();
        const eventMock = {
            navigationType: 'other',
        };
        const { container } = Component({ isApplicationServerReachable: true });
        fireEvent(container.findByType(LocateScreen), 'handleURLOpening', url, eventMock);
        expect(findByProps(container.findByType(LocateScreen), 'handleURLOpening', url, eventMock)).toBeDefined();
        expect(openURLMock).not.toHaveBeenCalled();
    });
    it('Should able to load webview source as html error content', () => {
        const { container } = Component({ isApplicationServerReachable: false });
        expect(container.findByType(LocateScreen)).toHaveProp('uri', { html: getLocateTrainerErrorHTMLContent() })
    });
    it('should able to map state To Props from redux', async () => {
        const state = { deviceState: { isApplicationServerReachable: true } };
        expect(mapStateToProps(state)).toEqual({
            isApplicationServerReachable: true,
        });
    });
});