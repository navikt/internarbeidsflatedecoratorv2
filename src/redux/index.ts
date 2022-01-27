import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import { initSaga } from './init-sagas';
import { reducer, State as AppdataState } from './reducer';
import feilReducer, { Feilmeldinger } from './feilmeldinger/reducer';

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([initSaga()]);
}

export interface State {
    appdata: AppdataState;
    feilmeldinger: Feilmeldinger;
}
const rootReducer = combineReducers({
    appdata: reducer,
    feilmeldinger: feilReducer
});

const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);

export default store;
