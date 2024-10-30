import { http, ws, WebSocketHandler, HttpHandler, HttpResponse } from 'msw';
import { FailureConfig } from './mock-error-config';
import { Veileder } from '../types/Veileder';
import WS from 'vitest-websocket-mock';
export const urlPrefix = 'http://localhost:4000';

export const mockMe: Veileder = {
  ident: 'Z999999',
  navn: 'Fornavn Ettersen',
  fornavn: 'Fornavn',
  etternavn: 'Ettersen',
  enheter: [
    { enhetId: '0219', navn: 'NAV Bærum' },
    { enhetId: '0118', navn: 'NAV Aremark' },
    { enhetId: '0604', navn: 'NAV Kongsberg' },
    { enhetId: '0602', navn: 'NAV Drammen' },
  ],
};

const getUrl = (path: string) => `${urlPrefix}/api${path}`;

const getErrorResponse = (status = 500) => {
  return new HttpResponse(null, { status });
};

const getSuccessResponse = (
  { status, body }: { status?: number | null; body?: unknown } = {
    status: 200,
    body: null,
  },
) => {
  return new HttpResponse(JSON.stringify(body ?? {}), {
    status: status ?? 200,
  });
};

type Context = { aktivEnhet: string | null; aktivBruker: string | null };
let context: Context = { aktivEnhet: '0118', aktivBruker: '10108000398' };

export const getMockContext = () => context;

export const updateMockContext = (newContext: Partial<Context>) => {
  context = {
    ...context,
    ...newContext,
  };
};

export const wsLink = ws.link('ws://localhost:4000/ws/*');

export const getHandlers = (
  errorConfig: FailureConfig,
  ws?: WS,
): (HttpHandler | WebSocketHandler)[] => {
  return [
    http.post(getUrl('/context'), async ({ request }) => {
      const { eventType, verdi } = (await request.json()) as {
        eventType: 'NY_AKTIV_ENHET' | 'NY_AKTIV_BRUKER';
        verdi: string;
      };
      if (eventType === 'NY_AKTIV_ENHET') {
        if (errorConfig.contextholder.updateEnhet) {
          return getErrorResponse();
        }
        context.aktivEnhet = verdi;
        wsLink.broadcast('NY_AKTIV_ENHET');
        ws?.send('NY_AKTIV_ENHET');
        return getSuccessResponse();
      } else if (eventType === 'NY_AKTIV_BRUKER') {
        if (errorConfig.contextholder.updateBruker) {
          return getErrorResponse();
        }
        context.aktivBruker = verdi;
        wsLink.broadcast('NY_AKTIV_BRUKER');
        ws?.send('NY_AKTIV_BRUKER');
        return getSuccessResponse();
      } else {
        return getErrorResponse();
      }
    }),
    http.delete(getUrl('/context/aktivenhet'), () => {
      if (errorConfig.contextholder.deleteEnhet) {
        return getErrorResponse();
      }
      context.aktivEnhet = null;
      wsLink.broadcast('NY_AKTIV_ENHET');
      ws?.send('NY_AKTIV_ENHET');
      return getSuccessResponse();
    }),
    http.delete(getUrl('/context/aktivbruker'), () => {
      if (errorConfig.contextholder.deleteBruker) {
        return getErrorResponse();
      }
      context.aktivBruker = null;
      wsLink.broadcast('NY_AKTIV_BRUKER');
      ws?.send('NY_AKTIV_BRUKER');
      return getSuccessResponse();
    }),
    http.get(getUrl('/context/v2/aktivenhet'), () => {
      if (errorConfig.contextholder.getEnhet) {
        return getErrorResponse();
      }
      return getSuccessResponse({ body: { aktivEnhet: context.aktivEnhet } });
    }),
    http.get(getUrl('/context/v2/aktivbruker'), () => {
      if (errorConfig.contextholder.getBruker) {
        return getErrorResponse();
      }
      return getSuccessResponse({ body: { aktivBruker: context.aktivBruker } });
    }),
    http.get(getUrl(''), () => {
      if (errorConfig.contextholder.get) {
        return getErrorResponse();
      }
      return getSuccessResponse({
        body: {
          aktivEnhet: context.aktivEnhet,
          aktivBruker: context.aktivBruker,
        },
      });
    }),
    http.get(getUrl('/context/aktor/v2'), async ({ request }) => {
      const { fnr } = (await request.json()) as { fnr: string };
      const data = {
        fnr,
        aktorId: `000${fnr}000`,
      };
      if (errorConfig.aktorIdEndpoint) {
        return getErrorResponse();
      }
      return getSuccessResponse({ body: data });
    }),
    http.get(getUrl('/decorator'), () => {
      if (errorConfig.meEndpoint) {
        return getErrorResponse();
      }
      return getSuccessResponse({ body: mockMe });
    }),
    http.get(getUrl('/context/enhet/:enhetId'), ({ params }) => {
      const { enhetId } = params;
      if (errorConfig.enhetEndpoint) {
        return getErrorResponse();
      }
      const enhet = mockMe.enheter.find((enhet) => enhet.enhetId === enhetId);
      if (!enhet) {
        return getErrorResponse(404);
      }
      return getSuccessResponse({ body: enhet });
    }),

    wsLink.addEventListener('connection', () => {}),
  ];
};
