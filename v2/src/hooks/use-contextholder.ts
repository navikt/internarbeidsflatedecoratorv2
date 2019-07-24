import React, { useEffect, useRef } from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { Listeners } from '../utils/websocket-impl';
import useFetch from './use-fetch';
import { useWebsocket } from './use-webhook';
import { AktivBruker, AktivEnhet, Enheter } from '../domain';
import { Context } from '../application';
import log from './../utils/logging';
import { WrappedState } from './use-wrapped-state';
import {
    AKTIV_BRUKER_URL,
    AKTIV_ENHET_URL,
    oppdaterAktivBruker,
    oppdaterAktivEnhet
} from '../context-api';

export function useContextholder(
    context: Context,
    enhetSynced: WrappedState<boolean>,
    fnrSynced: WrappedState<boolean>
) {
    const feilmelding = context.feilmelding;
    const enheter = context.enheter.data;
    const enhet = context.enhet;
    const fnr = context.fnr;
    const contextholder = context.contextholder;
    const onEnhetChange = context.onEnhetChange;
    const setEnhetSynced = enhetSynced.set;
    const enhetSyncedValue = enhetSynced.value;
    const setFnrSynced = fnrSynced.set;
    const fnrSyncedValue = fnrSynced.value;
    const onSok = context.onSok;
    const aktivEnhetData = useFetch<AktivEnhet>(AKTIV_ENHET_URL).data;
    const aktivBrukerData = useFetch<AktivBruker>(AKTIV_BRUKER_URL).data;

    const wsListeners: Listeners = React.useMemo(
        () => ({
            onError(): void {
                feilmelding.set(MaybeCls.just('Kunne ikke koble til WebScocket'));
            }
        }),
        [feilmelding]
    );
    useWebsocket('ws://localhost:2999/hereIsWS', wsListeners);

    const syncing = useRef(false);
    useEffect(() => {
        if (enhetSyncedValue) {
            return;
        }
        log.debug('running enhet sync');
        enheter.map2((enheter: Enheter, enhet: string) => {
            const erGyldigEnhet = enheter.enhetliste.findIndex((e) => e.enhetId === enhet) >= 0;
            if (!erGyldigEnhet && !syncing.current) {
                syncing.current = true;
                const gyldigEnhet = aktivEnhetData
                    .map((e: AktivEnhet) => e.aktivEnhet!)
                    .filter(
                        (e: string) => enheter.enhetliste.findIndex((el) => el.enhetId === e) >= 0
                    )
                    .withDefault(enheter.enhetliste[0].enhetId);
                log.debug('var ikke gyldig byttet til', gyldigEnhet);

                if (contextholder === false) {
                    log.debug('ingen contextholder i bruk, sender onchange');
                    onEnhetChange(gyldigEnhet);
                    setEnhetSynced(true);
                } else if (aktivEnhetData.isJust()) {
                    log.debug('bruker contextholder, oppdaterer aktivEnhet', gyldigEnhet, enhet);
                    oppdaterAktivEnhet(gyldigEnhet)
                        .then(() => onEnhetChange(gyldigEnhet))
                        .then(() => {
                            setEnhetSynced(true);
                            syncing.current = false;
                        });
                } else {
                    syncing.current = false;
                }
            }
        }, enhet);
    }, [
        enhetSyncedValue,
        setEnhetSynced,
        enheter,
        enhet,
        onEnhetChange,
        aktivEnhetData,
        contextholder
    ]);

    useEffect(() => {
        enheter.map2((enheter: Enheter, enhet: string) => {
            const erGyldigEnhet = enheter.enhetliste.findIndex((e) => e.enhetId === enhet) >= 0;
            const erISync =
                aktivEnhetData.isNothing() ||
                aktivEnhetData.filter((aktiv) => aktiv.aktivEnhet === enhet).isJust();
            if (erGyldigEnhet && !erISync) {
                oppdaterAktivEnhet(enhet).then(() => setEnhetSynced(true));
            }
        }, enhet);
    }, [enhet, enheter, aktivEnhetData, setEnhetSynced]);

    useEffect(() => {
        if (!fnrSyncedValue) {
            log.debug('running fnr sync', fnrSyncedValue, aktivBrukerData);
            if (fnr.isNothing() && aktivBrukerData.isJust()) {
                aktivBrukerData
                    .flatMap((aktiv) => MaybeCls.of(aktiv.aktivBruker))
                    .map((aktiv) => {
                        if (aktiv.length > 0) {
                            onSok(aktiv);
                        }
                        setFnrSynced(true);
                        return aktiv;
                    });
            } else if (fnr.isJust() && aktivBrukerData.isJust()) {
                fnr.map2((fnr, { aktivBruker }) => {
                    if (fnr !== aktivBruker) {
                        oppdaterAktivBruker(fnr).then(() => setFnrSynced(true));
                    }
                }, aktivBrukerData);
            }
        }
    }, [setFnrSynced, fnrSyncedValue, fnr, aktivBrukerData, onSok]);
}
