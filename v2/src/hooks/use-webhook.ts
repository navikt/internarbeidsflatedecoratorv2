import WebSocket, {Listeners} from './../utils/websocket-impl';
import {useEffect} from "react";

export function useWebsocket(url: string, listeners: Listeners) {
    useEffect(() => {
        const ws = new WebSocket(url, listeners);
        ws.open();
        return () => ws.close();
    }, [url, listeners]);
}