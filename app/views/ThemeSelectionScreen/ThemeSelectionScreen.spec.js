import React from 'react';
import { TouchableOpacity } from 'react-native';
import { ImageBackground } from 'react-native';
import { render, fireEvent, find } from '../../utils/TestUtils';
import { MediumBoldText, Text } from '../shared';
import ThemeSelectionScreen from './ThemeSelectionScreen';
import Radio from '../shared/Radio';

describe('PersonalInfoForm', () => {
    const peachTheme = 'themeSelectionScreen:peachTheme-update';
    const classicTheme = 'themeSelectionScreen:classicTheme-update';
    const Component = (props) => render(<ThemeSelectionScreen {...props}
    />)

    it('By default should render properly', () => {
        const { container } = Component({});
        expect(container).toBeDefined();
    });
    it('Should have 1 TouchableOpacity component for theme selection', () => {
        const { container } = Component({});
        expect(container.findAllByType(TouchableOpacity)).toBeDefined();
    });
    it('Should have 1 ImageBackground component for displaying theme image', () => {
        const { container } = Component({});
        expect(container.findAllByType(ImageBackground)).toBeDefined();
    });
    it('Should have 1 MediumBoldText component for displaying theme title', () => {
        const { container } = Component({});
        expect(container.findAllByType(MediumBoldText)).toBeDefined();
    });
    it('Should have 1 Text component for displaying theme sub title', () => {
        const { container } = Component({});
        expect(container.findAllByType(Text)).toBeDefined();
    });
    it('Should have 1 Radio component for selecting theme', () => {
        const { container } = Component({});
        expect(container.findAllByType(Radio)).toBeDefined();
    });
    it('Should fire peachThemeSelection event, when item button is pressed ', () => {
        const peachThemeSelectionMock = jest.fn();
        const { container } = Component({ onThemeChange: peachThemeSelectionMock });
        fireEvent(find(container, peachTheme), 'Press');
        expect(peachThemeSelectionMock).toHaveBeenCalled();
    });
    it('Should fire classicThemeSelection event, when item button is pressed ', () => {
        const classicThemeSelectionMock = jest.fn();
        const { container } = Component({ onThemeChange: classicThemeSelectionMock });
        fireEvent(find(container, classicTheme), 'Press');
        expect(classicThemeSelectionMock).toHaveBeenCalled();
    });
});