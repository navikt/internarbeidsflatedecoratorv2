import {call, fork, put, select} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import * as Api from './api';
import {FetchResponse} from './api';
import {AktivEnhet, Contextvalue} from "../domain";
import {ReduxActionTypes} from "./actions";
import {Data, State} from "./index";
import {RESET_VALUE, spawnConditionally} from "./utils";

export default function* initialSyncEnhet(props: Contextvalue) {
    if (props.initialValue === RESET_VALUE) {
        yield call(Api.nullstillAktivEnhet);
    }
    const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);

    const state: Data = yield select((state: State) => state.data);
    const gyldigeEnheter: Array<string> = state.saksbehandler
        .map((sakbehandler) => sakbehandler.enheter)
        .map((enheter) => enheter.map((enhet) => enhet.enhetId))
        .withDefault([]);

    const onsketEnhet = MaybeCls.of(props.initialValue)
        .map((enhet) => enhet.trim())
        .filter((enhet) => enhet.length > 0)
        .filter((enhet) => gyldigeEnheter.includes(enhet));

    const contextholderEnhet: MaybeCls<string> = MaybeCls.of(response.data)
        .flatMap((data) => MaybeCls.of(data.aktivEnhet))
        .map((enhet) => enhet.trim())
        .filter((enhet) => enhet.length > 0)
        .filter((enhet) => gyldigeEnheter.includes(enhet));

    if (onsketEnhet.isJust()) {
        const erUlikContextholderEnhet = onsketEnhet.withDefault('') !== contextholderEnhet.withDefault('');
        if (erUlikContextholderEnhet) {
            yield fork(Api.oppdaterAktivEnhet, onsketEnhet.withDefault(''));
        }

        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: onsketEnhet
            },
            scope: 'initialSyncEnhet - by props'
        });
        yield spawnConditionally(props.onChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: contextholderEnhet
            },
            scope: 'initialSyncEnhet - by contextholder'
        });
        yield spawnConditionally(props.onChange, contextholderEnhet.withDefault(''));
    } else if (gyldigeEnheter.length > 0) {
        const fallbackEnhet = gyldigeEnheter[0];
        yield fork(Api.oppdaterAktivEnhet, fallbackEnhet);
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: MaybeCls.of(fallbackEnhet)
            },
            scope: 'initialSyncEnhet - by fallback'
        });
        yield spawnConditionally(props.onChange, fallbackEnhet);
    } else {
        yield fork(Api.nullstillAktivBruker);
        yield put({type: ReduxActionTypes.FEILMELDING, data: 'Kunne ikke finne en passende enhet'});
    }
}
