import { 
    CLOSE_NOT_SUBSCRIBED_MODAL,
} from './types'

import {ContentServiceClient} from '../services/ContentServiceClient';

export const closeNotSubscribedModal = () => {
    return (dispatch) => {
        dispatch({
            type: CLOSE_NOT_SUBSCRIBED_MODAL
        });
    }
}

export const launchSubscriptionList = () => {
    return (dispatch) => {
        dispatch({
            type: CLOSE_NOT_SUBSCRIBED_MODAL
        });

        ContentServiceClient.launchSubscriptionList();
    }
}