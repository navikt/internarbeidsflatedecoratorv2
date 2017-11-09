import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/veileder_actions';
import { HENT_VEILEDER_FORESPURT } from '../actions/actiontyper';
import { erDev, finnMiljoStreng } from './util';
import config from '../config';
import veilederMock from './mock/veileder';

export function* veilederSaga(action) {
    yield put(actions.henterVeileder());
    if (config.mock.mockVeileder) {
        yield put(actions.veilederHentet(veilederMock));
        return;
    }
    try {
        let url;
        if (action && action.data && action.data.url) {
            url = action.data.url;
        } else {
            url = erDev() ? 'https://localhost:9590/veilarbveileder/api/veileder/me'
                : `https://app${finnMiljoStreng()}.adeo.no/veilarbveileder/api/veileder/me`;
        }
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
