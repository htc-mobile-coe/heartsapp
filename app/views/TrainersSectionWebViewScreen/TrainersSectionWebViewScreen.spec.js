import React from 'react';
import TrainersSectionWebViewScreen from './TrainersSectionWebViewScreen';
import { WebView } from 'react-native-webview';
import { render, fireEvent, find } from 'app/utils/TestUtils';

describe('TrainersSectionWebViewScreen', () => {
    const backButton = 'trainersSectionWebViewScreen__back--button';
    const Component = props => {
        return render(<TrainersSectionWebViewScreen {...props} t={jest.fn()} />);
    };

    it('Should have a back button component', () => {
        const { container } = Component();
        expect(find(container, backButton)).toBeDefined();
    });

    it('Should have a WebView component', () => {
        const { container } = Component();
        expect(container.findByType(WebView)).toBeDefined();
    });

    it('Should fire back press event', () => {
        const backPressMock = jest.fn();
        const { container } = Component({
            onBackPress: backPressMock,
        });
        fireEvent(find(container, backButton), 'Press');
        expect(backPressMock).toHaveBeenCalled();
    });

    it('Should handle onMessage event', () => {
        const onMessageMock = jest.fn();
        const { container } = Component({
            onMessage: onMessageMock,
        });
        fireEvent(container.findByType(WebView), 'Message');
        expect(onMessageMock).toHaveBeenCalled();
    });
});