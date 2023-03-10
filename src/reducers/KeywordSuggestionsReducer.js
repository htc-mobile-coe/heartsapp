import {
    CHANGE_KEYWORD_SUGGESTIONS_SEARCH_TEXT,
    SET_KEYWORD_SUGGESTIONS_LOADING,
    LOAD_KEYWORD_SUGGESTIONS,
    KEYWORD_SUGGESTIONS_LOADING_FAILED
} from '../actions/types'

const initialList = {
    searchText: '',
    items: [],
    isLoading: false
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case CHANGE_KEYWORD_SUGGESTIONS_SEARCH_TEXT:
            return ({
                ...previousState,
                searchText: action.payload ? action.payload : ''
            });

        case SET_KEYWORD_SUGGESTIONS_LOADING:
            return ({
                ...previousState,
                isLoading: true,
            });

        case LOAD_KEYWORD_SUGGESTIONS:
            return ({
                ...previousState,
                items: action.payload,
                isLoading: false,
            });

        case KEYWORD_SUGGESTIONS_LOADING_FAILED:
            return ({
                ...previousState,
                isLoading: false,
            });
    }

    return previousState;
}