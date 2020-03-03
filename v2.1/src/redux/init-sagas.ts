import { all, call, fork, put, take, takeLatest } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { ApplicationProps, FnrDisplay } from '../domain';
import { EnhetContextvalueState, FnrContextvalueState, Saksbehandler } from '../internal-domain';
import { ReduxActionTypes, SagaActionTypes } from './actions';
import * as Api from './api';
import { FetchResponse, hasError } from './api';
import initialSyncEnhet from './enhet-initial-sync-saga';
import initialSyncFnr from './fnr-initial-sync-saga';
import { updateFnr } from './fnr-update-sagas';
import { updateEnhet } from './enhet-update-sagas';
import { wsListener } from './wsSaga';
import { InitializedState } from './reducer';

function* initializeStore(props: ApplicationProps, saksbehandler: Saksbehandler) {
    const fnr: FnrContextvalueState = MaybeCls.of(props.fnr)
        .map((config) => {
            return {
                enabled: true,
                value: MaybeCls.of(config.initialValue),
                wsRequestedValue: MaybeCls.nothing<string>(),
                onChange: config.onChange,
                display: FnrDisplay.SOKEFELT,
                showModal: false,
                showModalBeforeChange:
                    config.showModalBeforeChange === undefined
                        ? true
                        : config.showModalBeforeChange,
                ignoreWsEvents: config.ignoreWsEvents === undefined ? false : config.ignoreWsEvents
            };
        })
        .withDefault({ enabled: false });

    const enhet: EnhetContextvalueState = MaybeCls.of(props.enhet)
        .map((config) => {
            return {
                enabled: true,
                value: MaybeCls.of(config.initialValue),
                wsRequestedValue: MaybeCls.nothing<string>(),
                onChange: config.onChange,
                display: config.display,
                showModal: false,
                showModalBeforeChange:
                    config.showModalBeforeChange === undefined
                        ? true
                        : config.showModalBeforeChange,
                ignoreWsEvents: config.ignoreWsEvents === undefined ? false : config.ignoreWsEvents
            };
        })
        .withDefault({ enabled: false });

    const visVeileder: boolean = MaybeCls.of(props.toggles)
        .flatMap((toggles) => MaybeCls.of(toggles.visVeileder))
        .withDefault(true);

    const state: InitializedState = {
        initialized: true,
        appname: props.appname,
        fnr,
        enhet,
        toggles: { visVeileder },
        markup: props.markup,
        data: {
            saksbehandler,
            aktorId: MaybeCls.nothing()
        },
        feilmeldinger: []
    };

    yield put({ type: ReduxActionTypes.INITIALIZE, data: state });
}

function* initDekoratorData(props: ApplicationProps) {
    const response: FetchResponse<Saksbehandler> = yield call(Api.hentSaksbehandlerData);

    if (hasError(response)) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: response.error,
            scope: 'initDekoratorData'
        });
    } else {
        yield call(initializeStore, props, response.data);
    }

    return response;
}

export function* initSaga(): IterableIterator<any> {
    console.time('initSaga');
    const action: { data: ApplicationProps } = yield take(SagaActionTypes.INIT);
    const props = action.data;

    console.time('init');
    yield call(initDekoratorData, props);
    console.timeEnd('init');

    console.time('sync');
    const syncJobs = [];
    if (props.enhet) {
        syncJobs.push(call(initialSyncEnhet, props.enhet));
    }
    if (props.fnr) {
        syncJobs.push(call(initialSyncFnr, props.fnr));
    }
    yield all(syncJobs);
    console.timeEnd('sync');

    console.timeEnd('initSaga');

    yield takeLatest(SagaActionTypes.FNRSUBMIT, updateFnr);
    yield takeLatest(SagaActionTypes.FNRRESET, updateFnr);
    yield takeLatest(SagaActionTypes.ENHETCHANGED, updateEnhet);
    yield fork(wsListener);
}
