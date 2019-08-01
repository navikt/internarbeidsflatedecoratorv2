import WebSocket, { Listeners } from './../utils/websocket-impl';
import { useEffect } from 'react';

type WSState = {
    [key: string]: {
        ws: WebSocket;
        listeners: Array<Listeners>;
    };
};
type BroadcaseMethod = 'onMessage' | 'onClose' | 'onOpen' | 'onError';

class WSContext {
    state: WSState = {};

    register(url: string, listener: Listeners) {
        if (this.state[url]) {
            this.state[url].listeners.push(listener);
        } else {
            const ws = new WebSocket(url, this.createListener(url));
            ws.open();
            this.state[url] = {
                ws,
                listeners: [listener]
            };
        }
    }

    unregister(url: string, listener: Listeners) {
        if (!this.state[url]) {
            return;
        }
        const wsstate = this.state[url];
        const newListeners = wsstate.listeners.filter((l) => l !== listener);

        wsstate.listeners = newListeners;
        if (newListeners.length === 0) {
            wsstate.ws.close();
            delete this.state[url];
        }
    }

    private broadcast(method: BroadcaseMethod, url: string, event: Event) {
        if (this.state[url]) {
            const wsstate = this.state[url];
            if (method === 'onMessage') {
                wsstate.listeners.forEach(
                    (listener) => listener.onMessage && listener.onMessage(event as MessageEvent)
                );
            } else if (method === 'onClose') {
                wsstate.listeners.forEach(
                    (listener) => listener.onClose && listener.onClose(event as CloseEvent)
                );
            } else {
                wsstate.listeners.forEach(
                    (listener) => listener[method] && listener[method]!(event)
                );
            }
        }
    }

    private createListener(url: string): Listeners {
        return {
            onOpen: (event) => this.broadcast('onOpen', url, event),
            onMessage: (event) => this.broadcast('onMessage', url, event),
            onClose: (event) => this.broadcast('onClose', url, event),
            onError: (event) => this.broadcast('onError', url, event)
        };
    }
}
const wsContext: WSContext = new WSContext();

export function useWebsocket(url: string | null | undefined, listeners: Listeners) {
    useEffect(() => {
        if (!url) {
            return;
        }
        wsContext.register(url, listeners);
        return () => wsContext.unregister(url, listeners);
    }, [url, listeners]);
}
