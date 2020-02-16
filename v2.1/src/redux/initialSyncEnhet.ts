import {call, fork, put, spawn} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import * as Api from './api';
import {FetchResponse} from './api';
import {AktivEnhet, Data, EnhetContextvalueState, isEnabled} from "../internal-domain";
import {ReduxActionTypes} from "./actions";
import {RESET_VALUE, selectFromInitializedState, spawnConditionally} from "./utils";
import {ApplicationProps, EnhetContextvalue} from "../domain";

function* updateEnhetState(onsketEnhet: MaybeCls<string>) {
    const data: EnhetContextvalueState = yield selectFromInitializedState((state) => state.enhet);
    if (isEnabled(data)) {
        const newData: EnhetContextvalueState = {
            ...data,
            value: onsketEnhet
        };

        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: newData
            },
            scope: 'initialSyncEnhet - by props'
        })
    }
}

export function* updateWSRequestedEnhet(onsketEnhet: MaybeCls<string>) {
    const data: EnhetContextvalueState = yield selectFromInitializedState((state) => state.enhet);
    if (isEnabled(data)) {
        const newData: EnhetContextvalueState = {
            ...data,
            wsRequestedValue: onsketEnhet
        };

        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: newData
            },
            scope: 'initialSyncEnhet - by props'
        })
    }
}

export function* updateEnhet(props: ApplicationProps, value: { data: string }) {
    yield fork(Api.oppdaterAktivEnhet, value.data);
    yield* updateEnhetState(MaybeCls.of(value.data));
    if (props.enhet) {
        yield spawn(props.enhet.onChange, value.data);
    }
}

export default function* initialSyncEnhet(props: EnhetContextvalue) {
    if (props.initialValue === RESET_VALUE) {
        yield call(Api.nullstillAktivEnhet);
    }
    const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);

    const state: Data = yield selectFromInitializedState((state) => state.data);
    const gyldigeEnheter: Array<string> = state.saksbehandler.enheter.map((enhet) => enhet.enhetId);

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

        yield* updateEnhetState(onsketEnhet);
        yield spawnConditionally(props.onChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield* updateEnhetState(contextholderEnhet);
        yield spawnConditionally(props.onChange, contextholderEnhet.withDefault(''));
    } else if (gyldigeEnheter.length > 0) {
        const fallbackEnhet = gyldigeEnheter[0];
        yield fork(Api.oppdaterAktivEnhet, fallbackEnhet);
        yield* updateEnhetState(MaybeCls.of(fallbackEnhet));
        yield spawnConditionally(props.onChange, fallbackEnhet);
    } else {
        yield fork(Api.nullstillAktivBruker);
        yield put({type: ReduxActionTypes.FEILMELDING, data: 'Kunne ikke finne en passende enhet'});
    }
}
