import {
    LOAD_SEARCH_RESULTS, 
    LOAD_MORE_SEARCH_RESULTS,
    SEARCH_RESULT_LIST_LOADING_FAILED,
    SET_SEARCH_RESULTS_LIST_LOADING,
    SET_SEARCH_RESULTS_LIST_LOADING_MORE
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
        case LOAD_SEARCH_RESULTS:
            return loadListItems(previousState, action);

        case LOAD_MORE_SEARCH_RESULTS:
            return loadMoreListItems(previousState, action);

        case SET_SEARCH_RESULTS_LIST_LOADING:
            return {...previousState, isLoading: true};

        case SET_SEARCH_RESULTS_LIST_LOADING_MORE:
            return {...previousState, isLoadingMore: true};

        case SEARCH_RESULT_LIST_LOADING_FAILED:
            return {...previousState, isLoading: false, isLoadingMore: false, };
    }

    return previousState;
}