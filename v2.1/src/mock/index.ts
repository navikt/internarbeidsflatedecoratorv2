import FetchMock, {
    JSONObject,
    Middleware,
    MiddlewareUtils,
    ResponseUtils
} from 'yet-another-fetch-mock';
import { AktorIdResponse, Saksbehandler } from '../internal-domain';
import { setupWsControlAndMock } from './context-mock';
import { finnMiljoStreng } from '../utils/url-utils';
import failureConfig from './mock-error-config';

console.log('============================');
console.log('Using yet-another-fetch-mock');
console.log('============================');

const originalLoggingMiddleware = MiddlewareUtils.loggingMiddleware();
const loggingMiddleWare: Middleware = (request, response) => {
    if (request.url.endsWith('fromMock')) {
        return response;
    }
    return originalLoggingMiddleware(request, response);
};
const mock = FetchMock.configure({
    enableFallback: false,
    middleware: MiddlewareUtils.combine(MiddlewareUtils.delayMiddleware(200), loggingMiddleWare)
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

mock.get(
    '/modiacontextholder/api/decorator',
    ResponseUtils.combine(
        ResponseUtils.statusCode(failureConfig.meEndpoint ? 500 : 200),
        ResponseUtils.statusText(failureConfig.meEndpoint ? 'Internal Server Error' : 'Ok'),
        ResponseUtils.json(failureConfig.meEndpoint ? null : me)
    )
);

mock.get(`https://app${finnMiljoStreng()}.adeo.no/aktoerregister/api/v1/identer`, (args) => {
    const fnr = (args.init!.headers! as Record<string, string>)['Nav-Personidenter'];
    const data: AktorIdResponse = {
        [fnr]: {
            feilmelding: null,
            identer: [{ gjeldende: true, ident: `000${fnr}000`, identgruppe: 'AktoerId' }]
        }
    };

    return new Promise((resolve, reject) => {
        const callback = failureConfig.aktorIdEndpoint ? reject : resolve;
        callback({
            status: failureConfig.aktorIdEndpoint ? 500 : 200,
            statusText: failureConfig.aktorIdEndpoint ? 'Internal Server Error' : 'Ok',
            body: JSON.stringify(failureConfig.aktorIdEndpoint ? null : data)
        });
    });
});

setupWsControlAndMock(mock, failureConfig);
