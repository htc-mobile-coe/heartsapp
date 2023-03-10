import {
    OPEN_THEME_SETTINGS_MODAL,
    CLOSE_THEME_SETTINGS_MODAL,
    SET_COLOR_THEME,
    SET_FONT_STYLE_THEME,
    SET_FONT_SIZE_THEME
} from '../actions/types'

import {
    LIGHT_COLOR_THEME,
    MEDIUM_SIZE_THEME,
    NUNITO_FONT_THEME,
} from '../config/ThemeConstants';

const initialList = {
    isModalVisible: false,
    font: LIGHT_COLOR_THEME,
    size: MEDIUM_SIZE_THEME,
    color: LIGHT_COLOR_THEME
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case OPEN_THEME_SETTINGS_MODAL:
            return {...previousState, isModalVisible: true};

        case CLOSE_THEME_SETTINGS_MODAL:
            return {...previousState, isModalVisible: false};

        case SET_COLOR_THEME:
            return {...previousState, font: action.payload.color};

        case SET_FONT_STYLE_THEME:
            return {...previousState, font: action.payload.font};

        case SET_FONT_SIZE_THEME:
            return {...previousState, font: action.payload.size};
    }

    return previousState;
}