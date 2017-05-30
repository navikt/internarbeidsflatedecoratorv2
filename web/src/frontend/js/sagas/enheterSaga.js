import { call, put, fork } from 'redux-saga/effects';
import { takeEvery } from 'redux-saga';
import { get } from './api/index';
import * as actions from '../actions/enheter_actions';
import { HENT_ENHETER_FORESPURT } from '../actions/actiontyper';
import { erDev, finnMiljoStreng } from './util';
import config from '../config';
import mockEnheter from './mock/enheter';

export function* enheterSaga(action) {
    yield put(actions.henterEnheter());
    if (config.mock.mockEnhet) {
        yield put(actions.enheterHentet(mockEnheter));
        return;
    }

    try {
        let url;
        if (action && action.data && action.data.overrideenhetersaga) {
            url = erDev() ? 'http://localhost:8196/mote/rest/enheter'
                : `https://modapp${finnMiljoStreng()}.adeo.no/mote/rest/enheter`;
        } else if (action && action.data && action.data.url) {
            url = action.data.url;
        } else {
            url = erDev() ? 'https://localhost:9590/veilarbveileder/tjenester/veileder/enheter'
                : `https://app${finnMiljoStreng()}.adeo.no/veilarbveileder/tjenester/veileder/enheter`;
        }

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
