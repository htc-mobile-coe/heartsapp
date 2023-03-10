import React from 'react';
import WebViewScreen from './WebViewScreen';
import { render, fireEvent, find } from 'app/utils/TestUtils';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('WebViewScreen', () => {
    const webView = 'webViewScreen__webView';
    const Component = props => {
        return render(<WebViewScreen {...props} />);
    };
    it('Should have a web view component', () => {
        const { container } = Component();
        expect(find(container, webView)).toBeDefined();
    });

    it('Should fire BackPress event, when back button pressed', () => {
        const backButtonPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backButtonPressMock,
        });
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backButtonPressMock).toHaveBeenCalled();
    });
});