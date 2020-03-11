import FetchMock from 'yet-another-fetch-mock';
import { FailureConfig } from './mock-error-config';

function controlSignal(data: object | string) {
    return JSON.stringify({ type: 'control', data });
}

function updateContext(body: object) {
    fetch('/modiacontextholder/api/context?fromMock', {
        credentials: 'include',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    }).catch((error) => {
        console.error(error);
    });
}

function setupControls() {
    const controlDiv = document.createElement('div');
    controlDiv.id = 'mock-control';
    controlDiv.style.position = 'absolute';
    controlDiv.style.bottom = '0px';
    controlDiv.style.width = 'calc(100% - 4rem)';
    controlDiv.style.marginLeft = '2rem';

    const header = document.createElement('h1');
    header.innerText = 'Controls';
    controlDiv.appendChild(header);

    const buttonDiv = document.createElement('div');

    const guttButton = document.createElement('button');
    guttButton.innerText = 'Sendt FNR 01011950120 (gutt)';
    guttButton.addEventListener('click', () =>
        updateContext({ verdi: '01011950120', eventType: 'NY_AKTIV_BRUKER' })
    );

    const jenteButton = document.createElement('button');
    jenteButton.innerText = 'Sendt FNR 01011950201 (jente)';
    jenteButton.addEventListener('click', () =>
        updateContext({ verdi: '01011950201', eventType: 'NY_AKTIV_BRUKER' })
    );

    const barumEnhet = document.createElement('button');
    barumEnhet.innerText = 'Sendt ENHET 0219';
    barumEnhet.addEventListener('click', () =>
        updateContext({ verdi: '0219', eventType: 'NY_AKTIV_ENHET' })
    );

    const aremarkEnhet = document.createElement('button');
    aremarkEnhet.innerText = 'Sendt ENHET 0118';
    aremarkEnhet.addEventListener('click', () =>
        updateContext({ verdi: '0118', eventType: 'NY_AKTIV_ENHET' })
    );

    const clearBothLogs = document.createElement('button');
    clearBothLogs.innerText = 'Clear both logs';
    clearBothLogs.addEventListener('click', () => {
        const wsTextarea = document.getElementById('mock-control__ws-log')! as HTMLTextAreaElement;
        const contextTextarea = document.getElementById(
            'mock-control__context-log'
        )! as HTMLTextAreaElement;
        wsTextarea.value = '';
        contextTextarea.value = '';
    });

    buttonDiv.appendChild(guttButton);
    buttonDiv.appendChild(jenteButton);
    buttonDiv.appendChild(barumEnhet);
    buttonDiv.appendChild(aremarkEnhet);
    buttonDiv.appendChild(clearBothLogs);

    controlDiv.appendChild(buttonDiv);

    const logs = document.createElement('div');
    logs.id = 'mock-control__logs';
    logs.style.display = 'flex';
    controlDiv.appendChild(logs);

    const wsLog = document.createElement('div');
    wsLog.id = 'mock-control__ws-log-container';
    wsLog.style.flex = '1';
    logs.appendChild(wsLog);

    const wsLogHeader = document.createElement('h2');
    wsLogHeader.innerText = 'WS log';

    const wsLogClear = document.createElement('button');
    wsLogClear.id = 'mock-control_ws-log-clear';
    wsLogClear.innerText = 'Clear';
    wsLogClear.addEventListener('click', () => {
        const textarea = document.getElementById('mock-control__ws-log')! as HTMLTextAreaElement;
        textarea.value = '';
    });
    wsLogHeader.appendChild(wsLogClear);

    const WStextarea = document.createElement('textarea');
    WStextarea.id = 'mock-control__ws-log';
    WStextarea.style.width = '100%';
    WStextarea.style.height = '10rem';
    wsLog.appendChild(wsLogHeader);
    wsLog.appendChild(WStextarea);

    const contextLog = document.createElement('div');
    contextLog.id = 'mock-control__context-log-container';
    contextLog.style.flex = '1';
    logs.appendChild(contextLog);

    const contextLogHeader = document.createElement('h2');
    contextLogHeader.innerText = 'Contextholder log';

    const contextLogClear = document.createElement('button');
    contextLogClear.id = 'mock-control_context-log-clear';
    contextLogClear.innerText = 'Clear';
    contextLogClear.addEventListener('click', () => {
        const textarea = document.getElementById(
            'mock-control__context-log'
        )! as HTMLTextAreaElement;
        textarea.value = '';
    });
    contextLogHeader.appendChild(contextLogClear);

    const contextTextarea = document.createElement('textarea');
    contextTextarea.id = 'mock-control__context-log';
    contextTextarea.style.width = '100%';
    contextTextarea.style.height = '10rem';

    contextLog.appendChild(contextLogHeader);
    contextLog.appendChild(contextTextarea);

    document.body.append(controlDiv);
}

function addWSLogEntry() {
    return (message: MessageEvent) => {
        const textarea = document.getElementById('mock-control__ws-log')! as HTMLTextAreaElement;
        const now = new Date().toLocaleTimeString('en-GB');

        if (['NY_AKTIV_ENHET', 'NY_AKTIV_BRUKER'].includes(message.data)) {
            fetch('/modiacontextholder/api/context?fromMock')
                .then((resp) => resp.json())
                .then((json) => {
                    textarea.value = `${now} ${message.data}\n(${JSON.stringify(json)})\n${
                        textarea.value
                    }`;
                });
        }
    };
}

function addContextholderLogEntry(input: RequestInfo, message: string) {
    if (typeof input !== 'string' || !input.endsWith('fromMock')) {
        const textarea = document.getElementById(
            'mock-control__context-log'
        )! as HTMLTextAreaElement;
        const now = new Date().toLocaleTimeString('en-GB');

        const current = textarea.value;
        const newEntry = `${now} ${message}`;
        textarea.value = `${newEntry}\n${current}`;
    }
}

type Context = { aktivEnhet: string | null; aktivBruker: string | null };
const context: Context = { aktivEnhet: '0118', aktivBruker: '10108000398' };

export function setupWsControlAndMock(mock: FetchMock, errorConfig: FailureConfig) {
    if (window.location.hostname.includes('localhost')) {
        setupControls();
        const ws = new WebSocket('ws://localhost:2999/hereIsWS');

        ws.addEventListener('message', addWSLogEntry());

        mock.post('/modiacontextholder/api/context', ({ input, body }) => {
            if (body.eventType === 'NY_AKTIV_ENHET') {
                if (errorConfig.contextholder.updateEnhet) {
                    return Promise.reject({ status: 500 });
                }
                context.aktivEnhet = body.verdi;
                ws.send(controlSignal('NY_AKTIV_ENHET'));
                addContextholderLogEntry(input, `POST NY_AKTIV_ENHET ${body.verdi}`);
                return Promise.resolve({ status: 200 });
            } else if (body.eventType === 'NY_AKTIV_BRUKER') {
                if (errorConfig.contextholder.updateBruker) {
                    return Promise.reject({ status: 500 });
                }
                context.aktivBruker = body.verdi;
                ws.send(controlSignal('NY_AKTIV_BRUKER'));
                addContextholderLogEntry(input, `POST NY_AKTIV_BRUKER ${body.verdi}`);
                return Promise.resolve({ status: 200 });
            } else {
                addContextholderLogEntry(input, `POST UKJENT_ENDEPUNKT`);
                return Promise.reject({ status: 500 });
            }
        });

        mock.delete('/modiacontextholder/api/context/aktivenhet', ({ input }) => {
            if (errorConfig.contextholder.deleteEnhet) {
                return Promise.reject({ status: 500 });
            }
            context.aktivEnhet = null;
            ws.send(controlSignal('NY_AKTIV_ENHET'));
            addContextholderLogEntry(input, `DELETE NY_AKTIV_ENHET`);
            return {};
        });
        mock.delete('/modiacontextholder/api/context/aktivbruker', ({ input }) => {
            if (errorConfig.contextholder.deleteBruker) {
                return Promise.reject({ status: 500 });
            }
            context.aktivBruker = null;
            ws.send(controlSignal('NY_AKTIV_BRUKER'));
            addContextholderLogEntry(input, `DELETE NY_AKTIV_BRUKER`);
            return {};
        });
    }

    mock.get('/modiacontextholder/api/context/aktivenhet', ({ input }) => {
        if (errorConfig.contextholder.getEnhet) {
            return Promise.reject({ status: 500 });
        }
        addContextholderLogEntry(input, `GET NY_AKTIV_ENHET ${context.aktivEnhet || '<null>'}`);
        return Promise.resolve({
            status: 200,
            body: JSON.stringify({
                aktivEnhet: context.aktivEnhet,
                aktivBruker: null
            })
        });
    });
    mock.get('/modiacontextholder/api/context/aktivbruker', ({ input }) => {
        if (errorConfig.contextholder.getBruker) {
            return Promise.reject({ status: 500 });
        }
        addContextholderLogEntry(input, `GET NY_AKTIV_BRUKER ${context.aktivBruker || '<null>'}`);
        return Promise.resolve({
            status: 200,
            body: JSON.stringify({
                aktivEnhet: null,
                aktivBruker: context.aktivBruker
            })
        });
    });
    mock.get('/modiacontextholder/api/context', ({ input }) => {
        if (errorConfig.contextholder.get) {
            return Promise.reject({ status: 500 });
        }
        addContextholderLogEntry(input, `GET BOTH\n${JSON.stringify(context)}`);
        return Promise.resolve({
            status: 200,
            body: JSON.stringify({
                aktivEnhet: context.aktivEnhet,
                aktivBruker: context.aktivBruker
            })
        });
    });
}
