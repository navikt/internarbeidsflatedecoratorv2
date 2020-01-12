import {Action} from "redux";
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';

function reducer(state = 0, action: Action) {
    switch (action.type) {
        case 'INCREMENT':
            return state + 1;
        case 'INCREMENT_IF_ODD':
            return (state % 2 !== 0) ? state + 1 : state;
        case 'DECREMENT':
            return state - 1;
        default:
            return state
    }
}

function* helloSaga(): IterableIterator<any> {
    console.log('hello from saga');
}

const sagaMiddleware = createSagaMiddleware();


const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(helloSaga);

export function action(type: string) {
    store.dispatch({ type });
}

export default store;