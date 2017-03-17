import './globals';
import React from 'react';
import { render } from 'react-dom';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import rootSaga from './sagas/index';
import veileder from './reducers/veileder';
import enheter from './reducers/enheter';
import meny from './reducers/meny';
import feilmeldinger from './reducers/feilmelding';
import { hentVeileder } from './actions/veileder_actions';
import { hentEnheter } from './actions/enheter_actions';
import HeaderContainer from './containers/HeaderContainer';
import './../styles/styles.less'

window.renderDecoratorHead = function ({ config }) {
    const rootReducer = combineReducers({
        veileder,
        enheter,
        meny,
        feilmeldinger
    });

    const sagaMiddleware = createSagaMiddleware();
    const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
    sagaMiddleware.run(rootSaga);

    config.toggles.visVeileder && store.dispatch(hentVeileder());
    (config.toggles.visEnhet || config.toggles.visEnhetVelger)  && store.dispatch(hentEnheter());

    const headerElement = document.getElementById('header');
    render(<Provider store={store}><HeaderContainer config={config} headerElement={headerElement} /></Provider>, headerElement);
};
