import {InitializedState} from "./index";
import {selectFromInitializedState} from "./utils";
import {AktorIdResponse, FnrContextvalueState, isEnabled} from "../internal-domain";
import {lagFnrFeilmelding} from "../utils/fnr-utils";
import * as Api from './api';
import {FetchResponse, hasError} from "./api";
import {call, fork, put, spawn, take} from "redux-saga/effects";
import {EnhetChanged, ReduxActionTypes, SagaActionTypes} from "./actions";
import {MaybeCls} from "@nutgaard/maybe-ts";

export function* hentAktorId() {
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

export function* updateFnrValue(onsketFnr: MaybeCls<string>) {
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
