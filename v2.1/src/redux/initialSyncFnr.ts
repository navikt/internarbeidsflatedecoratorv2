import {call, fork, put, spawn} from "redux-saga/effects";
import {MaybeCls} from "@nutgaard/maybe-ts";
import * as Api from './api';
import {FetchResponse, hasError} from './api';
import {AktivBruker, AktorIdResponse} from "../internal-domain";
import {lagFnrFeilmelding} from "../utils/fnr-utils";
import {ReduxActionTypes} from "./actions";
import {FnrContextvalueState, isEnabled} from "../internal-domain";
import {RESET_VALUE, selectFromInitializedState, spawnConditionally} from "./utils";
import {ApplicationProps, FnrContextvalue} from "../domain";
import {InitializedState} from "./index";

function* hentAktorId() {
    const state: InitializedState = yield selectFromInitializedState((state) => state);

    if (isEnabled(state.fnr) && state.fnr.value.isJust()) {
        const fnr = state.fnr.value.withDefaultLazy(() => {
            throw new Error(`'state.fnr' was NOTHING while expecting JUST`);
        });

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

function* updateFnrState(onsketFnr: MaybeCls<string>) {
    const data: FnrContextvalueState = yield selectFromInitializedState((state) => state.fnr);

    if (isEnabled(data)) {
        const newData: FnrContextvalueState = {
            ...data,
            value: onsketFnr
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
        const newData: FnrContextvalueState = {
            ...data,
            wsRequestedValue: onsketFnr
        };

        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: newData
            },
            scope: 'initialSyncFnr - by props'
        })
    }
}

export function* updateFnr(props: ApplicationProps, value: { data: string }) {
    const fnr = MaybeCls.of(value.data).filter((v) => v.length > 0);
    if (fnr.isNothing()) {
        yield fork(Api.nullstillAktivBruker);
    } else {
        yield fork(Api.oppdaterAktivBruker, fnr.withDefault(''));
    }

    yield* updateFnrState(fnr);
    if (props.fnr) {
        yield spawn(props.fnr.onChange, fnr.withDefault(''));
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
        yield* updateFnrState(onsketFnr);
        yield spawnConditionally(props.onChange, onsketFnr.withDefault(''));
    } else if (onsketFnr.isNothing() && contextholderFnr.isJust()) {
        // Ikke noe fnr via props, bruker fnr fra contextholder og kaller onSok med dette
        yield* updateFnrState(contextholderFnr);
        yield spawnConditionally(props.onChange, contextholderFnr.withDefault(''));
    } else {
        yield* updateFnrState(onsketFnr);
    }

}
