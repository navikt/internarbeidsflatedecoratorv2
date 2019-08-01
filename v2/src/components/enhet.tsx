import React, { useContext, useEffect } from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { AppContext } from '../application';
import { Saksbehandler } from '../domain';
import { UseFetchHook } from '../hooks/use-fetch';
import { EMDASH } from '../utils/string-utils';
import visibleIf from './visibleIf';

function lagEnhetvisning(maybeEnhet: MaybeCls<string>, saksbehandlerData: UseFetchHook<Saksbehandler>): string {
    if (saksbehandlerData.isLoading) {
        return '';
    } else if (saksbehandlerData.isError) {
        return EMDASH;
    } else {
        const enheter = saksbehandlerData.data.map((data) => data.enheter).withDefault([]);

        return maybeEnhet
            .filter((enhet) => enheter.find((e) => e.enhetId === enhet) !== undefined)
            .map((enhet) => enheter.find((e) => e.enhetId === enhet)!)
            .or(MaybeCls.of(enheter[0]))
            .map((match) => `${match.enhetId} ${match.navn}`)
            .withDefault(EMDASH);
    }
}

function Enhet() {
    const context = useContext(AppContext);
    const enhet: MaybeCls<string> = context.enhet;
    const enheter = context.saksbehandler.data.map((data) => data.enheter).withDefault([]);

    useEffect(() => {
        if (enhet.isNothing() && enheter.length > 0) {
            context.onEnhetChange(enheter[0].enhetId);
        }
    }, [enhet, enheter, context]);

    return (
        <span className="dekorator__hode__enhet">{lagEnhetvisning(enhet, context.saksbehandler)}</span>
    );
}

export default visibleIf(Enhet);
