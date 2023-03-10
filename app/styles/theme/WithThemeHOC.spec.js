import React from 'react';
import { Text } from 'react-native';
import { shallow } from 'enzyme';
import ThemeService from 'app/services/ThemeService';
import { Theme, ThemeMode } from './ThemeSetup';
import Images from 'app/views/shared/Images';
import { findByProp } from '../../utils/TestUtils';

describe('WithThemeHOC', () => {
    const style = props => ({
        container: {
            flex: 2,
            backgroundColor: props.brandPrimary,
        },
    });

    const toggleThemeChangeMock = jest.fn();
    const mockUseContext = jest.fn(() => {
        return { theme: Theme.classic };
    });

    jest.mock('react', () => {
        const ActualReact = jest.requireActual('react');
        return {
            ...ActualReact,
            useContext: mockUseContext,
        };
    });

    jest.doMock('./ThemeContext', () => ({
        ThemeContext: {
            Consumer: props =>
                props.children(
                    ThemeService.getSelectedTheme(ThemeMode.classic),
                ),
        },
        ThemeToggleContext: {
            Consumer: props => props.children(toggleThemeChangeMock),
        },
    }));

    const moduleName = require('./ThemeContext');

    const { withTheme, useTheme } = jest.requireActual('./WithThemeHOC');

    const MockTextComponent = props => {
        return <Text {...props} />;
    };
    const Component = (styles = style, images) => {
        const ThemeComponent = withTheme(MockTextComponent, styles, images);
        return shallow(<ThemeComponent />)
            .shallow()
            .shallow();
    };
    const ComponentHooks = () => {
        const theme = useTheme();
        return shallow(<MockTextComponent theme={theme} />).shallow();
    };

    it('should return mock function consumer', () => {
        expect(moduleName).toHaveProperty('ThemeContext');
        expect(moduleName).toHaveProperty('ThemeToggleContext');
    });

    it('should render child Component', () => {
        const component = Component();
        expect(component.find(MockTextComponent)).toBeDefined();
    });

    it('should called mock useContext with Hooks', () => {
        const component = ComponentHooks();
        expect(component.props().theme).toBeDefined();
        expect(mockUseContext).toHaveBeenCalled();
    });

    it('should call toggle theme', () => {
        const component = Component();
        component
            .find(MockTextComponent)
            .props()
            .toggleTheme();
        expect(toggleThemeChangeMock).toHaveBeenCalled();
    });

    it('should render without style & images', () => {
        const component = Component(undefined, undefined);
        expect(component.find(MockTextComponent)).toBeDefined();
    });

    it('should render with image', () => {
        const component = Component(null, Images);
        expect(
            findByProp(component, MockTextComponent).props().images.watchIcon,
        ).toEqual(Images(ThemeMode.classic).watchIcon);
    });

    it('should be default theme classic', async () => {
        const component = Component(null, Images);
        expect(findByProp(component, MockTextComponent).props().mode).toEqual(
            ThemeMode.classic,
        );
    });
});
