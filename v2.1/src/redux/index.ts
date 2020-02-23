import {applyMiddleware, compose, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';
import {initSaga} from "./init-sagas";
import {reducer} from "./reducer";

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([initSaga()]);
}

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, composeEnhancers(
    applyMiddleware(sagaMiddleware)
));
sagaMiddleware.run(rootSaga);

export default store;
