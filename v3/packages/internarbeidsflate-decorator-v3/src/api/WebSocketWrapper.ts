import { WebSocketListener } from '../types/WebSocketListener';
import { Environment } from '../utils/environmentUtils';
const SECONDS: number = 1000;
const MINUTES: number = 60 * SECONDS;
const MAX_RETRIES: number = 30;

export enum Status {
  INIT = 'INIT',
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  REFRESH = 'REFRESH',
}

const fuzzy = (min: number, max: number): number => {
  const diff = max - min;
  const rnd = Math.round(Math.random() * diff);
  return min + rnd;
};

const createDelay = (basedelay: number): number => {
  return basedelay + fuzzy(5 * SECONDS, 15 * SECONDS);
};

const createRetrytime = (tryCount: number): number => {
  if (tryCount === MAX_RETRIES) {
    return Number.MAX_SAFE_INTEGER;
  }

  const basedelay = Math.min(Math.pow(2, tryCount), 180) * SECONDS;
  return basedelay + fuzzy(5 * SECONDS, 15 * SECONDS);
};

export class WebSocketWrapper {
  #status: Status;
  #wsUrl: string;
  readonly #listener: WebSocketListener;
  #environment: Environment

  private connection?: WebSocket;
  private resettimer?: ReturnType<typeof window.setTimeout> | null;
  private retrytimer?: ReturnType<typeof window.setTimeout> | null;
  private retryCounter = 0;

  constructor(wsUrl: string, environment: Environment, listener: WebSocketListener) {
    this.#wsUrl = wsUrl;
    this.#listener = listener;
    this.#environment = environment;
    this.#status = Status.INIT;
  }

  readonly open = () => {
    if (this.#status === Status.CLOSE) {
      WebSocketWrapper.#print('Stopping creation of WS, since it is closed');
      return;
    }
    WebSocketWrapper.#print('Opening WS', this.#wsUrl);
    if (this.#environment === 'mock') {
      console.warn('WebSocket er ikke støttet av MSW ennå, derfor blir det ikke mocket. Se: https://github.com/mswjs/msw/issues/156')
      return
    }
    this.connection = new WebSocket(this.#wsUrl);
    this.connection.addEventListener('open', this.#onWSOpen);
    this.connection.addEventListener('message', this.#onWSMessage);
    this.connection.addEventListener('error', this.#onWSError);
    this.connection.addEventListener('close', this.#onWSClose);
  };

  readonly close = () => {
    WebSocketWrapper.#print('Closing WS', this.#wsUrl);
    this.#clearResetTimer();
    this.#clearRetryTimer();
    this.#status = Status.CLOSE;
    if (this.connection) {
      this.connection.close();
    }
  };

  readonly sendMessage = (message: string) => {
    this.connection?.send(message);
  };

  get status() {
    return this.#status;
  }

  #onWSOpen = (event: Event) => {
    WebSocketWrapper.#print('open', event);
    this.#clearResetTimer();
    this.#clearRetryTimer();
    const delay = createDelay(45 * MINUTES);
    WebSocketWrapper.#print('Creating resettimer', delay);

    this.resettimer = setTimeout(() => {
      this.#status = Status.REFRESH;
      if (this.connection) {
        this.connection.close();
      }
    }, delay);

    this.#status = Status.OPEN;

    if (this.#listener.onOpen) {
      this.#listener.onOpen(event);
    }
  };

  #onWSMessage = (event: MessageEvent) => {
    WebSocketWrapper.#print('message', event);
    if (this.#listener.onMessage) {
      this.#listener.onMessage(event);
    }
  };

  #onWSError = (event: Event) => {
    WebSocketWrapper.#print('error', event);
    if (this.#listener.onError) {
      this.#listener.onError(event);
    }
  };

  #onWSClose = (event: CloseEvent) => {
    WebSocketWrapper.#print('close', event);
    if (this.#status === Status.REFRESH) {
      this.open();
      return;
    }

    if (this.#status !== Status.CLOSE) {
      const delay = createRetrytime(this.retryCounter++);
      WebSocketWrapper.#print('Creating retrytimer', delay);
      this.retrytimer = setTimeout(() => this.open(), delay);
    }

    if (this.#listener.onClose) {
      this.#listener.onClose(event);
    }
  };

  #clearResetTimer = () => {
    if (this.resettimer) {
      clearTimeout(this.resettimer);
      this.resettimer = null;
    }
  };

  #clearRetryTimer = () => {
    if (this.retrytimer) {
      clearTimeout(this.retrytimer);
      this.retrytimer = null;
    }
  };

  static #print = (...args: unknown[]) => {
    if (import.meta.env.REACT_APP_MOCK === 'true') {
      console.log('WS:', ...args);
    }
  };
}
