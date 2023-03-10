import {
    ADD_SEARCH_KEYWORDS,
    REMOVE_SEARCH_KEYWORDS,
    CLEAR_SEARCH_KEYWORDS
} from '../actions/types'

const initialList = {
    searchKeywords: []
}

export default (previousState = initialList, action) => {
    switch(action.type){
        case ADD_SEARCH_KEYWORDS:
            return { searchKeywords: previousState.searchKeywords.concat(action.payload) };

        case REMOVE_SEARCH_KEYWORDS:
            const { searchKeywords } = previousState;
            
            for(i = 0; i < action.payload.length; i++){
                var keyWordIndex = searchKeywords.indexOf(action.payload[i]);

                if(keyWordIndex >= 0){
                    searchKeywords.splice(keyWordIndex, 1);
                }
            }

            return {
                ...previousState,
                searchKeywords: searchKeywords
            };

        case CLEAR_SEARCH_KEYWORDS:
            return { searchKeywords: [] };
    }

    return previousState;
}