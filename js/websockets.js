
const SECONDS = 1000;
const MINUTES = 60 * SECONDS;
const MAX_RETRIES = 30;

const Status = {
    INIT: 'INIT',
    OPEN: 'OPEN',
    CLOSE: 'CLOSE',
};

function fuzzy(min, max) {
    const diff = max - min;
    const rnd = Math.round(Math.random() * diff);
    return min + rnd;
}

function createDelay(basedelay) {
    return basedelay + fuzzy(5 * SECONDS, 15 * SECONDS);
}

function createRetrytime(tryCount) {
    if (tryCount === MAX_RETRIES) {
        return Number.MAX_SAFE_INTEGER;
    }

    const basedelay = Math.min((Math.pow(2, tryCount)), 180) * SECONDS;
    return basedelay + fuzzy(5 * SECONDS, 15 * SECONDS);
}

class WebSocketImpl {
    constructor({ wsUrl, contextUrl, onOpen, onMessage, onError, onClose, onBrukerChange, onEnhetChange, debug }) {
        this.wsUrl = wsUrl;
        this.contextUrl = contextUrl;
        this.onOpen = onOpen;
        this.onMessage = onMessage;
        this.onError = onError;
        this.onClose = onClose;
        this.onBrukerChange = onBrukerChange;
        this.onEnhetChange = onEnhetChange;
        this.debug = debug;

        this.resettimer = null;
        this.retrytimer = null;
        this.state = Status.INIT;
        this.retryCounter = 0;

        this.print = this.print.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);

        this.open();
    }

    open() {
        if (this.state === Status.CLOSE) {
            this.print('Stopping creation of WS, since it is closed');
            return;
        }

        this.print('Opening WS, wsUrl', this.wsUrl);
        this.connection = new WebSocket(this.wsUrl);
        this.connection.addEventListener('open', this.onWSOpen.bind(this));
        this.connection.addEventListener('message', this.onWSMessage.bind(this));
        this.connection.addEventListener('error', this.onWSError.bind(this));
        this.connection.addEventListener('close', this.onWSClose.bind(this));
    }

    close() {
        this.clearResetTimer();
        this.clearRetryTimer();
        this.state = Status.CLOSE;
        if (this.connection) {
            this.connection.close();
        }
    }

    onWSOpen(event) {
        this.print('open', event);
        this.clearResetTimer();
        this.clearRetryTimer();

        const delay = createDelay(45 * MINUTES);
        this.print('Creating resettimer', delay);

        this.resettimer = setTimeout(() => {
            this.connection.close();
        }, delay);

        this.state = Status.OPEN;
        this.doCallback('onOpen', event);
    }

    onWSMessage(event) {
        this.print('message', event);
        this.doCallback('onMessage', event);

        const data = event.data;
        if (data === 'NY_AKTIV_ENHET') {
            this.fetchEnhet().then(this.onEnhetChange);
        } else if (data === 'NY_AKTIV_BRUKER') {
            this.fetchBruker().then(this.onBrukerChange);
        } else {
            this.print('Unknown data on WS: ', event); // eslint-disable-line no-console
        }
    }

    onWSError(event) {
        this.print('error', event);
        this.doCallback('onError', event);
    }

    onWSClose(event) {
        this.print('close', event);
        if (this.state !== Status.CLOSE) {
            const delay = createRetrytime(this.retryCounter++);
            this.print('Creating retrytimer', delay);

            this.retrytimer = setTimeout(this.open, delay);
        } else {
            this.doCallback('onClose', event);
        }
    }

    doCallback(name, ...args) {
        if (this[name]) {
            this[name](...args);
        }
    }

    clearResetTimer() {
        clearTimeout(this.resettimer);
        this.resettimer = null;
    }

    clearRetryTimer() {
        clearTimeout(this.retrytimer);
        this.retrytimer = null;
        this.retryCounter = 0;
    }

    fetchEnhet() {
        return fetch(`${this.contextUrl}/aktivenhet`, { credentials: 'include' })
            .then((resp) => resp.json())
            .then((json) => json.aktivEnhet);
    }
    fetchBruker() {
        return fetch(`${this.contextUrl}/aktivbruker`, { credentials: 'include' })
            .then((resp) => resp.json())
            .then((json) => json.aktivBruker);
    }

    print(...args) {
        if (this.debug) {
            console.log(...args); // eslint-disable-line no-console
        }
    }
}

export function configureWebSocket(config) {
    return new WebSocketImpl(config);
}
