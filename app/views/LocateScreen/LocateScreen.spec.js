import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import LocateScreen from './LocateScreen';
import { WebView } from 'react-native-webview';
import OptionsScreenHeader from '../shared/OptionsScreenHeader';

describe('LocateScreen', () => {

    const Component = (props) => {
        return render(<LocateScreen {...props} t={jest.fn()} />);
    };

    it('Should have a OptionsScreenHeader component', () => {
        const { container } = Component();
        expect(container.findByType(OptionsScreenHeader)).toBeDefined();
    });

    it('Should have a WebView component', () => {
        const { container } = Component();
        expect(container.findByType(WebView)).toBeDefined();
    });

    it('Should handle onBackPress event, when back button is pressed', () => {
        const backPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backPressMock,
        });
        fireEvent(container.findByType(OptionsScreenHeader), 'BackPress');
        expect(backPressMock).toHaveBeenCalled();
    });

    it('Should able load external url', () => {
        const handleURLOpeningMock = jest.fn().mockReturnValueOnce(true);
        const eventMock = {
            url: 'https://heartfulness.com',
        };
        const { container } = Component({
            handleURLOpening: handleURLOpeningMock,
        });
        fireEvent(container.findByType(WebView), 'ShouldStartLoadWithRequest', eventMock);
        expect(handleURLOpeningMock).toBeCalledWith(
            'https://heartfulness.com',
            eventMock,
        );
    });
});