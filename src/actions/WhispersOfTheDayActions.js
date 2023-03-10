import { ContentServiceClient } from '../services/ContentServiceClient';
import { LOAD_WHISPERS_OF_THE_DAY, SET_NAV_BAR, WHISPERS_OF_THE_DAY_LOADING, WHISPERS_OF_THE_DAY_LOADING_FAILED } from './types';
import { handleBackPress } from '../config/BackActions';
import { NavBarType } from '../config/NavbarConstants';

export const load = () => {
    return (dispatch => {
        dispatch({type: WHISPERS_OF_THE_DAY_LOADING});
        ContentServiceClient.getWhispersOfTheDay({
            message: ''
        }).then(resp => {
            var currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            dispatch({
                type: LOAD_WHISPERS_OF_THE_DAY,
                payload: {
                    whisperItems: resp.whisperItems,
                    whisperRequestDate: currentDate
                }
            });
        }).catch(e => {
            console.log('========= Error occurred while doing getWhispersOfTheDay =========');
            console.log(e);
            dispatch({ type: WHISPERS_OF_THE_DAY_LOADING_FAILED });
        });
    });
}

export const setDocumentDetailNavbar = () => {
    return (dispatch) => {
        dispatch({
            type: SET_NAV_BAR,
            payload: NavBarType.DOCUMENT_DETAIL_NAVBAR
        });
    }
}

export const goBack = () => {
    return (dispatch, getState) => {
        handleBackPress(getState, dispatch);
    }
}