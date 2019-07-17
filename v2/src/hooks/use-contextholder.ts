import React from "react";
import {MaybeCls} from "@nutgaard/maybe-ts";
import {Listeners} from '../utils/websocket-impl';
import {UseFetchHook} from "./use-fetch";
import {useWebsocket} from "./use-webhook";
import {WrappedState} from "./use-wrapped-state";

export function useContextholder(
    enhet: UseFetchHook<{ aktivEnhet: string }>,
    bruker: UseFetchHook<{ aktivBruker: string }>,
    feilmelding: WrappedState<MaybeCls<string>>
) {
    const refetchEnhet = enhet.refetch;
    const refetchBruker = bruker.refetch;
    const wsListeners: Listeners = React.useMemo(() => ({
        onMessage(event: MessageEvent): void {
            if (event.data === '"NY_AKTIV_ENHET"') {
                refetchEnhet();
            } else if (event.data === '"NY_AKTIV_BRUKER"') {
                refetchBruker();
            }
        },
        onClose(event: CloseEvent): void {
        },
        onError(event: Event): void {
            feilmelding.set(MaybeCls.just('Kunne ikke koble til WebScocket'))
        },
        onOpen(event: Event): void {
        },
    }), [refetchEnhet, refetchBruker, feilmelding]);
    useWebsocket('ws://localhost:2999/hereIsWS', wsListeners);
}