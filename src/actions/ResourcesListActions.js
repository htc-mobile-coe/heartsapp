import { Actions } from  'react-native-router-flux';

import { ContentServiceClient } from '../services/ContentServiceClient';
import { SET_COLLECTION_DETAIL_ID, GO_BACK, OPEN_NOT_SUBSCRIBED_MODAL, OPEN_LOADING_MODAL, CLOSE_LOADING_MODAL } from '../actions/types';

export const load = (payload, actions, shouldDispatchLoadAction) => {
    return (dispatch) => {
        dispatchListLoadAction(actions, {
            ...payload
            , pageIndex: 0
            , query: payload.query ? payload.query : ''
        }
        , dispatch
        , shouldDispatchLoadAction ? shouldDispatchLoadAction : yes);
    };
}

export const loadMore = (payload, actions) => {
    return (dispatch) => {
        dispatchListLoadAction(actions, {
            ...payload
            , pageIndex: payload.pageIndex + 1
            , query: payload.query ? payload.query : ''
        }
        , dispatch
        , yes);
    }
}

const yes = (req, resp) => {
    return true;
}

const dispatchListLoadAction = (actions, request, dispatch, shouldDispatchLoadAction) => {
    dispatch({ type: actions.setListLoadingAction });
    //dispatch({ type: OPEN_LOADING_MODAL });

    ContentServiceClient.getResourcesList({message: JSON.stringify(request)
    }).then(resp => {
        const { pageIndex } = request;
        const responseObj = resp;
        const requestObj = request;
        const { loadAction } = actions;
        
        doListLoadActionDispatch({
            shouldDispatchLoadAction,
            dispatch,
            requestObj,
            responseObj,
            loadAction
        });

        dispatch({ type: CLOSE_LOADING_MODAL });
    }).catch(e => {
        console.log('========= Error occurred while doing getResourcesList =========');
        console.log(e);
        dispatch({ type: actions.loadingFailed });
    });
}

const doListLoadActionDispatch = (params) => {
    const {
        shouldDispatchLoadAction, 
        dispatch, 
        requestObj: request, 
        responseObj: response, 
        loadAction
    } = params;

    if(shouldDispatchLoadAction(request, response)){
        const payload = preparePayload(request.pageIndex, response);

        dispatch({ 
            type: loadAction,
            payload: payload
        });
    }
}

const preparePayload = (pageIndex, responseObj) =>{
    return {
        items: responseObj.listItems,
        totalNoOfItems: responseObj.totalNoOfItems,
        pageIndex: pageIndex
    };
}

export const loadDetail = (resourceId, requiresSubscriptionToViewDetail) => {
    return (dispatch) => {
        if(!requiresSubscriptionToViewDetail){
            dispatch({
                type : SET_COLLECTION_DETAIL_ID,
                payload: resourceId
            });
    
            Actions.collectionDetail();
        } else {
            dispatch({
                type : OPEN_NOT_SUBSCRIBED_MODAL
            });
        }
    }
}