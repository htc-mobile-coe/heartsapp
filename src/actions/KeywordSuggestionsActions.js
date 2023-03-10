import { 
    CHANGE_KEYWORD_SUGGESTIONS_SEARCH_TEXT,
    LOAD_KEYWORD_SUGGESTIONS,
    SET_KEYWORD_SUGGESTIONS_LOADING,
} from './types'

import {ContentServiceClient} from '../services/ContentServiceClient';
import { handleBackPress } from '../config/BackActions';

export const changeKeywordSuggestionsSearchText = (text) => {
    return (dispatch, getState) => {
        dispatchChangeSearchText(text, dispatch);

        if(text && text.length >= 3){
            setTimeout(function(){
                if(text.length >= 3 && !hasSearchTextChanged(text, getState)) {
                    loadSuggestions(text, dispatch);
                }
            }, 600);
        }
    }
}

export const loadSuggestions = (searchText, dispatch) => {
    dispatch({ type: SET_KEYWORD_SUGGESTIONS_LOADING });

    ContentServiceClient.getSuggestions({message: searchText
    }).then(resp => {
        dispatch({
            type: LOAD_KEYWORD_SUGGESTIONS,
            payload: resp.suggestions 
        });
    }).catch(e => {
        console.log('========= Error occurred while doing loadSuggestions =========');
        console.log(e);
        dispatch({ type: actions.loadingFailed });
    });
}

const hasSearchTextChanged = (text , getState) => {
    return text !==  getState().keywordSuggestions.searchText;
}

const dispatchChangeSearchText = (text, dispatch) => {
    dispatch({
        type: CHANGE_KEYWORD_SUGGESTIONS_SEARCH_TEXT,
        payload: text
    });
}

export const goBack = () => {
    return (dispatch, getState) => {
        handleBackPress(getState, dispatch);
    }
}