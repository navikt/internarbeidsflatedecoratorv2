import FetchMock, { MatcherUrl, MatcherUtils, SpyMiddleware } from 'yet-another-fetch-mock';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { urls } from './api';
import { AktivBruker } from '../internal-domain';
import { State } from './index';
import { RecursivePartial } from './utils';
import { run } from './saga-test-utils';
import { hentAktorId } from './fnr-update-sagas';

const MOCK_FNR_1 = '16012050147';
const MOCK_AKTOR_ID = '00016012050147000';

function gittContextholder(context: Context, aktiveContext: AktivBruker, error: boolean = false) {
    context.contextholder.aktivBruker = aktiveContext.aktivBruker;
    if (error) {
        context.mock.get(`/modiacontextholder/api/decorator/aktor/${MOCK_FNR_1}`, (_, res, ctx) =>
            res(ctx.status(500))
        );
    } else {
        context.mock.get(`/modiacontextholder/api/decorator/aktor/${MOCK_FNR_1}`, (_, res, ctx) =>
            res(
                ctx.json({
                    aktorId: MOCK_AKTOR_ID
                })
            )
        );
    }
}

type ContextholderValue = AktivBruker;

interface Context {
    mock: FetchMock;
    spy: SpyMiddleware;
    contextholder: ContextholderValue;
}

function gittInitialState(fnr?: string | null): RecursivePartial<State> {
    return {
        appdata: {
            initialized: true,
            fnr: {
                enabled: true,
                value: fnr ? MaybeCls.just(fnr) : MaybeCls.nothing()
            },
            data: {
                aktorId: MaybeCls.nothing()
            }
        }
    };
}

describe('Saga: hentAktorId', () => {
    const spy = new SpyMiddleware();
    const mock = FetchMock.configure({
        middleware: spy.middleware
    });
    const context: Context = { mock, spy, contextholder: { aktivBruker: null } };

    beforeEach(() => {
        mock.reset();
        spy.reset();
        context.contextholder.aktivBruker = null;
    });

    it('henter aktorId for fnr', async () => {
        const state = gittInitialState(MOCK_FNR_1);
        gittContextholder(context, { aktivBruker: MOCK_FNR_1 });

        const dispatched = await run(hentAktorId, state);

        expect(dispatched[0]).toMatchObject({
            type: 'REDUX/AKTORIDDATA',
            data: {
                aktorId: MOCK_AKTOR_ID
            }
        });

        expect(spy.size()).toBe(1);
        expect(
            spy.called(MatcherUtils.get(urls.aktorIdUrl(MOCK_FNR_1) as MatcherUrl))
        ).toBeTruthy();
    });

    it('klarer ikke å hente aktorId, viser feilmelding', async () => {
        const state = gittInitialState(MOCK_FNR_1);
        gittContextholder(context, { aktivBruker: MOCK_FNR_1 }, true);

        const dispatched = await run(hentAktorId, state);

        expect(dispatched[0]).toMatchObject({
            type: 'REDUX/FEILMELDING/LEGG_TIL',
            data: {
                kode: 'A400',
                melding: 'Kunne ikke hente aktør-identifikator for bruker'
            }
        });

        expect(spy.size()).toBe(1);
        expect(
            spy.called(MatcherUtils.get(urls.aktorIdUrl(MOCK_FNR_1) as MatcherUrl))
        ).toBeTruthy();
    });

    it('nullstiller aktorId når fnr er null', async () => {
        const state = gittInitialState();
        gittContextholder(context, { aktivBruker: null });

        const dispatched = await run(hentAktorId, state);

        expect(dispatched[0]).toMatchObject({
            type: 'REDUX/AKTORIDDATA',
            data: null
        });

        expect(spy.size()).toBe(0);
    });
});
