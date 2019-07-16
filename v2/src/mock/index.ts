import FetchMock, { JSONObject, Middleware, MiddlewareUtils } from 'yet-another-fetch-mock';
import {AktorIdResponse, Enheter, Me} from '../domain';

const loggingMiddleware: Middleware = (request, response) => {
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
    middleware: MiddlewareUtils.combine(
        MiddlewareUtils.delayMiddleware(500),
        loggingMiddleware
    )
});

const me: Me & JSONObject = { ident: 'Z999999', navn: 'Fornavn Ettersen', fornavn: 'Fornavn', etternavn: 'Ettersen'};
const enheter: Enheter & JSONObject = {
    ident: 'Z999999',
    enhetliste: [
        { enhetId: '0219', navn: 'NAV Bærum' },
        { enhetId: '0299', navn: 'NAV IT og utvikling' },
    ]
};

mock.get('/hode/me', me);
mock.get('/hode/enheter', enheter);
mock.get('/aktoerregister/api/v1/identer', (args) => {
    const fnr = (args.init!.headers! as Record<string, string>)['Nav-Personidenter'];
    const data: AktorIdResponse = {
        [fnr]: {
            feilmelding: null,
            identer: [
                { gjeldende: true, ident: `000${fnr}000`, identgruppe: 'AktoerId' }
            ]
        }
    };
    return data;
});
