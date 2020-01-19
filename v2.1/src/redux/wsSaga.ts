import {eventChannel} from "redux-saga";
import WebSocketImpl from "../utils/websocket-impl";
import {ContextApiType} from "../context-api";
import * as Api from './api';
import {FetchResponse} from './api';
import {AktivBruker, AktivEnhet} from "../domain";
import {call, put, select, takeLatest} from "redux-saga/effects";
import {ReduxActionTypes} from "./actions";
import {MaybeCls} from "@nutgaard/maybe-ts";
import {State} from "./index";

function createWsChannel(url: string | null | undefined) {
    console.log('createWsChannel', url);
    if (!url) {
        return eventChannel((emit) => {
            return () => {};
        });
    }

    return eventChannel((emit) => {
        const ws = new WebSocketImpl(url, {
            onMessage(event: MessageEvent): void {
                emit(event.data);
            }
        });
        ws.open();
        return () => ws.close();
    });
}

function* wsChange(event: ContextApiType) {
    if (event === ContextApiType.NY_AKTIV_BRUKER) {
        const response: FetchResponse<AktivBruker> = yield call(Api.hentAktivBruker);
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: MaybeCls.of(response.data).map((data) => data.aktivBruker)
            }
        });
    } else if (event === ContextApiType.NY_AKTIV_ENHET) {
        const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: MaybeCls.of(response.data).map((data) => data.aktivEnhet)
            }
        });
    }
}

export function* wsListener() {
    const wsUrl = yield select((state: State) => state.contextholder.map(({ url }) => url).withDefault(null));
    const wsChannel = yield call(createWsChannel, wsUrl);
    yield takeLatest(wsChannel, wsChange);
}