import { Actions } from  'react-native-router-flux';

import { ContentServiceClient } from '../services/ContentServiceClient';
import { SET_DOCUMENT_DETAIL_ID
    , SET_COLLECTION_DETAIL_ID
    , OPEN_NOT_SUBSCRIBED_MODAL
    , OPEN_LOADING_MODAL
    , CLOSE_LOADING_MODAL } from '../actions/types';

export const load = (payload, actions, shouldDispatchLoadAction) => {
    return (dispatch, getState) => {
        
        dispatchListLoadAction(actions, {
            ...payload
            , pageIndex: 0
            , queries: payload.queries ? payload.queries : []
            , filterSettings: getState().searchSettings.filterSettings
            , sortSetting: getState().searchSettings.sortSetting.settingValue
        }
        , dispatch
        , shouldDispatchLoadAction ? shouldDispatchLoadAction : yes);
    };
}

export const loadMore = (payload, actions) => {
    return (dispatch, getState) => {
        dispatchListLoadAction(actions, {
            ...payload
            , pageIndex: payload.pageIndex + 1
            , queries: payload.queries ? payload.queries : []
            , filterSettings: getState().searchSettings.filterSettings
            , sortSetting: getState().searchSettings.sortSetting.settingValue
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

    ContentServiceClient.doSearch({message: JSON.stringify(request)
    }).then(resp => {
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
        items: responseObj.results,
        totalNoOfItems: responseObj.totalNoOfResults,
        pageIndex: pageIndex
    };
}

export const loadDetail = (resourceId, requiresSubscriptionToViewDetail, documentType) => {
    return (dispatch) => {
        if(!requiresSubscriptionToViewDetail){
            switch(documentType){
                case 'BookCollectionDocument':
                case 'WhisperCollectionDocument':
                case 'BookDocument':
                case 'ChapterDocument':
                    dispatch({
                        type : SET_COLLECTION_DETAIL_ID,
                        payload: resourceId
                    });
                    Actions.collectionDetail();
                    break;

                case 'VideoDocument':
                    launchVideoPlayer(dispatch, resourceId);
                    break;

                case 'AudioDocument':
                    launchAudioPlayer(dispatch, resourceId);
                    break;

                case 'VideoCollectionDocument':
                    launchVideoCollectionDetail(dispatch, resourceId);
                    break;

                case 'AudioCollectionDocument':
                    launchAudioCollectionDetail(dispatch, resourceId);
                    break;

                default:
                    dispatch({
                        type : SET_DOCUMENT_DETAIL_ID,
                        payload: {
                            resourceId: resourceId
                        }
                    });
                    Actions.documentDetail();
                    break;
            }
        } else {
            dispatch({
                type : OPEN_NOT_SUBSCRIBED_MODAL
            });
        }
    }
}

const launchVideoPlayer = (dispatch, resourceId) => {
    dispatch({
        type: OPEN_LOADING_MODAL
    });

    ContentServiceClient.launchVideoPlayer({
        RESOURCE_ID: resourceId
    }).then(resp => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    }).catch(e => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    });
}

const launchAudioPlayer = (dispatch, resourceId) => {
    dispatch({
        type: OPEN_LOADING_MODAL
    });

    ContentServiceClient.launchAudioPlayer({
        RESOURCE_ID: resourceId
    }).then(resp => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    }).catch(e => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    });
}

const launchVideoCollectionDetail = (dispatch, resourceId) => {
    dispatch({
        type: OPEN_LOADING_MODAL
    });

    ContentServiceClient.launchVideoCollectionDetail({
        RESOURCE_ID: resourceId
    }).then(resp => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    }).catch(e => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    });
}

const launchAudioCollectionDetail = (dispatch, resourceId) => {
    dispatch({
        type: OPEN_LOADING_MODAL
    });

    ContentServiceClient.launchAudioCollectionDetail({
        RESOURCE_ID: resourceId
    }).then(resp => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    }).catch(e => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    });
}