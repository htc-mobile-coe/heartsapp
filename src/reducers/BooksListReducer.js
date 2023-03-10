import {
    LOAD_BOOKS, 
    LOAD_MORE_BOOKS,
    BOOKS_LIST_LOADING_FAILED,
    SET_BOOKS_LIST_LOADING,
    SET_BOOKS_LIST_LOADING_MORE
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
        case LOAD_BOOKS:
            return loadListItems(previousState, action);

        case LOAD_MORE_BOOKS:
            return loadMoreListItems(previousState, action);

        case SET_BOOKS_LIST_LOADING:
            return {...previousState, isLoading: true};

        case SET_BOOKS_LIST_LOADING_MORE:
            return {...previousState, isLoadingMore: true};

        case BOOKS_LIST_LOADING_FAILED:
            return {...previousState, isLoading: false, isLoadingMore: false, };
    }

    return previousState;
}