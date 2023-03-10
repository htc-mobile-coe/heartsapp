import React from 'react';
import { NativeBaseProvider, extendTheme } from 'native-base';
import { render } from '@testing-library/react-native';
import ThemeService from 'app/services/ThemeService';
import { ThemeMode } from 'app/styles/theme/ThemeSetup';
import { Provider } from 'react-redux';
import { store } from 'app/state';

const inset = {
    frame: { x: 0, y: 0, width: 0, height: 0 },
    insets: { top: 0, left: 0, right: 0, bottom: 0 },
};
const theme = ThemeService.getSelectedTheme(ThemeMode.peach);

const ThemeProvider = ({ children }) => {
    return (
        <Provider store={store}>
            <NativeBaseProvider
                initialWindowMetrics={inset}
                theme={extendTheme(theme)}>
                {children}
            </NativeBaseProvider>
        </Provider>
    );
};

const renderComponent = (ui, options) =>
    render(ui, { wrapper: ThemeProvider, ...options });

export * from '@testing-library/react-native';
export { renderComponent as render };

export const find = (component, testID) => {
    return component.findByProps({ testID });
};

export const findByProp = (component, key, value) => {
    return component.findWhere(n => n.prop(key) === value);
};

export const findByProps = (component, key, value) => {
    return component.findByProps((n) => n.prop(key) === value);
};

export const spyOnProperty = (object, property, value) => {
    Object.defineProperty(object, property, {
        get() {
            return value;
        },
    });
};

export const runAllPromises = () => new Promise(setImmediate);
