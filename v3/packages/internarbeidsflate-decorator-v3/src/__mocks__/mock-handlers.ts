import { http, HttpHandler, HttpResponse } from 'msw'
import WS from 'vitest-websocket-mock';
import { FailureConfig } from './mock-error-config';
import { Veileder } from '../types/Veileder';
export const urlPrefix = 'http://localhost:8080';

export const mockMe: Veileder = {
    ident: 'Z999999',
    navn: 'Fornavn Ettersen',
    fornavn: 'Fornavn',
    etternavn: 'Ettersen',
    enheter: [
        { enhetId: '0219', navn: 'NAV Bærum' },
        { enhetId: '0118', navn: 'NAV Aremark' },
        { enhetId: '0604', navn: 'NAV Kongsberg' },
        { enhetId: '0602', navn: 'NAV Drammer' }
    ]
};


const getUrl = (path: string) => `${urlPrefix}/modiacontextholder/api/context${path}`

const getErrorResponse = (status = 500) => {
    return new HttpResponse(null, { status })
}

const getSuccessResponse = ({ status, body }: { status?: number | null, body?: any } = { status: 200, body: null }) => {
    return new HttpResponse(JSON.stringify(body ?? {}), { status: status ?? 200 })
}

type Context = { aktivEnhet: string | null; aktivBruker: string | null };
const context: Context = { aktivEnhet: '0118', aktivBruker: '10108000398' };

export const updateMockContext = (key: keyof Context, value: string | null) => context[key] = value

const controlSignal = (data: 'NY_AKTIV_ENHET' | 'NY_AKTIV_BRUKER') => {
    return JSON.stringify({ type: 'control', data });
}

export const getHandlers = (ws: WS, errorConfig: FailureConfig): HttpHandler[] => {
    ws.on('message', console.log)
    return [
        http.post(getUrl(''), async ({ request }) => {
            const { eventType, verdi } = await request.json() as { eventType: 'NY_AKTIV_ENHET' | 'NY_AKTIV_BRUKER', verdi: string }
            if (eventType === 'NY_AKTIV_ENHET') {
                if (errorConfig.contextholder.updateEnhet) {
                    return getErrorResponse()
                }
                context.aktivEnhet = verdi
                ws.send(controlSignal('NY_AKTIV_ENHET'))
                return getSuccessResponse()
            }
            else if (eventType === 'NY_AKTIV_BRUKER') {
                if (errorConfig.contextholder.updateBruker) {
                    return getErrorResponse()
                }
                context.aktivBruker = verdi
                ws.send(controlSignal('NY_AKTIV_BRUKER'))
                return getSuccessResponse()
            }
            else {
                return getErrorResponse()
            }
        }),
        http.delete(getUrl('/aktivenhet'), () => {
            if (errorConfig.contextholder.deleteEnhet) {
                return getErrorResponse()
            }
            context.aktivEnhet = null
            ws.send(controlSignal('NY_AKTIV_ENHET'))
            return getSuccessResponse()
        }),
        http.delete(getUrl('/aktivbruker'), () => {
            if (errorConfig.contextholder.deleteBruker) {
                return getErrorResponse()
            }
            context.aktivBruker = null
            ws.send(controlSignal('NY_AKTIV_BRUKER'))
            return getSuccessResponse()
        }),
        http.get(getUrl('/aktivenhet'), () => {
            if (errorConfig.contextholder.getEnhet) {
                return getErrorResponse()
            }
            return getSuccessResponse({ body: { aktivEnhet: context.aktivEnhet } })
        }),
        http.get(getUrl('/aktivbruker'), () => {
            console.log('HALLO')
            if (errorConfig.contextholder.getBruker) {
                return getErrorResponse()
            }
            return getSuccessResponse({ body: { aktivBruker: context.aktivBruker } })
        }),
        http.get(getUrl(''), () => {
            if (errorConfig.contextholder.get) {
                return getErrorResponse()
            }
            return getSuccessResponse({ body: { aktivEnhet: context.aktivEnhet, aktivBruker: context.aktivBruker } })
        }),
        http.get(getUrl('/aktor/v2'), async ({ request }) => {
            const { fnr } = await request.json() as { fnr: string }
            const data = {
                fnr,
                aktorId: `000${fnr}000`
            };
            if (errorConfig.aktorIdEndpoint) {
                return getErrorResponse()
            }
            return getSuccessResponse({ body: data })
        }),
        http.get(getUrl('/decorator'), () => {
            if (errorConfig.meEndpoint) {
                return getErrorResponse()
            }
            return getSuccessResponse({ body: mockMe })
        }),
        http.get(getUrl('/enhet/:enhetId'), ({ params }) => {
            const { enhetId } = params
            if (errorConfig.enhetEndpoint) {
                return getErrorResponse()
            }
            const enhet = mockMe.enheter.find((enhet) => enhet.enhetId === enhetId)
            if (!enhet) {
                return getErrorResponse(404)
            }
            return getSuccessResponse({ body: enhet })
        }),
        http.post(getUrl('/bytt-bruker-nokkel'), async ({ request }) => {
            const { userKey } = await request.json() as { userKey: string }
            return getSuccessResponse({ body: `10108000398` })
        })

    ]
}