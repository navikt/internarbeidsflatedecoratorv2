import React, {useEffect} from "react";
import {MaybeCls} from "@nutgaard/maybe-ts";
import {Listeners} from '../utils/websocket-impl';
import {UseFetchHook} from "./use-fetch";
import {useWebsocket} from "./use-webhook";
import {AktivBruker, AktivEnhet, Enheter} from "../domain";
import {Context} from "../application";
import log from './../utils/logging';

export function useContextholder(
    context: Context,
    aktivEnhet: UseFetchHook<AktivEnhet>,
    aktivBruker: UseFetchHook<AktivBruker>
) {
    const refetchEnhet = aktivEnhet.refetch;
    const refetchBruker = aktivBruker.refetch;
    const feilmelding = context.feilmelding;
    const wsListeners: Listeners = React.useMemo(() => ({
        onMessage(event: MessageEvent): void {
            if (event.data === '"NY_AKTIV_ENHET"') {
                log.debug('WS ny enhet, refretcher fra contextholder');
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

    const enheter = context.enheter.data;
    const enhet = context.enhet;
    const contextholder = context.contextholder;
    const onEnhetChange = context.onEnhetChange;
    const aktivEnhetData = aktivEnhet.data;
    useEffect(() => {
        log.debug('running enhet sync', enheter, enhet, onEnhetChange, aktivEnhetData, contextholder);
        enheter.map2((enheter: Enheter, enhet: string) => {
            const erGyldigEnhet = enheter.enhetliste.findIndex((e) => e.enhetId === enhet) >= 0;
            log.debug('sjekket enhet gyldighet', erGyldigEnhet);
            if (!erGyldigEnhet) {
                const gyldigEnhet = aktivEnhetData
                    .map((e: AktivEnhet) => e.aktivEnhet!)
                    .filter((e: string) => enheter.enhetliste.findIndex((el) => el.enhetId === e) >= 0)
                    .withDefault(enheter.enhetliste[0].enhetId);
                log.debug('var ikke gyldig byttet til', gyldigEnhet);

                if (contextholder === false) {
                    log.debug('ingen contextholder i bruk, sender onchange',);
                    onEnhetChange(gyldigEnhet);
                } else if (aktivEnhetData.isJust()){
                    log.debug('bruker contextholder, oppdaterer aktivEnhet');
                    fetch('/modiacontextholder/api/context', {
                        credentials: 'include',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            verdi: gyldigEnhet,
                            eventType: 'NY_AKTIV_ENHET'
                        })
                    })
                        .then(() => onEnhetChange(gyldigEnhet));
                }
            }
        }, enhet);
    }, [enheter, enhet, onEnhetChange, aktivEnhetData, contextholder]);
}