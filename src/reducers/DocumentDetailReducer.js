import {
    LOAD_DOCUMENT_DETAIL, 
    LOAD_MORE_DOCUMENT_DETAIL,
    DOCUMENT_DETAIL_LOADING_FAILED,
    SET_DOCUMENT_DETAIL_LOADING,
    SET_DOCUMENT_DETAIL_LOADING_MORE,
    SET_DOCUMENT_DETAIL_ID
} from '../actions/types'

const initialList = {
    documentId: '',
    pageIndex: 0,
    documentType: '',
    isLoading: false,
    isLoadingMore: false,
    breadCrumbs: [],
    displayObjects: [],
    title: '',
    avatarLink: '',
    accessibilityStatus: '',
    totalNoOfDisplayObjects: 1
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case LOAD_DOCUMENT_DETAIL:
            return loadItems(previousState, action);

        case LOAD_MORE_DOCUMENT_DETAIL:
            return loadMoreItems(previousState, action);

        case SET_DOCUMENT_DETAIL_LOADING:
            return {...previousState, isLoading: true};

        case SET_DOCUMENT_DETAIL_LOADING_MORE:
            return {...previousState, isLoadingMore: true};

        case DOCUMENT_DETAIL_LOADING_FAILED:
            return {...previousState, isLoading: false, isLoadingMore: false, };

        case SET_DOCUMENT_DETAIL_ID:
            return {
                ...initialList, 
                documentId: action.payload.resourceId,
                parentCollectionId: action.payload.parentCollectionId,
                indexInParentCollection: action.payload.indexInParentCollection
            };
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
        nextSibling: action.payload.nextSibling,
        previousSibling: action.payload.previousSibling
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
        nextSibling: action.payload.nextSibling,
        previousSibling: action.payload.previousSibling
    });
}