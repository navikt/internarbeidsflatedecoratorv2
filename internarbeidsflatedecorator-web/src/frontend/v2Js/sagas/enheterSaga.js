import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/enheter_actions';
import { HENT_ENHETER_FORESPURT } from '../actions/actiontyper';
import { erDev } from '../../js/rest-utils';
import { finnMiljoStreng } from './util';

export function* enheterSaga() {
    yield put(actions.henterEnheter());
    try {
        const url = erDev() ? 'https://localhost:9590/veilarbveileder/tjenester/veileder/enheter'
            : `https://modapp${finnMiljoStreng()}.adeo.no/veilarbveileder/tjenester/veileder/enheter`;

        const data = yield call(get, url);
        yield put(actions.enheterHentet(data));
    } catch (e) {
        yield put(actions.hentEnheterFeilet());
    }
}

function* watchHentEnheter() {
    yield* takeEvery(HENT_ENHETER_FORESPURT, enheterSaga);
}

export default function* enheterSagas() {
    yield [
        fork(watchHentEnheter),
    ];
}
