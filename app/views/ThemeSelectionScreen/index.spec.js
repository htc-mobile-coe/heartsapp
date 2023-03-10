import React from 'react';
import { render, fireEvent } from '../../utils/TestUtils';
import { ThemeSelectionScreenContainer } from './index';
import ThemeSelectionScreen from './ThemeSelectionScreen';
import { Scenes } from '../../shared/Constants';
import * as AnalyticsService from '../../services/firebase/AnalyticsService';
describe('ThemeSelectionScreen', () => {
    const Component = (props) => render(<ThemeSelectionScreenContainer
        images={{}}
        {...props}
        t={jest.fn()}
    />)
    const logEventMock = jest
        .spyOn(AnalyticsService, 'logEvent')
        .mockImplementation(() => { });

    afterEach(() => {
        logEventMock.mockClear();
    });
    it('Should handle onThemeChange event, when user changes theme', () => {
        const toggleThemeMock = jest.fn();
        const { container } = Component({
            toggleTheme: toggleThemeMock,
            mode: 'classic',
        });
        fireEvent(container.findByType(ThemeSelectionScreen), 'ThemeChange', 'peach');
        expect(logEventMock).toBeCalledWith(
            'profile_theme_peach',
            Scenes.themeSelectionScreen,
        );
    });
    it('Should not handle onThemeChange event, when user not change the theme', () => {
        const toggleThemeMock = jest.fn();
        const { container } = Component({
            toggleTheme: toggleThemeMock,
            mode: 'peach',
        });
        fireEvent(container.findByType(ThemeSelectionScreen), 'ThemeChange', 'peach');
        expect(logEventMock).not.toHaveBeenCalledWith(
            'profile_theme_peach',
            Scenes.themeSelectionScreen,
        );
    });
    it('Should fire press event, when back button is pressed', () => {
        const onBackPressMock = jest.fn();
        const { container } = Component({
            onBackPress: onBackPressMock,
        });
        fireEvent(container.findByType(ThemeSelectionScreen), 'onBackPress');
        expect(onBackPressMock).toBeDefined()
    });
});
