import { BackHandler } from 'react-native';

import { 
    EXIT_APP,
    PUSH_HISTORY_ITEM,
    POP_HISTORY_ITEM
} from './types';

export const exitApp = () => {
    BackHandler.exitApp();
}

export const dispatchAppAction = (action, dispatch) => {
    switch(action.type){
        case EXIT_APP:
            BackHandler.exitApp();
            break;

        default:
            if(dispatch){
                dispatch(action);
            }
    }
}

export const addToHistory = (dispatch, itemType, payload) => {
    dispatch({
        type: PUSH_HISTORY_ITEM,
        payload: {
            type: itemType,
            payload: payload
        }
    });
}

export const popItemFromHistory = (dispatch, itemType) => {
    dispatch({
        type: POP_HISTORY_ITEM,
        payload: {
            type: itemType
        }
    });
}