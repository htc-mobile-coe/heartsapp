export const loadListItems = (previousState, action) => {
    return {
        ...previousState, 
        items: action.payload.items, 
        totalNoOfItems: action.payload.totalNoOfItems,
        pageIndex: 0,
        isLoading: false, 
        isLoadingMore: false,
     };
}

export const loadMoreListItems = (previousState, action) => {
    return ({
        ...previousState, 
        items: previousState.items.concat(action.payload.items), 
        totalNoOfItems: action.payload.totalNoOfItems,
        pageIndex: action.payload.pageIndex,
        isLoading: false, 
        isLoadingMore: false
    });
}