import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all, call, fork, put, spawn, take, takeLatest} from 'redux-saga/effects';
import {MaybeCls} from '@nutgaard/maybe-ts';
import * as Api from './api';
import {FetchResponse, hasError} from './api';
import {Props} from '../application';
import {AktorIdResponse, Contextholder, Markup, Saksbehandler, Toggles} from '../domain';
import {EMDASH} from '../utils/string-utils';
import {ReduxActions, ReduxActionTypes, SagaActionTypes} from './actions';
import {getWebSocketUrl} from "../context-api";
import {wsListener} from "./wsSaga";
import initialSyncEnhet from "./initialSyncEnhet";
import initialSyncFnr from "./initialSyncFnr";

export interface Data {
    saksbehandler: MaybeCls<Saksbehandler>;
    aktorId: MaybeCls<AktorIdResponse>;
}

export interface Urler {
    veilederdataUrl: string;
    wsUrl: string;
    aktoerregister: string;
}

export interface State {
    appname: string;
    fnr: MaybeCls<string>;
    enhet: MaybeCls<string>;
    toggles: Toggles;
    markup?: Markup;
    contextholderConfig: Contextholder;
    urler: Urler;
    data: Data;
    feilmeldinger: Array<string>;
}

const initialState: State = {
    appname: EMDASH,
    fnr: MaybeCls.nothing(),
    enhet: MaybeCls.nothing(),
    toggles: {
        visEnhet: false,
        visEnhetVelger: true,
        visSokefelt: true,
        visVeileder: false
    },
    markup: undefined,
    contextholderConfig: {
        enabled: true
    },
    urler: {
        veilederdataUrl: '',
        wsUrl: '',
        aktoerregister: ''
    },
    data: {
        saksbehandler: MaybeCls.nothing(),
        aktorId: MaybeCls.nothing()
    },
    feilmeldinger: []
};

function reducer(state: State = initialState, action: ReduxActions): State {
    console.log('action', action);
    switch (action.type) {
        case ReduxActionTypes.UPDATESTATE:
            return {...state, ...action.data};
        case ReduxActionTypes.FEILMELDING:
            return {
                ...state,
                feilmeldinger: MaybeCls.of(action.data)
                    .filter((feilmelding) => feilmelding.length > 0)
                    .map((feilmelding) => [feilmelding])
                    .withDefault([])
            };
        case ReduxActionTypes.AKTORIDDATA:
            const aktorId = {
                ...state.data,
                aktorId: MaybeCls.of(action.data)
            };
            return {
                ...state,
                data: aktorId
            };
        case ReduxActionTypes.DEKORATORDATA:
            const saksbehandler = {
                ...state.data,
                saksbehandler: MaybeCls.of(action.data)
            };
            return {
                ...state,
                data: saksbehandler
            };
        default:
            return state;
    }
}

function* initializeStore(props: Props, saksbehandler: Saksbehandler) {
    const veilederdataUrl: string = MaybeCls.of(props.urler)
        .flatMap((urler) => MaybeCls.of(urler.veilederdataUrl))
        .withDefault('');
    const aktoerregister: string = MaybeCls.of(props.urler)
        .flatMap((urler) => MaybeCls.of(urler.aktoerregister))
        .withDefault('');

    const toggles = MaybeCls.of(props.toggles)
        .withDefault({
            visEnhet: false,
            visEnhetVelger: false,
            visSokefelt: false,
            visVeileder: false
        });

    const state: Partial<State> = {
        appname: props.appname,
        fnr: MaybeCls.of(props.defaultFnr).filter((fnr) => fnr.length > 0),
        enhet: MaybeCls.of(props.defaultEnhet).filter((enhet) => enhet.length > 0),
        toggles: {
            visEnhet: toggles.visEnhet,
            visEnhetVelger: toggles.visEnhetVelger,
            visSokefelt: toggles.visSokefelt,
            visVeileder: toggles.visVeileder
        },
        markup: props.markup,
        contextholderConfig: props.contextholderConfig,
        urler: {
            veilederdataUrl,
            wsUrl: getWebSocketUrl(saksbehandler),
            aktoerregister
        }
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
        yield call(initializeStore, props, response.data);
    }

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

    if (props.onSok) {
        yield spawn(props.onSok, fnr.withDefault(''));
    }
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

    if (props.onEnhetChange) {
        yield spawn(props.onEnhetChange, value.data);
    }
}

export function* initSaga(): IterableIterator<any> {
    console.time('initSaga');
    const action: { data: Props } = yield take(SagaActionTypes.INIT);
    const props = action.data;

    console.time('init');
    yield call(initDekoratorData, props);
    console.timeEnd('init');

    console.time('sync');
    const syncJobs = [];
    if (props.onEnhetChange) {
        syncJobs.push(call(initialSyncEnhet, props));
    }
    if (props.onSok) {
        syncJobs.push(call(initialSyncFnr, props));
    }
    yield all(syncJobs);
    console.timeEnd('sync');

    console.timeEnd('initSaga');

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
