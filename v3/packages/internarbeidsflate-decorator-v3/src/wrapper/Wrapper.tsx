import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@navikt/ds-react';
import { useTempValue } from './hooks/useTempValue';
import { useInitialSyncContextholderValues } from '../hooks/useInitialSyncContextholderValues';
import { WebSocketWrapper } from '../api/WebSocketWrapper';
import Decorator from '../App'
const WS_URL = 'ws://localhost:3000/ws';

type MessageType = 'NY_AKTIV_BRUKER' | 'NY_AKTIV_ENHET';

const Wrapper: React.FC = () => {
  const [enhet, tmpEnhet, setTmpEnhet, makeTheEnhetChange] = useTempValue('');
  const [fnr, tmpFnr, setTmpFnr, makeTheFnrChange] = useTempValue('');
  const [ident, tmpIdent, setTmpIdent, makeTheIdentChange] = useTempValue('');
  const [wsEnhet, setWsEnhet] = useState('');
  const [wsFnr, setWsFnr] = useState('');
  const [websocketHandler, setWebsocketHandler] = useState<WebSocketWrapper>();
  const [wsConnected, setWsConntected] = useState(false);
  const [wsMessages, setWsMessages] = useState<string[]>([]);
  const [propsUpdates, setPropsUpdates] = useState<string[]>([]);

  useInitialSyncContextholderValues();

  useEffect(() => {
    if (ident) {
      const websocketHandler = new WebSocketWrapper(`${WS_URL}/${ident}`, {
        onOpen: () => setWsConntected(true),
        onClose: () => setWsConntected(false),
        onMessage: (event) => {
          setWsMessages((messages) => {
            return [...messages, event.data];
          });
        },
      });
      websocketHandler.open();
      setWebsocketHandler(websocketHandler);
      return () => websocketHandler.close();
    }
  }, [ident]);

  const sendMessage = (type: MessageType, payload: string | undefined) => {
    websocketHandler?.sendMessage(JSON.stringify({ type, payload }));
  };

  const sendNewEnhet = () => {
    sendMessage('NY_AKTIV_ENHET', wsEnhet);
  };

  const sendNewFnr = () => {
    sendMessage('NY_AKTIV_BRUKER', wsFnr);
  };

  return (
    <>
      <div className="dr-w-full dr-top-0">
        <Decorator
          appName="Test app"
          markup={{ etterSokefelt: '<button>Min knapp</button>' }}
          enableHotkeys
          showEnheter={true}
          showSearchArea={true}
          showHotkeys={true}
          environment={'q2'}
          urlFormat={'LOCAL'}
          enhet={enhet}
          fnr={fnr}
          veiledersIdent={ident}
          onEnhetChanged={(enhet) => {
            setTmpEnhet(enhet ?? '', true);
            setPropsUpdates((props) => [
              ...props,
              `Ny enhet fra dekoratør: ${enhet}`,
            ]);
          }}
          onFnrChanged={(fnr) => {
            setTmpFnr(fnr ?? '', true);
            setPropsUpdates((props) => [
              ...props,
              `Ny fnr fra dekoratør: ${fnr}`,
            ]);
          }}
        />
      </div>
      <div className="dr-fixed dr-bottom-0 dr-p-4 dr-border dr-rounded-md dr-border-gray-700 dr-w-full -dr-z-10">
        <div className="dr-text-center dr-text-2xl dr-mb-6">Simulator</div>
        <div>
          <div className="dr-text-center dr-w-full dr-text-lg">Wrapper</div>
          <div className="dr-flex dr-justify-center dr-w-full">
            <div className="dr-mx-2">
              <TextField
                className="dr-mb-2"
                label="Veileders ident"
                value={tmpIdent}
                onChange={(e) => setTmpIdent(e.target.value)}
              />
              <Button onClick={makeTheIdentChange}>Endre veileder</Button>
            </div>
            <div className="dr-mx-2">
              <TextField
                className="dr-mb-2"
                label="Enhet"
                value={tmpEnhet}
                onChange={(e) => setTmpEnhet(e.target.value)}
              />
              <Button onClick={makeTheEnhetChange}>Endre enhet</Button>
            </div>
            <div className="dr-mx-2">
              <TextField
                className="dr-mb-2"
                label="Aktivt fnr"
                value={tmpFnr}
                onChange={(e) => setTmpFnr(e.target.value)}
              />
              <Button onClick={makeTheFnrChange}>Endre fnr</Button>
            </div>
            <div className="dr-mx-2">
              Oppdateringer fra dekoratør
              <ul className="dr-overflow-y-auto dr-h-32 dr-w-96">
                {propsUpdates.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <hr className="dr-my-12" />
        <div className="dr-text-center dr-w-full dr-mt-8 dr-mb-2">WS oppdatering</div>
        <div className="dr-text-center">WS tilkoblet: {`${wsConnected}`}</div>
        <div className="dr-flex dr-justify-center dr-w-full">
          <div className="dr-mx-2">
            <TextField
              className="dr-mb-2"
              label="Aktiv enhet"
              value={wsEnhet}
              onChange={(e) => setWsEnhet(e.target.value)}
            />
            <Button onClick={sendNewEnhet}>Endre aktiv enhet</Button>
          </div>
          <div className="dr-mx-2">
            <TextField
              className="dr-mb-2"
              label="Aktivt fnr"
              value={wsFnr}
              onChange={(e) => setWsFnr(e.target.value)}
            />
            <Button onClick={sendNewFnr}>Endre aktivt fnr</Button>
          </div>
          <div className="dr-mx-2">
            Innkommende meldinger
            <ul className="dr-overflow-y-auto dr-h-32 dr-w-96">
              {wsMessages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Wrapper;
