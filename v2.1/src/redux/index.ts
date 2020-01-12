import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all, call, fork, put, select, take, spawn } from 'redux-saga/effects';
import * as Api from './api';
import { FetchResponse, hasError } from './api';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { Props } from '../application';
import { defaultAktorIdUrl } from '../utils/use-aktorid';
import {
    AktivBruker,
    AktivEnhet,
    AktorIdResponse,
    Contextholder,
    Saksbehandler,
    Toggles
} from '../domain';
import { EMDASH } from '../utils/string-utils';
import { ReduxActions, ReduxActionTypes, SagaActionTypes } from './actions';
import { lagFnrFeilmelding } from '../utils/fnr-utils';

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
            return { ...state, ...action.data };
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

function* initializeStore(props: Props) {
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
            ...(config === true ? {} : config)
        })),
        urler: props.urler
    };

    yield put({ type: 'REDUX/UPDATESTATE', data: state });
}

function* initAktorId() {
    const state: State = yield select();
    const aktorIdUrl = MaybeCls.of(state.urler)
        .flatMap((urler) => MaybeCls.of(urler.aktoerregister))
        .getOrElse(defaultAktorIdUrl);

    if (state.fnr.isJust()) {
        const fnr = state.fnr.withDefaultLazy(() => {
            throw new Error(`'state.fnr' was NOTHING while expecting JUST`);
        });

        const response: FetchResponse<AktorIdResponse> = yield call(
            Api.hentAktorId,
            aktorIdUrl,
            fnr
        );
        if (hasError(response)) {
            yield put({
                type: ReduxActionTypes.FEILMELDING,
                data: response.error,
                scope: 'initAktorId'
            });
        } else {
            yield put({ type: ReduxActionTypes.AKTORIDDATA, data: response.data });
        }
    }
}

function* initDekoratorData() {
    const response: FetchResponse<Saksbehandler> = yield call(Api.hentSaksbehandlerData);

    if (hasError(response)) {
        yield put({
            type: ReduxActionTypes.FEILMELDING,
            data: response.error,
            scope: 'initDekoratorData'
        });
    } else {
        yield put({ type: ReduxActionTypes.DEKORATORDATA, data: response.data });
    }

    return response;
}

function* initialSyncEnhet(props: Props) {
    const response: FetchResponse<AktivEnhet> = yield call(Api.hentAktivEnhet);
    const state: State = yield select();
    const gyldigeEnheter: Array<string> = state.saksbehandler
        .map((sakbehandler) => sakbehandler.enheter)
        .map((enheter) => enheter.map((enhet) => enhet.enhetId))
        .withDefault([]);

    const onsketEnhet = MaybeCls.of(props.enhet)
        .map((enhet) => enhet.trim())
        .filter((enhet) => enhet.length > 0)
        .filter((enhet) => gyldigeEnheter.includes(enhet));

    const contextholderEnhet: MaybeCls<string> = MaybeCls.of(response.data)
        .flatMap((data) => MaybeCls.of(data.aktivEnhet))
        .map((enhet) => enhet.trim())
        .filter((enhet) => enhet.length > 0)
        .filter((enhet) => gyldigeEnheter.includes(enhet));

    if (onsketEnhet.isJust()) {
        yield fork(Api.oppdaterAktivEnhet, onsketEnhet.withDefault(''));
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: onsketEnhet
            },
            scope: 'initialSyncEnhet - by props'
        });
        yield spawn(props.onEnhetChange, onsketEnhet.withDefault(''));
    } else if (contextholderEnhet.isJust()) {
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: contextholderEnhet
            },
            scope: 'initialSyncEnhet - by contextholder'
        });
        yield spawn(props.onEnhetChange, onsketEnhet.withDefault(''));
    } else {
        const fallbackEnhet = gyldigeEnheter[0];
        yield fork(Api.oppdaterAktivEnhet, fallbackEnhet);
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                enhet: MaybeCls.of(fallbackEnhet)
            },
            scope: 'initialSyncEnhet - by fallback'
        });
        yield spawn(props.onEnhetChange, fallbackEnhet);
    }
}

function* initialSyncFnr(props: Props) {
    const response: FetchResponse<AktivBruker> = yield call(Api.hentAktivBruker);
    const onsketFnr = MaybeCls.of(props.fnr)
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
            data: response.error,
            scope: 'initSyncFnr - hasError'
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
        yield fork(Api.oppdaterAktivBruker, onsketFnr.withDefault(''));
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: onsketFnr
            },
            scope: 'initSyncFnr - by props'
        });
        yield spawn(props.onSok, onsketFnr.withDefault(''));
    } else if (onsketFnr.isNothing() && contextholderFnr.isJust()) {
        // Ikke noe fnr via props, bruker fnr fra contextholder og kaller onSok med dette
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: contextholderFnr
            },
            scope: 'initSyncFnr - by contextholder'
        });
        yield spawn(props.onSok, contextholderFnr.withDefault(''));
    } else {
        yield put({
            type: ReduxActionTypes.UPDATESTATE,
            data: {
                fnr: onsketFnr
            },
            scope: 'initSyncFnr - by fallback'
        });
    }

    if (feilFnr.isNothing()) {
        yield fork(initAktorId);
    }
}

function* initSaga(): IterableIterator<any> {
    console.time('initSaga');
    const { data: props }: { data: Props } = yield take(SagaActionTypes.INIT);

    console.time('init');
    yield all([call(initializeStore, props), call(initDekoratorData)]);
    console.timeEnd('init');

    console.time('sync');
    yield all([call(initialSyncEnhet, props), call(initialSyncFnr, props)]);
    console.timeEnd('sync');

    console.timeEnd('initSaga');
}

const sagaMiddleware = createSagaMiddleware();

function* rootSaga() {
    yield all([initSaga()]);
}

const store = createStore(reducer, applyMiddleware(sagaMiddleware));
sagaMiddleware.run(rootSaga);

export default store;
