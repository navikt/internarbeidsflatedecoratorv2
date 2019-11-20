import React, { MutableRefObject, useEffect, useRef } from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { Listeners } from '../utils/websocket-impl';
import useFetch from './use-fetch';
import { useWebsocket } from './use-webhook';
import { AktivBruker, AktivEnhet, Contextholder, Saksbehandler } from '../domain';
import { Context } from '../application';
import log from './../utils/logging';
import { WrappedState } from './use-wrapped-state';
import {
    AKTIV_BRUKER_URL,
    AKTIV_ENHET_URL,
    nullstillAktivBruker,
    oppdaterAktivBruker,
    oppdaterAktivEnhet
} from '../context-api';
import { lagFnrFeilmelding } from '../utils/fnr-utils';

function useInitialEnhetSync(
    syncingEnhet: MutableRefObject<boolean>,
    enhetSyncedValue: boolean,
    setEnhetSynced: (value: boolean) => void,
    saksbehandler: MaybeCls<Saksbehandler>,
    enhet: MaybeCls<string>,
    onEnhetChange: (enhet: string) => void,
    aktivEnhetData: MaybeCls<AktivEnhet>,
    aktivEnhetRefetch: () => void,
    contextholder: MaybeCls<Contextholder>
) {
    useEffect(() => {
        if (enhetSyncedValue) {
            return;
        }
        log.debug('running enhet sync');
        saksbehandler.map2((saksbehandler: Saksbehandler, enhet: string) => {
            const enheter = saksbehandler.enheter;
            if (!enheter) {
                log.error('Kunne ikke hente ut enheter');
                return;
            }
            const erGyldigEnhet = enheter.findIndex((e) => e.enhetId === enhet) >= 0;
            if (!erGyldigEnhet && !syncingEnhet.current) {
                syncingEnhet.current = true;
                const gyldigEnhet = aktivEnhetData
                    .map((e: AktivEnhet) => e.aktivEnhet!)
                    .filter((e: string) => enheter.findIndex((el) => el.enhetId === e) >= 0)
                    .withDefault(enheter[0].enhetId);
                log.debug('var ikke gyldig byttet til', gyldigEnhet);

                if (contextholder.isNothing()) {
                    log.debug('ingen contextholder i bruk, sender onchange');
                    onEnhetChange(gyldigEnhet);
                    setEnhetSynced(true);
                } else if (contextholder.isJust() && aktivEnhetData.isJust()) {
                    log.debug('bruker contextholder, oppdaterer aktivEnhet', gyldigEnhet, enhet);
                    oppdaterAktivEnhet(gyldigEnhet)
                        .then(() => onEnhetChange(gyldigEnhet))
                        .then(() => {
                            setEnhetSynced(true);
                            syncingEnhet.current = false;
                        })
                        .then(aktivEnhetRefetch);
                } else {
                    syncingEnhet.current = false;
                }
            }
        }, enhet);
    }, [
        syncingEnhet,
        enhetSyncedValue,
        setEnhetSynced,
        saksbehandler,
        enhet,
        onEnhetChange,
        aktivEnhetData,
        aktivEnhetRefetch,
        contextholder
    ]);
}

function useKeepEnhetInSync(
    syncingEnhet: MutableRefObject<boolean>,
    contextholder: MaybeCls<Contextholder>,
    enhet: MaybeCls<string>,
    saksbehandler: MaybeCls<Saksbehandler>,
    aktivEnhetData: MaybeCls<AktivEnhet>,
    aktivEnhetRefetch: () => void,
    setEnhetSynced: (value: boolean) => void
) {
    useEffect(() => {
        if (syncingEnhet.current || contextholder.isNothing()) {
            return;
        }
        saksbehandler.map2((saksbehandler: Saksbehandler, enhet: string) => {
            const enheter = saksbehandler.enheter;
            if (!enheter) {
                log.error('Kunne ikke hente ut enheter');
                return;
            }
            const erGyldigEnhet = enheter.findIndex((e) => e.enhetId === enhet) >= 0;
            const erISync =
                aktivEnhetData.isNothing() ||
                aktivEnhetData.filter((aktiv) => aktiv.aktivEnhet === enhet).isJust();
            if (erGyldigEnhet && !erISync) {
                oppdaterAktivEnhet(enhet)
                    .then(() => setEnhetSynced(true))
                    .then(aktivEnhetRefetch);
            }
        }, enhet);
    }, [
        syncingEnhet,
        contextholder,
        enhet,
        saksbehandler,
        aktivEnhetData,
        setEnhetSynced,
        aktivEnhetRefetch
    ]);
}

function useInitialFnrSync(
    syncingFnr: MutableRefObject<boolean>,
    contextholder: MaybeCls<Contextholder>,
    setFnrSynced: (value: boolean) => void,
    fnrSyncedValue: boolean,
    fnr: MaybeCls<string>,
    aktivBrukerData: MaybeCls<AktivBruker>,
    aktivBrukerRefretch: () => void,
    onSok: (fnr: string) => void
) {
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
            } else if (fnr.isJust() && aktivBrukerData.isJust() && contextholder.isJust()) {
                fnr.map2((fnr, { aktivBruker }) => {
                    if (!syncingFnr.current && fnr !== aktivBruker) {
                        syncingFnr.current = true;
                        if (lagFnrFeilmelding(fnr).isNothing()) {
                            oppdaterAktivBruker(fnr)
                                .then(() => setFnrSynced(true))
                                .then(aktivBrukerRefretch)
                                .then(() => {
                                    syncingFnr.current = false;
                                });
                        } else {
                            nullstillAktivBruker();
                        }
                    }
                }, aktivBrukerData);
            }
        }
    }, [
        syncingFnr,
        contextholder,
        setFnrSynced,
        fnrSyncedValue,
        fnr,
        aktivBrukerData,
        aktivBrukerRefretch,
        onSok
    ]);
}

function useKeepFnrInSync(
    fnr: MaybeCls<string>,
    fnrSyncedValue: boolean,
    syncingFnr: MutableRefObject<boolean>,
    contextholder: MaybeCls<Contextholder>,
    setFnrSynced: (fnr: boolean) => void,
    aktivBrukerData: MaybeCls<AktivBruker>
) {
    useEffect(() => {
        if (!fnrSyncedValue || syncingFnr.current || contextholder.isNothing()) {
            return;
        }
        if (fnr.isJust() && aktivBrukerData.isJust() && contextholder.isJust()) {
            fnr.map2((fnr, { aktivBruker }) => {
                if (!syncingFnr.current && fnr !== aktivBruker) {
                    syncingFnr.current = true;
                    oppdaterAktivBruker(fnr)
                        .then(() => setFnrSynced(true))
                        .then(() => {
                            syncingFnr.current = false;
                        });
                }
            }, aktivBrukerData);
        }
    }, [fnr, fnrSyncedValue, syncingFnr, contextholder, setFnrSynced, aktivBrukerData]);
}

export function useContextholder(
    context: Context,
    enhetSynced: WrappedState<boolean>,
    fnrSynced: WrappedState<boolean>
) {
    const feilmelding = context.feilmelding;
    const saksbehandler = context.saksbehandler.data;
    const enhet = context.enhet;
    const fnr = context.fnr;
    const contextholder = context.contextholder;
    const onEnhetChange = context.onEnhetChange;
    const setEnhetSynced = enhetSynced.set;
    const enhetSyncedValue = enhetSynced.value;
    const setFnrSynced = fnrSynced.set;
    const fnrSyncedValue = fnrSynced.value;
    const onSok = context.onSok;
    const aktivEnhet = useFetch<AktivEnhet>(AKTIV_ENHET_URL);
    const aktivBruker = useFetch<AktivBruker>(AKTIV_BRUKER_URL);
    const syncingEnhet = useRef(false);
    const syncingFnr = useRef(false);

    const wsListeners: Listeners = React.useMemo(
        () => ({
            onError(): void {
                feilmelding.set(MaybeCls.just('Kunne ikke koble til WebScocket'));
            }
        }),
        [feilmelding]
    );
    useWebsocket(context.contextholder.map(({ url }) => url).withDefault(null), wsListeners);

    useInitialEnhetSync(
        syncingEnhet,
        enhetSyncedValue,
        setEnhetSynced,
        saksbehandler,
        enhet,
        onEnhetChange,
        aktivEnhet.data,
        aktivEnhet.refetch,
        contextholder
    );

    useKeepEnhetInSync(
        syncingEnhet,
        contextholder,
        enhet,
        saksbehandler,
        aktivEnhet.data,
        aktivEnhet.refetch,
        setEnhetSynced
    );

    useInitialFnrSync(
        syncingFnr,
        contextholder,
        setFnrSynced,
        fnrSyncedValue,
        fnr,
        aktivBruker.data,
        aktivBruker.refetch,
        onSok
    );

    useKeepFnrInSync(
        fnr,
        fnrSyncedValue,
        syncingFnr,
        contextholder,
        setFnrSynced,
        aktivBruker.data
    );
}
