import { 
    SET_ENTRY_POINT,
} from './types'


export const setEntryPoint = (entryPoint) => {
    return {
        type: SET_ENTRY_POINT,
        payload: entryPoint
    }
}