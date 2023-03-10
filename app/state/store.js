import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import { reducer as formReducer } from 'redux-form';
import * as reducers from './ducks';

// const logger = createLogger();

export default () => {
    return createStore(
        combineReducers({
            ...reducers,
            form: formReducer,
        }),
        applyMiddleware(thunk),
    );
};
