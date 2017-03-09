import './globals';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index';
import saksbehandler from './reducers/saksbehandler';
import { hentSaksbehandler } from './actions/saksbehandler_actions';
import HeaderContainer from './containers/HeaderContainer';
import './../styles/styles.less'

document.renderDecorator = function ({ toggles }) {
    const rootReducer = combineReducers({
        saksbehandler
    });

    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);

    toggles.visSaksbehandler && store.dispatch(hentSaksbehandler());

    render(<Provider store={store}><HeaderContainer config={config} /></Provider>, document.getElementById('header'));
};
