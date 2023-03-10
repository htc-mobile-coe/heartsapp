import {
    CHANGE_COLLECTION_DOCUMENTS_SEARCH_TEXT,
    SET_COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING,
    LOAD_COLLECTION_DOCUMENTS_SUGGESTIONS,
    COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING_FAILED
} from '../actions/types'

const initialList = {
    isModalVisible: false,
    searchText: '',
    totalNoOfItems: 0,
    pageIndex: 0,
    isLoading: false,
    items: []
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case CHANGE_COLLECTION_DOCUMENTS_SEARCH_TEXT:
            return ({
                ...previousState,
                searchText: action.payload
            });

        case SET_COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING:
            return ({
                ...previousState,
                isLoading: true,
            });

        case LOAD_COLLECTION_DOCUMENTS_SUGGESTIONS:
            return ({
                ...previousState,
                items: action.payload.items,
                isLoading: false,
            });

        case COLLECTION_DOCUMENTS_SUGGESTIONS_LOADING_FAILED:
            return ({
                ...previousState,
                isLoading: false,
            });
    }

    return previousState;
}