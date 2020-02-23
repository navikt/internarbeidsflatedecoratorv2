import {take, call, fork, put, spawn} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import * as Api from './api';
import {FetchResponse, hasError} from './api';
import {AktivBruker, AktorIdResponse} from "../internal-domain";
import {lagFnrFeilmelding} from "../utils/fnr-utils";
import {EnhetChanged, ReduxActionTypes, SagaActionTypes} from "./actions";
import {FnrContextvalueState, isEnabled} from "../internal-domain";
import {RESET_VALUE, selectFromInitializedState, spawnConditionally} from "./utils";
import {FnrContextvalue} from "../domain";
import {InitializedState} from "./index";

function* hentAktorId() {
    const state: InitializedState = yield selectFromInitializedState((state) => state);

    if (isEnabled(state.fnr) && state.fnr.value.isJust()) {
        const fnr = state.fnr.value.withDefaultLazy(() => {
            throw new Error(`'state.fnr' was NOTHING while expecting JUST`);
        });

        if (state.data.aktorId.filter((data) => data[fnr] !== undefined).isJust()) {
            return;
        }

        const feilFnr = state.fnr.value.flatMap(lagFnrFeilmelding);
        if (feilFnr.isNothing()) {
            const response: FetchResponse<AktorIdResponse> = yield call(
                Api.hentAktorId,
                fnr
            );
            if (hasError(response)) {
                yield put({
                    type: ReduxActionTypes.FEILMELDING,
                    data: response.error,
                    scope: 'initAktorId'
                });
            } else {
                yield put({type: ReduxActionTypes.AKTORIDDATA, data: response.data});
            }
        }
    }
}
function* updateFnrValue(onsketFnr: MaybeCls<string>) {
    yield* updateFnrState({
        value: onsketFnr
    });
}
function* updateFnrState(updated: Partial<FnrContextvalueState>) {
    const data: FnrContextvalueState = yield selectFromInitializedState((state) => state.fnr);

    if (isEnabled(data)) {
        const newData: FnrContextvalueState = {
            ...data,
            ...updated
        };
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: newData
            },
            scope: 'initialSyncFnr - by props'
        });

        yield fork(hentAktorId);
    }
}

export function* updateWSRequestedFnr(onsketFnr: MaybeCls<string>) {
    const data: FnrContextvalueState = yield selectFromInitializedState((state) => state.fnr);
    if (isEnabled(data)) {
        const fnr = data.value.withDefault('');
        const onsket = onsketFnr.withDefault('');
        const showModal = fnr !== onsket;

        yield* updateFnrState({
            wsRequestedValue: onsketFnr,
            showModal
        });

        const resolution = yield take([SagaActionTypes.WS_FNR_ACCEPT, SagaActionTypes.WS_FNR_DECLINE]);
        if (resolution.type === SagaActionTypes.WS_FNR_ACCEPT) {
            yield* updateFnrState({
                showModal: false,
                value: onsketFnr
            });
            yield spawn(data.onChange, onsketFnr.withDefault(null));
        } else {
            yield fork(Api.oppdaterAktivBruker, fnr);
            yield* updateFnrState({
                showModal: false
            });
        }
    }
}

export function* updateFnr(action: EnhetChanged) {
    const props = yield selectFromInitializedState((state) => state.fnr);
    if (isEnabled(props)) {
        const fnr = MaybeCls.of(action.data).filter((v) => v.length > 0);
        if (fnr.isNothing()) {
            yield fork(Api.nullstillAktivBruker);
        } else {
            yield fork(Api.oppdaterAktivBruker, fnr.withDefault(''));
        }

        yield* updateFnrValue(fnr);
        yield spawn(props.onChange, fnr.withDefault(''));
    }
}

export default function* initialSyncFnr(props: FnrContextvalue) {
    if (props.initialValue === RESET_VALUE) {
        yield call(Api.nullstillAktivBruker);
        return;
    }

    const response: FetchResponse<AktivBruker> = yield call(Api.hentAktivBruker);
    const onsketFnr = MaybeCls.of(props.initialValue)
        .map((fnr) => fnr.trim())
        .filter((fnr) => fnr.length > 0);
    const feilFnr = onsketFnr.flatMap(lagFnrFeilmelding);

    const contextholderFnr: MaybeCls<string> = MaybeCls.of(response.data)
        .flatMap((data) => MaybeCls.of(data.aktivBruker))
        .map((fnr) => fnr.trim())
        .filter((fnr) => fnr.length > 0);

    if (hasError(response)) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: 'Kunne ikke hente ut person i kontekst'
        });
    }

    if (feilFnr.isJust()) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: feilFnr.withDefault('Ukjent feil ved validering av fødselsnummer.'),
            scope: 'initSyncFnr - ugyldig fnr'
        });
    }

    if (onsketFnr.isJust() && feilFnr.isNothing()) {
        // Gyldig fnr via props, oppdaterer contextholder og kaller onSok med fnr
        const erUlikContextholderFnr = onsketFnr.withDefault('') !== contextholderFnr.withDefault('');
        if (erUlikContextholderFnr) {
            yield fork(Api.oppdaterAktivBruker, onsketFnr.withDefault(''));
        }
        yield* updateFnrValue(onsketFnr);
        yield spawnConditionally(props.onChange, onsketFnr.withDefault(''));
    } else if (onsketFnr.isNothing() && contextholderFnr.isJust()) {
        // Ikke noe fnr via props, bruker fnr fra contextholder og kaller onSok med dette
        yield* updateFnrValue(contextholderFnr);
        yield spawnConditionally(props.onChange, contextholderFnr.withDefault(''));
    } else {
        yield* updateFnrValue(onsketFnr);
    }

}
