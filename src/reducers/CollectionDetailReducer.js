import {
    LOAD_COLLECTION_DETAIL, 
    LOAD_MORE_COLLECTION_DETAIL,
    COLLECTION_DETAIL_LOADING_FAILED,
    SET_COLLECTION_DETAIL_LOADING,
    SET_COLLECTION_DETAIL_LOADING_MORE,
    SET_COLLECTION_DETAIL_ID,
    SET_COLLECTION_DETAIL
} from '../actions/types'

const initialList = {
    collectionId: '',
    pageIndex: 0,
    documentType: '',
    isLoading: false,
    isLoadingMore: false,
    breadCrumbs: [],
    displayObjects: [],
    title: '',
    avatarLink: '',
    accessibilityStatus: '',
    totalNoOfDisplayObjects: 1,
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case LOAD_COLLECTION_DETAIL:
            return loadItems(previousState, action);

        case LOAD_MORE_COLLECTION_DETAIL:
            return loadMoreItems(previousState, action);

        case SET_COLLECTION_DETAIL_LOADING:
            return {...previousState, isLoading: true};

        case SET_COLLECTION_DETAIL_LOADING_MORE:
            return {...previousState, isLoadingMore: true};

        case COLLECTION_DETAIL_LOADING_FAILED:
            return {...previousState, isLoading: false, isLoadingMore: false, };

        case SET_COLLECTION_DETAIL_ID:
            return {...previousState, collectionId: action.payload };

        case SET_COLLECTION_DETAIL:
            return action.payload
    }

    return previousState;
}

const loadData = (previousState, action) => {
    return {
        ...previousState,
        breadCrumbs: action.payload.breadCrumbs,
        title: action.payload.title,
        documentType: action.payload.documentType,
        avatarLink: action.payload.avatarLink,
        accessibilityStatus: action.payload.accessibilityStatus,
        totalNoOfDisplayObjects: action.payload.totalNoOfDisplayObjects
    }
}

const loadItems = (previousState, action) => {
    const data = loadData(previousState, action);
    
    return {
        ...data,
        displayObjects: action.payload.displayObjects,
        pageIndex: 0,
        isLoading: false, 
        isLoadingMore: false,
    };
}

const loadMoreItems = (previousState, action) => {
    const items = [...previousState.displayObjects];
    items.push(...action.payload.displayObjects);

    return ({
        ...previousState,
        displayObjects: items,
        pageIndex: action.payload.pageIndex,
        isLoading: false, 
        isLoadingMore: false,
    });
}