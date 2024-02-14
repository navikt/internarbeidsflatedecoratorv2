/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomServer } from './CustomServer';
import { BadRequestResponse } from './responses/BadRequestResponse';
import { InternalServerErrorResponse } from './responses/InternalServerErrorResponse';
import { SuccessResponse } from './responses/SuccessResponse';
import { mockMe } from '../internarbeidsflate-decorator-v3/src/__mocks__/mock-handlers'
import { NotFoundResponse } from './responses/NotFoundResponse';
import { BunServerWebsocket } from './types';

type Metadata = { ident: string };

const serve = () => {
  type Context = { aktivEnhet: string | undefined; aktivBruker: string | undefined };
  const context: Context = { aktivEnhet: '0118', aktivBruker: '10108000398' };
  const clients: Record<string, BunServerWebsocket> = {};
  const codeToFnr: Record<string, string> = {}

  const app = new CustomServer();

  app.setAllowedMethods('DELETE', 'GET', 'POST', 'PUT', 'OPTIONS');
  app.setAllowedOrigin('*');

  app.get('/ws/:ident', (request) => {
    if (!request.haveParam('ident')) {
      return new BadRequestResponse('Missing ident');
    }
    const result = request.upgrade<Metadata>({ ident: request.params.ident });
    if (!result) {
      return new InternalServerErrorResponse('Failed to upgrade request');
    }

    return new SuccessResponse();
  });

  app.get('/modiacontextholder/api/decorator', () => {
    return new SuccessResponse(mockMe);
  });

  app.get('/modiacontextholder/api/context/v2/aktivbruker', () => {
    return new SuccessResponse({aktivBruker: context.aktivBruker });
  });

  app.get('/modiacontextholder/api/context/v2/aktivenhet', () => {
    return new SuccessResponse({aktivEnhet: context.aktivEnhet });
  });

  app.get('/modiacontextholder/api/context/enhet/:enhetId', (request) => {
    if (!request.haveParam('enhetId')) {
      return new BadRequestResponse('Missing enhetId');
    }

    const response = mockMe.enheter.find(
      (enhet) => enhet.enhetId === request.params.enhetId,
    );

    if (!response) {
      return new NotFoundResponse();
    }

    return new SuccessResponse(response);
  });

  app.post('/modiacontextholder/api/context', async (request) => {
    if (!request.body) {
      return new BadRequestResponse('No body provided');
    }

    const {
      eventType,
      verdi,
    }: { eventType: 'NY_AKTIV_ENHET' | 'NY_AKTIV_BRUKER'; verdi: string } =
      await Bun.readableStreamToJSON(request.body);

    if (eventType === 'NY_AKTIV_BRUKER') {
      context.aktivBruker = verdi
    } else if (eventType === 'NY_AKTIV_ENHET') {
      context.aktivEnhet = verdi
    }
    broadCastToClients({ type: 'control', data: eventType });

    return new SuccessResponse({...context});
  });

  app.post('/modiacontextholder/api/fnr-code/retrieve', async (request) => {
    if (!request.body) {
      return new BadRequestResponse('No body provided');
    }

    const { code }: { code: string } = await Bun.readableStreamToJSON(request.body);

    const fnr = codeToFnr[code]

    if (!fnr) {
      return new NotFoundResponse()
    }

    return new SuccessResponse({ fnr, code });
  });

  app.post('/modiacontextholder/api/fnr-code/generate', async (request) => {
    if (!request.body) {
      return new BadRequestResponse('No body provided');
    }

    const { fnr }: { fnr: string } = await Bun.readableStreamToJSON(request.body);

    const code = crypto.randomUUID()

    codeToFnr[code] = fnr

    return new SuccessResponse({ fnr, code });
  });
  app.addWebSocketHandler<Metadata>('/ws/:ident', {
    open: (ws, params) => {
      const ident = params.ident;
      if (!ident) {
        return;
      }
      ws.subscribe(ident);
      ws.send(JSON.stringify({ type: 'Ping' }));
      clients[ident] = ws;
    },
    message: (ws, message, params) => {
      const ident = params.ident;
      if (!ident) {
        return;
      }
      ws.publish(ident, message);
    },
    close: (ws, params) => {
      const ident = params.ident;
      if (!ident) {
        return;
      }
      delete clients[ident];
      ws.unsubscribe(ident);
    },
  });

  const broadCastToClients = (message: any) => {
    const stringifiedMessage = JSON.stringify(message);
    for (const client of Object.values(clients)) {
      client.send(stringifiedMessage);
    }
  };

  app.listen();
};

serve();
