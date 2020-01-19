import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all, call, fork, put, spawn, take, takeLatest} from 'redux-saga/effects';
import * as Api from './api';
import {FetchResponse, hasError} from './api';
import {MaybeCls} from '@nutgaard/maybe-ts';
import {Props} from '../application';
import {AktorIdResponse, Contextholder, Saksbehandler, Toggles} from '../domain';
import {EMDASH} from '../utils/string-utils';
import {ReduxActions, ReduxActionTypes, SagaActionTypes} from './actions';
import {lagFnrFeilmelding} from '../utils/fnr-utils';
import {getWebSocketUrl} from "../context-api";
import {wsListener} from "./wsSaga";
import initialSyncEnhet from "./initialSyncEnhet";
import initialSyncFnr from "./initialSyncFnr";

export interface State {
    appname: string;
    fnr: MaybeCls<string>;
    enhet: MaybeCls<string>;
    toggles: Toggles;
    markupEttersokefelt: MaybeCls<string>;
    saksbehandler: MaybeCls<Saksbehandler>;
    aktorId: MaybeCls<AktorIdResponse>;
    feilmelding: MaybeCls<string>;
    apen: boolean;
    contextholder: MaybeCls<Contextholder>;
    urler?: {
        aktoerregister?: string;
    };
}

const initialState: State = {
    appname: EMDASH,
    fnr: MaybeCls.nothing(),
    enhet: MaybeCls.nothing(),
    toggles: {
        visEnhet: false,
        visEnhetVelger: false,
        visSokefelt: false,
        visVeilder: false
    },
    markupEttersokefelt: MaybeCls.nothing(),
    saksbehandler: MaybeCls.nothing(),
    aktorId: MaybeCls.nothing(),
    feilmelding: MaybeCls.nothing(),
    apen: false,
    contextholder: MaybeCls.nothing()
};

function reducer(state: State = initialState, action: ReduxActions) {
    console.log('action', action);
    switch (action.type) {
        case ReduxActionTypes.UPDATESTATE:
            return {...state, ...action.data};
        case ReduxActionTypes.FEILMELDING:
            return {
                ...state,
                feilmelding: MaybeCls.of(action.data).filter(
                    (feilmelding) => feilmelding.length > 0
                )
            };
        case ReduxActionTypes.AKTORIDDATA:
            return {
                ...state,
                aktorId: MaybeCls.of(action.data)
            };
        case ReduxActionTypes.DEKORATORDATA:
            return {
                ...state,
                saksbehandler: MaybeCls.of(action.data)
            };
        default:
            return state;
    }
}

function* initializeStore(props: Props, saksbehandler: FetchResponse<Saksbehandler>) {
    const onsketFnr: MaybeCls<string> = MaybeCls.of(props.fnr).filter((fnr) => fnr.length > 0);
    const state: Partial<State> = {
        appname: props.appname,
        toggles: {
            visEnhet: props.toggles.visEnhet,
            visEnhetVelger: props.toggles.visEnhetVelger,
            visSokefelt: props.toggles.visSokefelt,
            visVeilder: props.toggles.visVeilder
        },
        fnr: onsketFnr,
        feilmelding: onsketFnr.flatMap(lagFnrFeilmelding),
        markupEttersokefelt: MaybeCls.of(props.markup).flatMap((markup) =>
            MaybeCls.of(markup.etterSokefelt)
        ),
        contextholder: MaybeCls.of(props.contextholder).map((config) => ({
            url: getWebSocketUrl(saksbehandler),
            ...(config === true ? {} : config)
        })),
        urler: props.urler
    };

    yield put({type: 'REDUX/UPDATESTATE', data: state});
}

function* initDekoratorData(props: Props) {
    const response: FetchResponse<Saksbehandler> = yield call(Api.hentSaksbehandlerData);

    if (hasError(response)) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: response.error,
            scope: 'initDekoratorData'
        });
    } else {
        yield put({type: ReduxActionTypes.DEKORATORDATA, data: response.data});
    }

    yield call(initializeStore, props, response);

    return response;
}

function* updateFnr(props: Props, value: { data: string }) {
    const fnr = MaybeCls.of(value.data).filter((v) => v.length > 0);
    if (fnr.isNothing()) {
        yield fork(Api.nullstillAktivBruker);
    } else {
        yield fork(Api.oppdaterAktivBruker, fnr.withDefault(''));
    }
    yield put({
        type: ReduxActionTypes.UPDATESTATE,
        data: {
            fnr
        }
    });
    yield spawn(props.onSok, fnr.withDefault(''));
}

function* updateEnhet(props: Props, value: { data: string }) {
    yield fork(Api.oppdaterAktivEnhet, value.data);
    yield put({
        type: ReduxActionTypes.UPDATESTATE,
        data: {
            enhet: MaybeCls.of(value)
        },
        scope: 'initialSyncEnhet - by fallback'
    });
    yield spawn(props.onEnhetChange, value.data);
}

export function* initSaga(): IterableIterator<any> {
    console.time('initSaga');
    const {data: props}: { data: Props } = yield take(SagaActionTypes.INIT);

    console.time('init');
    yield call(initDekoratorData, props);
    console.timeEnd('init');

    console.time('sync');
    yield all([call(initialSyncEnhet, props), call(initialSyncFnr, props)]);
    console.timeEnd('sync');

    console.timeEnd('initSaga');

    // yield fork(watcher, props);
    yield takeLatest(SagaActionTypes.FNRSUBMIT, updateFnr as any, props);
    yield takeLatest(SagaActionTypes.FNRRESET, updateFnr as any, props);
    yield takeLatest(SagaActionTypes.ENHETCHANGED, updateEnhet as any, props);
    yield fork(wsListener);
}

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([initSaga()]);
}

const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
