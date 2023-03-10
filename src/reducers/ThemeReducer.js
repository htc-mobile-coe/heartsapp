import {
    SET_COLOR_THEME,
    SET_FONT_THEME,
    SET_SIZE_THEME
} from '../actions/types';

import {
    LIGHT_COLOR_THEME,
    MEDIUM_SIZE_THEME,
    NUNITO_FONT_THEME,
    DARK_COLOR_THEME,
    LARGE_SIZE_THEME,
    SMALL_SIZE_THEME,
} from '../config/ThemeConstants';

import NunitoFont from '../config/theme/fontfamily/NunitoFont';
import MediumSize from '../config/theme/typographysize/MediumSize';
import Light from '../config/theme/colors/Light';
import Dark from '../config/theme/colors/Dark';
import LargeSize from '../config/theme/typographysize/LargeSize';
import SmallSize from '../config/theme/typographysize/SmallSize';

const initialList = {
    ...NunitoFont,
    ...MediumSize,
    ...Light
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case SET_COLOR_THEME:
            return colorTheme(previousState, action.payload);

        case SET_SIZE_THEME:
            return sizeTheme(previousState, action.payload);

        case SET_FONT_THEME:
            return fontTheme(previousState, action.payload);
    }

    return previousState;
}

const colorTheme = (previousState, color) => {
    switch(color){
        case LIGHT_COLOR_THEME:
            return {...previousState, ...Light };

        case DARK_COLOR_THEME:
            return {...previousState, ...Dark };
    }

    return previousState;
}

const sizeTheme = (previousState, size) => {
    switch(size){
        case MEDIUM_SIZE_THEME:
            return {...previousState, ...MediumSize };

        case LARGE_SIZE_THEME:
            return {...previousState, ...LargeSize };

        case SMALL_SIZE_THEME:
            return {...previousState, ...SmallSize };
    }

    return previousState;
}

const fontTheme = (previousState, font) => {
    switch(color){
        case NUNITO_FONT_THEME:
            return {...previousState, ...NunitoFont };
    }

    return previousState;
}