import { 
    OPEN_THEME_SETTINGS_MODAL,
    CLOSE_THEME_SETTINGS_MODAL,
    SET_FONT_THEME,
    SET_COLOR_THEME,
    SET_SIZE_THEME
} from './types'

export const openThemeSettingsPopup = () => {
    return (dispatch) => {
        dispatch({
            type: OPEN_THEME_SETTINGS_MODAL
        });
    }
}

export const closeThemeSettingsPopup = () => {
    return (dispatch) => {
        dispatch({
            type: CLOSE_THEME_SETTINGS_MODAL
        });
    }
}

export const setFontTheme = (themeName) => {
    return (dispatch) => {
        dispatch({
            type: SET_FONT_THEME,
            payload: themeName
        });
    }
}

export const setColorTheme = (themeName) => {
    return (dispatch) => {
        dispatch({
            type: SET_COLOR_THEME,
            payload: themeName
        });
    }
}

export const setSizeTheme = (themeName) => {
    return (dispatch) => {
        dispatch({
            type: SET_SIZE_THEME,
            payload: themeName
        });
    }
}