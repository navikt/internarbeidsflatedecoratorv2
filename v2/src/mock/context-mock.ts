import FetchMock from 'yet-another-fetch-mock';

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
    });
}

function setupControls() {
    return () => {
        const controlDiv = document.createElement('div');
        controlDiv.id = 'ws-control';
        controlDiv.style.position = 'absolute';
        controlDiv.style.bottom = '0px';
        controlDiv.style.width = 'calc(100% - 4rem)';
        controlDiv.style.marginLeft = '2rem';

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

        buttonDiv.appendChild(guttButton);
        buttonDiv.appendChild(jenteButton);
        buttonDiv.appendChild(barumEnhet);
        buttonDiv.appendChild(aremarkEnhet);

        const header = document.createElement('h1');
        header.innerText = 'Controls';
        controlDiv.appendChild(header);
        controlDiv.appendChild(buttonDiv);

        const textarea = document.createElement('textarea');
        textarea.id = 'ws-control__textarea';
        textarea.style.width = '100%';
        textarea.style.height = '10rem';
        controlDiv.appendChild(textarea);

        document.body.append(controlDiv);
    };
}
function showMessage() {
    return (message: MessageEvent) => {
        const textarea = document.getElementById('ws-control__textarea')! as HTMLTextAreaElement;
        const now = new Date().toLocaleTimeString();

        if (['NY_AKTIV_ENHET', 'NY_AKTIV_BRUKER'].includes(message.data)) {
            fetch('/modiacontextholder/api/context?fromMock')
                .then((resp) => resp.json())
                .then((json) => {
                    textarea.value = `${now} ${message.data} (${JSON.stringify(json)})\n${
                        textarea.value
                    }`;
                });
        }
    };
}

type Context = { aktivEnhet: string | null, aktivBruker: string | null };
const context: Context = { aktivEnhet: '', aktivBruker: '' };

export function setupWsControlAndMock(mock: FetchMock) {
    if (window.location.hostname.includes('localhost')) {
        const ws = new WebSocket('ws://localhost:2999/hereIsWS');
        ws.addEventListener('open', setupControls());
        ws.addEventListener('message', showMessage());

        mock.post('/modiacontextholder/api/context', ({ body }) => {
            if (body.eventType === 'NY_AKTIV_ENHET') {
                context.aktivEnhet = body.verdi;
                ws.send(controlSignal('NY_AKTIV_ENHET'));
                return Promise.resolve({ status: 200 });
            } else if (body.eventType === 'NY_AKTIV_BRUKER') {
                context.aktivBruker = body.verdi;
                ws.send(controlSignal('NY_AKTIV_BRUKER'));
                return Promise.resolve({ status: 200 });
            } else {
                return Promise.resolve({ status: 500 });
            }
        });

        mock.delete('/modiacontextholder/api/context/aktivenhet', () => {
            context.aktivEnhet = null;
            return {};
        });
        mock.delete('/modiacontextholder/api/context/aktivbruker', () => {
            context.aktivBruker = null;
            return {};
        });
    }

    mock.get('/modiacontextholder/api/context/aktivenhet', () => ({
        aktivEnhet: context.aktivEnhet,
        aktivBruker: null
    }));
    mock.get('/modiacontextholder/api/context/aktivbruker', () => ({
        aktivEnhet: null,
        aktivBruker: context.aktivBruker
    }));
    mock.get('/modiacontextholder/api/context', () => ({
        aktivEnhet: context.aktivEnhet,
        aktivBruker: context.aktivBruker
    }));

}
