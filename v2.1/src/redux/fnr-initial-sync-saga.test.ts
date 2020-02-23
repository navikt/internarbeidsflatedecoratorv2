import {runSaga, Saga} from 'redux-saga';
import FetchMock, {JSONObject, MatcherUrl, MatcherUtils, ResponseUtils, SpyMiddleware} from 'yet-another-fetch-mock';
import initialSyncFnr from './fnr-initial-sync-saga';
import {AKTIV_BRUKER_URL, ContextApiType, modiacontextholderUrl} from "./api";
import {MaybeCls} from "@nutgaard/maybe-ts";
import {FnrContextvalue, FnrDisplay} from "../domain";
import {AktivBruker, AktivEnhet} from "../internal-domain";
import {InitializedState} from "./reducer";

function gittContextholder(context: Context, aktiveContext: AktivEnhet & AktivBruker & JSONObject, error: boolean = false) {
    context.contextholder.aktivBruker = aktiveContext.aktivBruker;
    context.contextholder.aktivEnhet = aktiveContext.aktivEnhet;
    if (error) {
        context.mock.get('/modiacontextholder/api/context/aktivenhet', ResponseUtils.statusCode(500));
        context.mock.get('/modiacontextholder/api/context/aktivbruker', ResponseUtils.statusCode(500));
        context.mock.post('/modiacontextholder/api/context', ResponseUtils.statusCode(500));
    } else {
        context.mock.get('/modiacontextholder/api/context/aktivenhet', {
            aktivEnhet: aktiveContext.aktivEnhet,
            aktivBruker: null
        });
        context.mock.get('/modiacontextholder/api/context/aktivbruker', {
            aktivEnhet: null,
            aktivBruker: aktiveContext.aktivBruker
        });
        context.mock.post('/modiacontextholder/api/context', ({body}) => {
            const {verdi, eventType} = body;
            if (eventType === ContextApiType.NY_AKTIV_BRUKER) {
                context.contextholder.aktivBruker = verdi;
            } else {
                context.contextholder.aktivEnhet = verdi;
            }
            return Promise.resolve({status: 200});
        });
    }
}

async function run<S extends Saga>(saga: S, state: any, ...args: Parameters<S>) {
    const dispatched: Array<any> = [];
    await runSaga({
        dispatch: (action) => dispatched.push(action),
        getState: () => state,
    }, saga, ...args).toPromise();
    return dispatched;
}

type ContextholderValue = AktivEnhet & AktivBruker & JSONObject;

interface Context {
    mock: FetchMock;
    spy: SpyMiddleware;
    contextholder: ContextholderValue;
}

function gittOnsketFnr(fnr: string | null): FnrContextvalue {
    return {
        initialValue: fnr,
        onChange: jest.fn(),
        display: FnrDisplay.SOKEFELT
    }
}

function gittInitialState(): Partial<InitializedState> {
    return {
        initialized: true,
        fnr: {
            value: MaybeCls.nothing(),
            display: FnrDisplay.SOKEFELT,
            enabled: true,
            showModal: false,
            onChange(value: string | null): void {
            },
            wsRequestedValue: MaybeCls.nothing()
        }
    }
}

const MOCK_FNR_1 = '16012050147';
const MOCK_FNR_2 = '19012050073';

describe('saga - root', () => {
    const spy = new SpyMiddleware();
    const mock = FetchMock.configure({
        middleware: spy.middleware
    });
    const context: Context = {mock, spy, contextholder: {aktivBruker: null, aktivEnhet: null}};

    beforeEach(() => {
        mock.reset();
        spy.reset();
        context.contextholder.aktivEnhet = null;
        context.contextholder.aktivBruker = null;
    });

    it('onsketFnr: null, aktivBruker: error => gi feilmelding og stateFnr: Nothing', async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr(null);
        gittContextholder(context, {aktivBruker: null, aktivEnhet: null}, true);

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/FEILMELDING", data: 'Kunne ikke hente ut person i kontekst'});
        expect(dispatched[1]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.nothing() }}});

        expect(props.onChange).toBeCalledTimes(0);
        expect(spy.size()).toBe(1);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
    });

    it('onsketFnr: null, aktivBruker: null => stateFnr: Nothing', async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr(null);
        gittContextholder(context, {aktivBruker: null, aktivEnhet: null});

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.nothing() }}});
        expect(props.onChange).toBeCalledTimes(0);
        expect(spy.size()).toBe(1);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
    });

    it(`onsketFnr: null, aktivBruker: ${MOCK_FNR_1} => stateFnr: Just(${MOCK_FNR_1})`, async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr('');
        gittContextholder(context, {aktivBruker: MOCK_FNR_1, aktivEnhet: null});

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.just(MOCK_FNR_1) }}});
        expect(props.onChange).toBeCalledTimes(1);
        expect(spy.size()).toBe(1);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
    });

    it(`onsketFnr: ${MOCK_FNR_2}, aktivBruker: ${MOCK_FNR_1} => stateFnr: Just(${MOCK_FNR_2})`, async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr(MOCK_FNR_2);
        gittContextholder(context, {aktivBruker: MOCK_FNR_1, aktivEnhet: null});

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.just(MOCK_FNR_2) }}});
        expect(props.onChange).toBeCalledTimes(1);
        expect(spy.size()).toBe(2);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
        expect(spy.called(MatcherUtils.post(`${modiacontextholderUrl}/context` as MatcherUrl))).toBeTruthy();
        expect(context.contextholder.aktivBruker).toBe(MOCK_FNR_2);
    });

    it(`onsketFnr: ${MOCK_FNR_1}, aktivBruker: ${MOCK_FNR_1} => stateFnr: Just(${MOCK_FNR_1}), ikke oppdater contextholder`, async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr(MOCK_FNR_1);
        gittContextholder(context, {aktivBruker: MOCK_FNR_1, aktivEnhet: null});

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.just(MOCK_FNR_1) }}});
        expect(props.onChange).toBeCalledTimes(1);
        expect(spy.size()).toBe(1);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
        expect(context.contextholder.aktivBruker).toBe(MOCK_FNR_1);
    });

    it(`onsketFnr: invalid, aktivBruker: ${MOCK_FNR_1} => stateFnr: Just(invalid), ikke kall onChange eller oppdater contextholder`, async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr('12345678910');
        gittContextholder(context, {aktivBruker: MOCK_FNR_1, aktivEnhet: null});

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/FEILMELDING", data: 'Fødselsnummeret er ikke gyldig'});
        expect(dispatched[1]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.just('12345678910') }}});
        expect(props.onChange).toBeCalledTimes(0);
        expect(spy.size()).toBe(1);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
        expect(context.contextholder.aktivBruker).toBe(MOCK_FNR_1);
    });

    it(`onsketFnr: ${MOCK_FNR_1}, aktivBruker: error => stateFnr: Just(${MOCK_FNR_1})`, async () => {
        const state = gittInitialState();
        const props = gittOnsketFnr(MOCK_FNR_1);
        gittContextholder(context, {aktivBruker: MOCK_FNR_1, aktivEnhet: null}, true);

        const dispatched = await run(initialSyncFnr, state, props);

        expect(dispatched[0]).toMatchObject({type: "REDUX/FEILMELDING", data: 'Kunne ikke hente ut person i kontekst'});
        expect(dispatched[1]).toMatchObject({type: "REDUX/UPDATESTATE", data: { fnr: { value: MaybeCls.just(MOCK_FNR_1) }}});
        expect(props.onChange).toBeCalledTimes(1);
        expect(spy.size()).toBe(2);
        expect(spy.called(MatcherUtils.get(AKTIV_BRUKER_URL as MatcherUrl))).toBeTruthy();
        expect(spy.called(MatcherUtils.post(`${modiacontextholderUrl}/context` as MatcherUrl))).toBeTruthy();
        expect(context.contextholder.aktivBruker).toBe(MOCK_FNR_1);
    });
});
