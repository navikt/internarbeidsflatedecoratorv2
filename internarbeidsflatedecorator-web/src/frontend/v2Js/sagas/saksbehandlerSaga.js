import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/saksbehandler_actions';
import { HENT_SAKSBEHANDLER_FORESPURT } from '../actions/actiontyper';
const DEBUG = process.env.NODE_ENV !== "production";

export function* saksbehandlerSaga() {
    yield put(actions.henterSaksbehandler());
    try {
        //TODO URL...mulig man må ha miljø som et parameter i config'en som sender til renderDecorator og så bruke den her
        //Kontekst-relative vil ikke fungere om klienten ligger på app-adeo.no/app

        const url = DEBUG ? 'https://localhost:9590/veilarbveileder/tjenester/veileder/me'
            :
            'veilarbveileder/tjenester/veileder';
        const data = yield call(get, url);
        yield put(actions.saksbehandlerHentet(data));
    } catch (e) {
        yield put(actions.hentSaksbehandlerFeilet());
    }
}

function* watchHentSaksbehandler() {
    yield* takeEvery(HENT_SAKSBEHANDLER_FORESPURT, saksbehandlerSaga);
}

export default function* saksbehandlerSagas() {
    yield [
        fork(watchHentSaksbehandler),
    ];
}
