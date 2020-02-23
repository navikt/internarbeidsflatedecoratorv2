import {call, fork, put, spawn, take} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import * as Api from './api';
import {FetchResponse} from './api';
import {AktivEnhet, Data, EnhetContextvalueState, isEnabled} from "../internal-domain";
import {FnrReset, FnrSubmit, ReduxActionTypes, SagaActionTypes} from "./actions";
import {RESET_VALUE, selectFromInitializedState, spawnConditionally} from "./utils";
import {EnhetContextvalue} from "../domain";

function* updateEnhetValue(onsketEnhet: MaybeCls<string>) {
    yield* updateEnhetState({
        value: onsketEnhet
    })
}

function* updateEnhetState(updated: Partial<EnhetContextvalueState>) {
    const data: EnhetContextvalueState = yield selectFromInitializedState((state) => state.enhet);
    if (isEnabled(data)) {
        const newData: EnhetContextvalueState = {
            ...data,
            ...updated
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
        const enhet = data.value.withDefault('');
        const onsket = onsketEnhet.withDefault('');
        const showModal = enhet !== onsket;

        yield updateEnhetState({
            wsRequestedValue: onsketEnhet,
            showModal
        });

        const resolution = yield take([SagaActionTypes.WS_ENHET_ACCEPT, SagaActionTypes.WS_ENHET_DECLINE]);
        if (resolution.type === SagaActionTypes.WS_ENHET_ACCEPT) {
            yield* updateEnhetState({
                showModal: false,
                value: onsketEnhet
            });
            yield spawn(data.onChange, onsketEnhet.withDefault(null));
        } else {
            yield fork(Api.oppdaterAktivEnhet, enhet);
            yield* updateEnhetState({
                showModal: false
            });
        }
    }
}

export function* updateEnhet(action: FnrSubmit | FnrReset) {
    const props = yield selectFromInitializedState((state) => state.enhet);
    if (isEnabled(props)) {
        if (action.type === SagaActionTypes.FNRRESET) {
            yield fork(Api.nullstillAktivBruker);
            yield* updateEnhetValue(MaybeCls.nothing());
            yield spawn(props.onChange, null);
        } else {
            yield fork(Api.oppdaterAktivEnhet, action.data);
            yield* updateEnhetValue(MaybeCls.of(action.data));
            yield spawn(props.onChange, action.data);
        }
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

        yield* updateEnhetValue(onsketEnhet);
        yield spawnConditionally(props.onChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield* updateEnhetValue(contextholderEnhet);
        yield spawnConditionally(props.onChange, contextholderEnhet.withDefault(''));
    } else if (gyldigeEnheter.length > 0) {
        const fallbackEnhet = gyldigeEnheter[0];
        yield fork(Api.oppdaterAktivEnhet, fallbackEnhet);
        yield* updateEnhetValue(MaybeCls.of(fallbackEnhet));
        yield spawnConditionally(props.onChange, fallbackEnhet);
    } else {
        yield fork(Api.nullstillAktivBruker);
        yield put({type: ReduxActionTypes.FEILMELDING, data: 'Kunne ikke finne en passende enhet'});
    }
}
