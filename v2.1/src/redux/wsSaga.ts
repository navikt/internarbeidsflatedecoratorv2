import { eventChannel } from 'redux-saga';
import { call, takeLatest } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import WebSocketImpl from '../utils/websocket-impl';
import * as Api from './api';
import { ContextApiType, FetchResponse, getWebSocketUrl } from './api';
import { AktivBruker, AktivEnhet } from '../internal-domain';
import { selectFromInitializedState } from './utils';
import { updateWSRequestedEnhet } from './enhet-update-sagas';
import { updateWSRequestedFnr } from './fnr-update-sagas';

function createWsChannel(url: string | null | undefined) {
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
        const onsketFnr: MaybeCls<string> = MaybeCls.of(response.data).flatMap((data) =>
            MaybeCls.of(data.aktivBruker)
        );
        yield* updateWSRequestedFnr(onsketFnr);
    } else if (event === ContextApiType.NY_AKTIV_ENHET) {
        const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);
        const onsketEnhet: MaybeCls<string> = MaybeCls.of(response.data).flatMap((data) =>
            MaybeCls.of(data.aktivEnhet)
        );
        yield* updateWSRequestedEnhet(onsketEnhet);
    }
}

export function* wsListener() {
    const saksbehandler = yield selectFromInitializedState((state) => state.data.saksbehandler);
    const wsUrl = getWebSocketUrl(saksbehandler);
    const wsChannel = yield call(createWsChannel, wsUrl);
    yield takeLatest(wsChannel, wsChange);
}
