import {
    TOGGLE_SETTING,
    RESET_SORT_AND_FILTER_SETTINGS
} from '../actions/types'

import { SETTING_TYPE, SEARCH_SETTINGS } from '../config/Constants'

const initialList = {
    sortSetting: SEARCH_SETTINGS.SORT_BY_RELEVANCE,
    filterSettings: []
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case TOGGLE_SETTING:
            return toggleSetting(previousState, action.payload);

        case RESET_SORT_AND_FILTER_SETTINGS:
            return initialList;
    }

    return previousState;
}

const toggleSetting = (previousState, payload) => {
    switch(payload.settingType){
        case SETTING_TYPE.SORTING:
            return {
                ...previousState,
                sortSetting: payload
            }

        case SETTING_TYPE.FILTER:
            return toggleFilter(previousState, payload);
    }
}

const toggleFilter = (previousState, payload) => {
    const newState = {
        ...previousState
    };

    const index = previousState.filterSettings.indexOf(payload);

    if(index >= 0){
        
        return {
            ...previousState,
            filterSettings: previousState.filterSettings.filter(e => e !== payload)
        }
    }

    return {
        ...previousState,
        filterSettings: previousState.filterSettings.concat(payload)
    }
}