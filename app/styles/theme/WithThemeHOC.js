import React, { useContext } from 'react';
import { isNil } from 'lodash';
import { ThemeContext, ThemeToggleContext } from './ThemeContext';

export const withTheme = (WrapperComponent, getStyles, getImages) => {
    return props => {
        const emptyCallback = () => {};
        const loadImages = isNil(getImages) ? emptyCallback : getImages;
        const loadStyle = isNil(getStyles) ? emptyCallback : getStyles;
        return (
            <ThemeContext.Consumer>
                {({ theme, mode }) => (
                    <ThemeToggleContext.Consumer>
                        {toggleTheme => (
                            <WrapperComponent
                                {...props}
                                toggleTheme={toggleTheme}
                                mode={mode}
                                theme={theme}
                                styles={loadStyle(theme)}
                                images={loadImages(mode)}
                            />
                        )}
                    </ThemeToggleContext.Consumer>
                )}
            </ThemeContext.Consumer>
        );
    };
};

export const useTheme = () => {
    const store = useContext(ThemeContext);
    return store.theme;
};
