import { Actions } from 'react-native-router-flux';

import { 
    TOGGLE_SETTING,
    RESET_SORT_AND_FILTER_SETTINGS
} from './types'

export const toggleSearchSetting = (payload) => {
    return (dispatch) => {
        dispatch({
            type: TOGGLE_SETTING,
            payload: payload
        });
    }
}

export const resetSearchSettings = () => {
    return (dispatch) => {
        dispatch({
            type: RESET_SORT_AND_FILTER_SETTINGS
        });
        Actions.drawerClose();
        Actions.refresh({key: new Date()});
    }
}

export const applyFilters = () => {
    return (dispatch) => {
        Actions.drawerClose();
        Actions.refresh({key: new Date()});
    }
}