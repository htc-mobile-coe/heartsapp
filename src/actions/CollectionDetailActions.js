import { Actions } from  'react-native-router-flux';

import { ContentServiceClient } from '../services/ContentServiceClient';
import { SET_DOCUMENT_DETAIL_ID, SET_COLLECTION_DETAIL_ID, SET_COLLECTION_DETAIL } from './types';
import { HISTORY_ITEM_TYPE } from '../config/Constants';
import { handleBackPress } from '../config/BackActions';
import { addToHistory } from '../actions/AppActions';

export const load = (payload, actions) => {
    return (dispatch => {
        dispatchListLoadAction(actions, {
            ...payload
            , pageIndex: 0
        }, dispatch);
    });
}

export const loadMore = (payload, actions) => {
    return (dispatch) => {
        dispatchListLoadAction(actions, {
            ...payload
            , pageIndex: payload.pageIndex + 1
        }
        , dispatch);
    }
}

const dispatchListLoadAction = (actions, request, dispatch) => {
    dispatch({ type: actions.setListLoadingAction });

    ContentServiceClient.getCollectionDetail({message: JSON.stringify(request)
    }).then(resp => {
        const { pageIndex } = request;
        const responseObj = resp;
        const { loadAction } = actions;
        const payload = preparePayload(pageIndex, responseObj, request.collectionId);

        dispatch({ 
            type: loadAction,
            payload: payload
        });
    }).catch(e => {
        console.log('========= Error occurred while doing getCollectionDetail =========');
        console.log(e);
        dispatch({ type: actions.loadingFailed });
    });
}

const preparePayload = (pageIndex, responseObj, collectionId) => {
    const type = '';

    return {
        breadCrumbs: responseObj.breadCrumbs,
        displayObjects: responseObj.displayObjects,
        title: responseObj.title,
        documentType: responseObj.documentType,
        avatarLink: responseObj.avatarLink,
        accessibilityStatus: responseObj.accessibilityStatus,
        totalNoOfDisplayObjects: responseObj.totalNoOfDisplayObjects,
        collectionId: collectionId,
        pageIndex: pageIndex
    };
}

export const goBack = () => {
    return (dispatch, getState) => {
        handleBackPress(getState, dispatch);
    }
}

export const loadDocumentDetail = (resourceId, requiresSubscriptionToViewDetail, parentCollectionId, documentIndex) => {
    return (dispatch) => {
        if(!requiresSubscriptionToViewDetail){
            dispatch({
                type : SET_DOCUMENT_DETAIL_ID,
                payload: {
                    resourceId: resourceId,
                    parentCollectionId: parentCollectionId,
                    indexInParentCollection: documentIndex
                }
            });
    
            Actions.documentDetail();
        }
    }
}

export const loadCollectionDetail = (resourceId, requiresSubscriptionToViewDetail) => {
    return (dispatch, getState) => {
        if(!requiresSubscriptionToViewDetail){
            dispatch({
                type : SET_COLLECTION_DETAIL_ID,
                payload: resourceId
            });

            addToHistory(
                dispatch,
                HISTORY_ITEM_TYPE.COLLECTION_DETAIL,
                getState().collectionDetail
            );

            Actions.refresh({key: resourceId + new Date()})
        }
    }
}

export const setCollectinDetail = (payload) => {
    return (dispatch) => {
        dispatch({
            type : SET_COLLECTION_DETAIL,
            payload: payload
        });
    };
}