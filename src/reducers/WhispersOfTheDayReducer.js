import {
    LOAD_WHISPERS_OF_THE_DAY, WHISPERS_OF_THE_DAY_LOADING, WHISPERS_OF_THE_DAY_LOADING_FAILED
} from '../actions/types'

const initialList = {
    whisperItems: [],
    whisperRequestDate: '',
    isLoading: false
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case LOAD_WHISPERS_OF_THE_DAY:
            return ({
                ...action.payload,
                isLoading: false
            });

        case WHISPERS_OF_THE_DAY_LOADING:
            return ({
                ...previousState,
                isLoading: true
            });

        case WHISPERS_OF_THE_DAY_LOADING_FAILED:
            return ({
                ...previousState,
                isLoading: false
            });
    }

    return previousState;
}