import { ContentServiceClient } from '../services/ContentServiceClient';
import { NavBarType } from '../config/NavbarConstants';
import { SET_NAV_BAR, SET_DOCUMENT_DETAIL_ID, SET_COLLECTION_DETAIL_ID } from '../actions/types';
import { Actions } from 'react-native-router-flux';
import { handleBackPress } from '../config/BackActions';

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

    ContentServiceClient.getSearchResultDetail({message: JSON.stringify(request)
    }).then(resp => {
        const { pageIndex } = request;
        const responseObj = resp;
        const { loadAction } = actions;
        const payload = preparePayload(pageIndex, responseObj);

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

const preparePayload = (pageIndex, responseObj) => {
    const type = '';

    return {
        breadCrumbs: responseObj.breadCrumbs,
        displayObjects: responseObj.displayObjects,
        title: responseObj.title,
        documentType: responseObj.documentType,
        avatarLink: responseObj.avatarLink,
        accessibilityStatus: responseObj.accessibilityStatus,
        totalNoOfDisplayObjects: responseObj.totalNoOfDisplayObjects,
        pageIndex: pageIndex,
        nextSibling: responseObj.nextSibling,
        previousSibling: responseObj.previousSibling
    };
}

export const goBack = () => {
    return (dispatch, getState) => {
        handleBackPress(getState, dispatch);
    }
}

export const setDocumentDetailNavbar = () => {
    return (dispatch) => {
        dispatch({
            type: SET_NAV_BAR,
            payload: NavBarType.DOCUMENT_DETAIL_NAVBAR
        });
    }
}

export const setDocumentDetail = (resourceId, parentCollectionId, documentIndex) => {
    return (dispatch) => {
        dispatch({
            type : SET_DOCUMENT_DETAIL_ID,
            payload: {
                resourceId: resourceId,
                parentCollectionId: parentCollectionId,
                indexInParentCollection: documentIndex
            }
        });

        Actions.refresh({key: resourceId})
    }
}

export const loadCollectionDetail = (resourceId) => {
    return (dispatch, getState) => {
        dispatch({
            type : SET_COLLECTION_DETAIL_ID,
            payload: resourceId
        });

        Actions.collectionDetail();
    }
}