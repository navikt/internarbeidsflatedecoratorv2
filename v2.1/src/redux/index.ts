import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {all, call, fork, put, take, takeLatest} from 'redux-saga/effects';
import {MaybeCls} from '@nutgaard/maybe-ts';
import * as Api from './api';
import {FetchResponse, hasError} from './api';
import {
    ContextvalueState,
    ContextvalueStateEnabled,
    Data,
    EnhetContextvalueState,
    FnrContextvalueState,
    Saksbehandler,
    Toggles,
    UninitializedState
} from '../internal-domain';
import {ReduxActions, ReduxActionTypes, SagaActions, SagaActionTypes} from './actions';
import {wsListener} from "./wsSaga";
import initialSyncEnhet, {updateEnhet} from "./initialSyncEnhet";
import initialSyncFnr, {updateFnr} from "./initialSyncFnr";
import {ApplicationProps, Contextholder, FnrDisplay, Markup} from "../domain";

export interface InitializedState {
    initialized: true;
    appname: string;
    fnr: FnrContextvalueState;
    enhet: EnhetContextvalueState;
    toggles: Toggles;
    markup?: Markup;
    contextholderConfig: Contextholder;
    data: Data;
    feilmeldinger: Array<string>;
}

export type State = UninitializedState | InitializedState;

const initialState: State = {
    initialized: false
};

export function isInitialized(state: State): state is InitializedState {
    return state.initialized
}

function reducer(state: State = initialState, action: ReduxActions | SagaActions): State {
    if (isInitialized(state)) {
        if (action.type === ReduxActionTypes.INITIALIZE) {
            throw new Error(`Got '${action.type}' while store has already been initialized`);
        }

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
            default:
                return state;
        }
    } else {
        if (action.type.startsWith('@@redux/INIT') || action.type.startsWith("SAGA/")) {
            return state;
        }
        if (action.type !== ReduxActionTypes.INITIALIZE) {
            throw new Error(`Got '${action.type} while expecting ${ReduxActionTypes.INITIALIZE}'`);
        }
        return action.data;
    }
}

function* initializeStore(props: ApplicationProps, saksbehandler: Saksbehandler) {
    const fnr: FnrContextvalueState = MaybeCls.of(props.fnr)
        .map((config) => {
            return {
                enabled: true,
                value: MaybeCls.of(config.initialValue),
                wsRequestedValue: MaybeCls.nothing<string>(),
                onChange: config.onChange,
                display: FnrDisplay.SOKEFELT
            };
        })
        .withDefault({enabled: false});

    const enhet: EnhetContextvalueState = MaybeCls.of(props.enhet)
        .map((config) => {
            return {
                enabled: true,
                value: MaybeCls.of(config.initialValue),
                wsRequestedValue: MaybeCls.nothing<string>(),
                onChange: config.onChange,
                display: config.display
            };
        })
        .withDefault({enabled: false});

    const visVeileder: boolean = MaybeCls.of(props.toggles)
        .flatMap((toggles) => MaybeCls.of(toggles.visVeileder))
        .withDefault(true);

    const promptBeforeEnhetChange: boolean = MaybeCls.of(props.contextholderConfig)
        .flatMap((config) => MaybeCls.of(config.promptBeforeEnhetChange))
        .withDefault(true);

    const state: InitializedState = {
        initialized: true,
        appname: props.appname,
        fnr,
        enhet,
        toggles: {visVeileder},
        markup: props.markup,
        contextholderConfig: {promptBeforeEnhetChange},
        data: {
            saksbehandler,
            aktorId: MaybeCls.nothing()
        },
        feilmeldinger: []
    };

    yield put({type: 'REDUX/INITSTATE', data: state});
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
