import {
    PUSH_HISTORY_ITEM,
    POP_HISTORY_ITEM,
    CLEAR_ITEM_HISTORY,
    CLEAR_HISTORY
} from '../actions/types'

import {
HISTORY_ITEM_TYPE
} from '../config/Constants'

const initialList = {
    collectionDetail: []
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case CLEAR_HISTORY:
            return initialList;
        
        case PUSH_HISTORY_ITEM:
            return pushHistoryItem(previousState, action.payload);

        case POP_HISTORY_ITEM:
            return popHistoryItem(previousState, action.payload);

        case CLEAR_ITEM_HISTORY:
            return clearItemHistory(previousState, action.payload);

    }

    return previousState;
}

const pushHistoryItem = (previousState, item) => {
    switch(item.type){
        case HISTORY_ITEM_TYPE.COLLECTION_DETAIL:
        return {
            ...previousState,
            collectionDetail: previousState.collectionDetail.concat(item.payload)
        };
    }

    return previousState;
}

const popHistoryItem = (previousState, item) => {
    switch(item.type){
        case HISTORY_ITEM_TYPE.COLLECTION_DETAIL:
        return {
            ...previousState,
            collectionDetail: previousState.collectionDetail.splice(0, previousState.collectionDetail.length-1)
        };
    }

    return previousState;
}

const clearItemHistory = (previousState, item) => {
    switch(item.type){
        case HISTORY_ITEM_TYPE.COLLECTION_DETAIL:
        return {
            ...previousState,
            collectionDetail: []
        };
    }

    return previousState;
}