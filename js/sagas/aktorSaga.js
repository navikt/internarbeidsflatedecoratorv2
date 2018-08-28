import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/aktor_actions';
import { HENT_AKTOR_FORESPURT } from '../actions/actiontyper';
import config from '../config';
import mockAktor from './mock/aktor';
import { getWithHeaders } from './api';

export function* aktorSaga(action) {
    yield put(actions.hentAktor());
    if (config.mock.mockAktor) {
        yield put(actions.aktorHentet(mockAktor));
        return;
    }

    try {
        const data = yield call(getWithHeaders, action.data.url, '10108000398');
        yield put(actions.aktorHentet(data));
    } catch (e) {
        yield put(actions.hentAktorFeilet());
    }
}

function* watchHentAktor() {
    yield* takeEvery(HENT_AKTOR_FORESPURT, aktorSaga);
}

export default function* aktorSagas() {
    yield [
        fork(watchHentAktor),
    ];
}
