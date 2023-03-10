import {
    SET_ENTRY_POINT
} from '../actions/types'

const initialList = {
    entryPoint: ''
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case SET_ENTRY_POINT:
            return ({
                entryPoint: action.payload
            });
    }

    return previousState;
}