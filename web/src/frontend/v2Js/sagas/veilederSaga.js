import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/veileder_actions';
import { HENT_VEILEDER_FORESPURT } from '../actions/actiontyper';
import { erDev } from '../../js/rest-utils';
import { finnMiljoStreng } from './util';

export function* veilederSaga() {
    yield put(actions.henterVeileder());
    try {
        const url = erDev() ? 'https://localhost:9590/veilarbveileder/tjenester/veileder/me'
            : `https://app${finnMiljoStreng()}.adeo.no/veilarbveileder/tjenester/veileder/me`;
        const data = yield call(get, url);
        yield put(actions.veilederHentet(data));
    } catch (e) {
        yield put(actions.hentVeilederFeilet());
    }
}

function* watchHentVeileder() {
    yield* takeEvery(HENT_VEILEDER_FORESPURT, veilederSaga);
}

export default function* veilederSagas() {
    yield [
        fork(watchHentVeileder),
    ];
}
