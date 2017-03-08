import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index';
import testreducer from './reducers/saksbehandler';
import { hentSaksbehandler } from './actions/saksbehandler_actions';

import HeaderContainer from './containers/HeaderContainer';

const rootReducer = combineReducers({
    testreducer
});

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer,
    applyMiddleware(sagaMiddleware)
);

sagaMiddleware.run(rootSaga);

store.dispatch(hentSaksbehandler());

document.renderDecorator = function (toggles) {
    render(<Provider store={store}><HeaderContainer toggles={toggles} /></Provider>, document.getElementById('header'));
};
