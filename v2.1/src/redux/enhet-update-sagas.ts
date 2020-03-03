import { MaybeCls } from '@nutgaard/maybe-ts';
import { fork, put, spawn, take } from 'redux-saga/effects';
import { EnhetContextvalueState, isEnabled } from '../internal-domain';
import { selectFromInitializedState } from './utils';
import { FnrReset, FnrSubmit, ReduxActionTypes, SagaActionTypes } from './actions';
import * as Api from './api';

export function* updateEnhetState(updated: Partial<EnhetContextvalueState>) {
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
        });
    }
}

export function* updateEnhetValue(onsketEnhet: MaybeCls<string>) {
    yield* updateEnhetState({
        value: onsketEnhet
    });
}

export function* updateWSRequestedEnhet(onsketEnhet: MaybeCls<string>) {
    const data: EnhetContextvalueState = yield selectFromInitializedState((state) => state.enhet);
    if (isEnabled(data) && !data.ignoreWsEvents) {
        const enhet = data.value.withDefault('');
        const onsket = onsketEnhet.withDefault('');
        const showModal = enhet !== onsket;

        if (data.skipModal) {
            yield* updateEnhetValue(onsketEnhet);
            yield spawn(data.onChange, onsketEnhet.withDefault(null));
            return;
        }

        yield updateEnhetState({
            wsRequestedValue: onsketEnhet,
            showModal
        });

        const resolution = yield take([
            SagaActionTypes.WS_ENHET_ACCEPT,
            SagaActionTypes.WS_ENHET_DECLINE
        ]);
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
