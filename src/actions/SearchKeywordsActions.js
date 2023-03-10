import { 
    ADD_SEARCH_KEYWORDS,
    REMOVE_SEARCH_KEYWORDS,
    CLEAR_SEARCH_KEYWORDS
} from './types';

export const addSearchKeyWords = (searchKeywords) => {
    return (dispatch) => {
        dispatch({
            type: ADD_SEARCH_KEYWORDS,
            payload: searchKeywords
        })   
    }
}

export const removeSearchKeyWords = (searchKeywords) => {
    return (dispatch) => {
        dispatch({
            type: REMOVE_SEARCH_KEYWORDS,
            payload: searchKeywords
        })   
    }
}

export const clearSearchKeyWords = (searchKeywords) => {
    return (dispatch) => {
        dispatch({
            type: CLEAR_SEARCH_KEYWORDS
        })   
    }
}