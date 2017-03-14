import './globals';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index';
import saksbehandler from './reducers/saksbehandler';
import enheter from './reducers/enheter';
import meny from './reducers/meny';
import { hentSaksbehandler } from './actions/saksbehandler_actions';
import { hentEnheter } from './actions/enheter_actions';
import HeaderContainer from './containers/HeaderContainer';
import './../styles/styles.less'

window.renderDecoratorHead = function ({ config }) {
    const rootReducer = combineReducers({
        saksbehandler,
        enheter,
        meny,
    });

    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);

    config.toggles.visSaksbehandler && store.dispatch(hentSaksbehandler());
    config.toggles.visEnhet && store.dispatch(hentEnheter());

    const headerElement = document.getElementById('header');
    render(<Provider store={store}><HeaderContainer config={config} headerElement={headerElement} /></Provider>, headerElement);
};
