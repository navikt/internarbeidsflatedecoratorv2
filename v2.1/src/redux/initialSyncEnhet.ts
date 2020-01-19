import {Props} from "../application";
import * as Api from './api';
import {FetchResponse} from './api';
import {AktivEnhet} from "../domain";
import {call, fork, put, select, spawn} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import {ReduxActionTypes} from "./actions";
import {State} from "./index";

export type InitialSyncEnhetProps = Pick<Props, 'enhet' | 'onEnhetChange'>;
export type InitialSyncEnhetState = Pick<State, 'saksbehandler'>;
export default function* initialSyncEnhet(props: InitialSyncEnhetProps) {
    const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);

    const state: InitialSyncEnhetState = yield select((state: State) => ({saksbehandler: state.saksbehandler}));
    const gyldigeEnheter: Array<string> = state.saksbehandler
        .map((sakbehandler) => sakbehandler.enheter)
        .map((enheter) => enheter.map((enhet) => enhet.enhetId))
        .withDefault([]);

    const onsketEnhet = MaybeCls.of(props.enhet)
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
        yield spawn(props.onEnhetChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: contextholderEnhet
            },
            scope: 'initialSyncEnhet - by contextholder'
        });
        yield spawn(props.onEnhetChange, contextholderEnhet.withDefault(''));
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
        yield spawn(props.onEnhetChange, fallbackEnhet);
    } else {
        yield fork(Api.nullstillAktivBruker);
        yield put({type: ReduxActionTypes.FEILMELDING, data: 'Kunne ikke finne en passende enhet'});
    }
}