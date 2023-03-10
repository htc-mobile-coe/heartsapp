import {
    OPEN_NOT_SUBSCRIBED_MODAL,
    CLOSE_NOT_SUBSCRIBED_MODAL
} from '../actions/types'

const initialList = {
    isModalVisible: false
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case OPEN_NOT_SUBSCRIBED_MODAL:
            return ({
                isModalVisible: true
            });

        case CLOSE_NOT_SUBSCRIBED_MODAL:
            return ({
                isModalVisible: false
            });
    }

    return previousState;
}