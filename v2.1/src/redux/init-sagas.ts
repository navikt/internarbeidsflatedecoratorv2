import { all, call, fork, put, select, take, takeLatest } from 'redux-saga/effects';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { ApplicationProps, FnrDisplay } from '../domain';
import {
    EnhetContextvalueState,
    FeilmeldingLevel,
    FnrContextvalueState,
    Saksbehandler
} from '../internal-domain';
import { ReduxActionTypes, SagaActionTypes } from './actions';
import * as Api from './api';
import { FetchResponse, hasError } from './api';
import initialSyncEnhet from './enhet-initial-sync-saga';
import initialSyncFnr from './fnr-initial-sync-saga';
import { updateFnr } from './fnr-update-sagas';
import { updateEnhet } from './enhet-update-sagas';
import { wsListener } from './wsSaga';
import { InitializedState, State } from './reducer';
import { RESET_VALUE } from './utils';
import log from './../utils/logging';

function* initializeStore(props: ApplicationProps, saksbehandler: MaybeCls<Saksbehandler>) {
    const fnr: FnrContextvalueState = MaybeCls.of(props.fnr)
        .map((config) => {
            return {
                enabled: true,
                value: MaybeCls.of(config.initialValue).filter((fnr) => fnr !== RESET_VALUE),
                wsRequestedValue: MaybeCls.nothing<string>(),
                onChange: config.onChange,
                display: FnrDisplay.SOKEFELT,
                showModal: false,
                skipModal: config.skipModal === undefined ? false : config.skipModal,
                ignoreWsEvents: config.ignoreWsEvents === undefined ? false : config.ignoreWsEvents
            };
        })
        .withDefault({ enabled: false });

    const enhet: EnhetContextvalueState = MaybeCls.of(props.enhet)
        .map((config) => {
            return {
                enabled: true,
                value: MaybeCls.of(config.initialValue).filter((enhet) => enhet !== RESET_VALUE),
                wsRequestedValue: MaybeCls.nothing<string>(),
                onChange: config.onChange,
                display: config.display,
                showModal: false,
                skipModal: config.skipModal === undefined ? false : config.skipModal,
                ignoreWsEvents: config.ignoreWsEvents === undefined ? false : config.ignoreWsEvents
            };
        })
        .withDefault({ enabled: false });

    const visVeileder: boolean = MaybeCls.of(props.toggles)
        .flatMap((toggles) => MaybeCls.of(toggles.visVeileder))
        .withDefault(true);

    const feilmeldinger = yield select((state: State) => state.feilmeldinger);
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
        feilmeldinger
    };

    yield put({ type: ReduxActionTypes.INITIALIZE, data: state });
}

function* initDekoratorData(props: ApplicationProps) {
    const response: FetchResponse<Saksbehandler> = yield call(Api.hentSaksbehandlerData);
    if (hasError(response)) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: {
                level: FeilmeldingLevel.FATAL,
                message: 'Kunne ikke hente informasjon om innlogget saksbehandler.'
            },
            scope: 'initDekoratorData'
        });
        yield call(initializeStore, props, MaybeCls.nothing());
    } else {
        yield call(initializeStore, props, MaybeCls.just(response.data));
    }

    return response;
}

export function* initSaga(): IterableIterator<any> {
    log.time('initSaga');
    const action: { data: ApplicationProps } = yield take(SagaActionTypes.INIT);
    const props = action.data;

    log.time('init');
    yield call(initDekoratorData, props);
    log.timeEnd('init');

    log.time('sync');
    const syncJobs = [];
    if (props.enhet) {
        syncJobs.push(call(initialSyncEnhet, props.enhet));
    }
    if (props.fnr) {
        syncJobs.push(call(initialSyncFnr, props.fnr));
    }
    yield all(syncJobs);
    log.timeEnd('sync');

    log.timeEnd('initSaga');

    yield takeLatest(SagaActionTypes.FNRSUBMIT, updateFnr);
    yield takeLatest(SagaActionTypes.FNRRESET, updateFnr);
    yield takeLatest(SagaActionTypes.ENHETCHANGED, updateEnhet);
    yield fork(wsListener);
}
