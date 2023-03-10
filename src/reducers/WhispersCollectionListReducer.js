import {
    LOAD_WHISPERS_COLLECTIONS, 
    LOAD_MORE_WHISPERS_COLLECTIONS,
    WHISPERS_COLLECTIONS_LIST_LOADING_FAILED,
    SET_WHISPERS_COLLECTIONS_LIST_LOADING,
    SET_WHISPERS_COLLECTIONS_LIST_LOADING_MORE
} from '../actions/types'

import {
    loadListItems, loadMoreListItems
} from './Utils'

const initialList = {
    totalNoOfItems: 0,
    pageIndex: 0,
    isLoading: false,
    isLoadingMore: false,
    items: []
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case LOAD_WHISPERS_COLLECTIONS:
            return loadListItems(previousState, action);

        case LOAD_MORE_WHISPERS_COLLECTIONS:
            return loadMoreListItems(previousState, action);

        case SET_WHISPERS_COLLECTIONS_LIST_LOADING:
            return {...previousState, isLoading: true};

        case SET_WHISPERS_COLLECTIONS_LIST_LOADING_MORE:
            return {...previousState, isLoadingMore: true};

        case WHISPERS_COLLECTIONS_LIST_LOADING_FAILED:
            return {...previousState, isLoading: false, isLoadingMore: false, };
    }

    return previousState;
}