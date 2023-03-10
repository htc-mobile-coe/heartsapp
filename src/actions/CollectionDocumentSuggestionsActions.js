import {
    CHANGE_COLLECTION_DOCUMENTS_SEARCH_TEXT
} from './types'
import { handleBackPress } from '../config/BackActions';

export const changeCollectionDocumentSuggestionsSearchText = (text, loadSuggestions) => {
    return (dispatch, getState) => {
        dispatchChangeSearchText(text, dispatch);

        if(text && text.length >= 3){
            setTimeout(function(){
                if(text.length >= 3 && !hasSearchTextChanged(text, getState)) {
                    loadSuggestions();
                }
            }, 600);
        }
    }
}

const hasSearchTextChanged = (text , getState) => {
    return text !==  getState().collectionDocumentSuggetions.searchText;
}

const dispatchChangeSearchText = (text, dispatch) => {
    dispatch({
        type: CHANGE_COLLECTION_DOCUMENTS_SEARCH_TEXT,
        payload: text
    });
}

export const goBack = () => {
    return (dispatch, getState) => {
        handleBackPress(getState, dispatch);
    }
}