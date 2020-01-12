import FetchMock, { JSONObject, Middleware, MiddlewareUtils } from 'yet-another-fetch-mock';
import { AktorIdResponse, Saksbehandler } from '../domain';
import { setupWsControlAndMock } from './context-mock';
import { finnMiljoStreng } from '../utils/url-utils';

const loggingMiddleware: Middleware = (request, response) => {
    if (request.url.endsWith('fromMock')) {
        return response;
    }
    // tslint:disable
    console.groupCollapsed(`${request.method} ${request.url}`);
    console.groupCollapsed('config');
    console.log('queryParams', request.queryParams);
    console.log('pathParams', request.pathParams);
    console.log('body', request.body);
    if (request.init) {
        console.log('header', request.init.headers);
    }
    console.groupEnd();

    try {
        console.log('response', JSON.parse(response.body));
    } catch (e) {
        console.log('response', response);
    }

    console.groupEnd();
    // tslint:enable
    return response;
};

console.log('============================');
console.log('Using yet-another-fetch-mock');
console.log('============================');
const mock = FetchMock.configure({
    enableFallback: false,
    middleware: MiddlewareUtils.combine(MiddlewareUtils.delayMiddleware(200), loggingMiddleware)
});

const me: Saksbehandler & JSONObject = {
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

mock.get('/modiacontextholder/api/decorator', me);
mock.get(`https://app${finnMiljoStreng()}.adeo.no/aktoerregister/api/v1/identer`, (args) => {
    const fnr = (args.init!.headers! as Record<string, string>)['Nav-Personidenter'];
    const data: AktorIdResponse = {
        [fnr]: {
            feilmelding: null,
            identer: [{ gjeldende: true, ident: `000${fnr}000`, identgruppe: 'AktoerId' }]
        }
    };
    return data;
});

setupWsControlAndMock(mock);
