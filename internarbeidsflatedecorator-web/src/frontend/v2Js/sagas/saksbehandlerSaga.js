import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/saksbehandler_actions';
import { HENT_SAKSBEHANDLER_FORESPURT } from '../actions/actiontyper';
import { erDev } from '../../js/rest-utils';
import { finnMiljoStreng } from './util';

export function* saksbehandlerSaga() {
    yield put(actions.henterSaksbehandler());
    try {
        const url = erDev() ? 'https://localhost:9590/veilarbveileder/tjenester/veileder/me'
            : `https://modapp${finnMiljoStreng()}.adeo.no/veilarbveileder/tjenester/veileder/me`;
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
