import { 
    OPEN_LOADING_MODAL,
    CLOSE_LOADING_MODAL
} from './types'

export const closeLoadingModal = () => {
    return (dispatch) => {
        dispatch({
            type: CLOSE_LOADING_MODAL
        });
    }
}

export const openLoadingModal = () => {
    return (dispatch) => {
        dispatch({
            type: OPEN_LOADING_MODAL
        });
    }
}