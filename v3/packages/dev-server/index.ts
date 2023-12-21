/* eslint-disable @typescript-eslint/no-explicit-any */
import { CustomServer } from './CustomServer';
import { BadRequestResponse } from './responses/BadRequestResponse';
import { InternalServerErrorResponse } from './responses/InternalServerErrorResponse';
import { SuccessResponse } from './responses/SuccessResponse';
import { Enhet, Veileder } from '../internarbeidsflate-decorator-v3/src/index';
import { NotFoundResponse } from './responses/NotFoundResponse';
import { BunServerWebsocket } from './types';
type Metadata = { ident: string };

const enheter: Enhet[] = [
  {
    enhetId: 'IT29000',
    navn: 'IT',
  },
  {
    enhetId: 'FAKE',
    navn: 'FAKE AVDELING',
  },
];

const serve = () => {
  const clients: Record<string, BunServerWebsocket> = {};

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

  app.get('/modiacontextholder/:ident/details', (request) => {
    if (!request.haveParam('ident')) {
      return new BadRequestResponse('Missing ident');
    }

    const response: Veileder = {
      navn: 'Test Behandler',
      ident: request.params['ident'],
      enheter,
      etternavn: 'Behandler',
      fornavn: 'Test',
    };

    return new SuccessResponse(response);
  });

  app.get('/modiacontextholder/:ident/aktiv-bruker', (request) => {
    if (!request.haveParam('ident')) {
      return new BadRequestResponse('Missing ident');
    }

    return new SuccessResponse('10108000398');
  });

  app.get('/modiacontextholder/:ident/aktiv-enhet', (request) => {
    if (!request.haveParam('ident')) {
      return new BadRequestResponse('Missing ident');
    }

    return new SuccessResponse(enheter[0].enhetId);
  });

  app.get('/modiacontextholder/enhet/:enhetId', (request) => {
    if (!request.haveParam('enhetId')) {
      return new BadRequestResponse('Missing enhetId');
    }

    const response = enheter.find(
      (enhet) => enhet.enhetId === request.params.enhetId,
    );

    if (!response) {
      return new NotFoundResponse();
    }

    return new SuccessResponse(response);
  });

  app.post('/modiacontextholder', async (request) => {
    if (!request.body) {
      return new BadRequestResponse('No body provided');
    }

    const {
      fnr,
      enhet,
    }: { fnr?: string | undefined; enhet?: string | undefined } =
      await Bun.readableStreamToJSON(request.body);

    if (enhet) broadCastToClients({ type: 'NY_AKTIV_ENHET', payload: enhet });
    if (fnr) broadCastToClients({ type: 'NY_AKTIV_BRUKER', payload: fnr });

    return new SuccessResponse({ fnr, enhet });
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
