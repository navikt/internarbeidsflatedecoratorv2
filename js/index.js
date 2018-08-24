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
import valgtEnhet from './reducers/valgtenhet';
import { hentVeileder } from './actions/veileder_actions';
import { hentEnheter } from './actions/enheter_actions';
import { visFeilmelding } from './actions/feilmeldinger_actions';
import HeaderContainer from './containers/HeaderContainer';
import './../styles/styles.less';
import { settValgtEnhet } from './actions/valgtenhet_actions';
import onkeyup from './hurtigtaster';
import { configureWebSocket } from './websockets';
import { hentAktor } from './actions/aktor_actions';

const rootReducer = combineReducers({
    veileder,
    enheter,
    meny,
    feilmeldinger,
    valgtEnhet,
});
const sagaMiddleware = createSagaMiddleware();
const store = createStore(rootReducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

window.renderDecoratorHead = ({ config }, id = 'header') => {
    if (config.initiellEnhet) {
        store.dispatch(settValgtEnhet(config.initiellEnhet));
    }
    if (config.websockets) {
        configureWebSocket(config.websockets);
    }
    if (config.toggles.visVeileder) {
        store.dispatch(hentVeileder({ url: config.dataSources && config.dataSources.veileder }));
    }
    if (config.toggles.visEnhet || config.toggles.visEnhetVelger) {
        store.dispatch(hentEnheter({ url: config.dataSources && config.dataSources.enheter }));
    }
    if (config.feilmelding) {
        store.dispatch(visFeilmelding(config.feilmelding));
    }

    store.dispatch(hentAktor({ url: '/aktoerregister/api/v1/identer' }));

    const headerElement = document.getElementById(id);
    render(<Provider store={store}><HeaderContainer config={config} headerElement={headerElement} /></Provider>, headerElement);
    document.onkeyup = onkeyup(config.fnr);
};
