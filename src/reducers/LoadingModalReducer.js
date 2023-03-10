import {
    OPEN_LOADING_MODAL,
    CLOSE_LOADING_MODAL
} from '../actions/types'

const initialList = {
    isModalVisible: false
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case OPEN_LOADING_MODAL:
            return ({
                isModalVisible: true
            });

        case CLOSE_LOADING_MODAL:
            return ({
                isModalVisible: false
            });
    }

    return previousState;
}