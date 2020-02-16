import React from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { Saksbehandler } from '../domain';
import { EMDASH } from '../utils/string-utils';
import visibleIf from './visibleIf';
import { useSelector } from 'react-redux';
import { State } from '../redux';

function lagEnhetvisning(
    maybeEnhet: MaybeCls<string>,
    saksbehandlerData: MaybeCls<Saksbehandler>
): string {
    return saksbehandlerData
        .map((saksbehandler) => {
            const enheter = saksbehandler.enheter;
            return maybeEnhet
                .filter((enhet) => enheter.find((e) => e.enhetId === enhet) !== undefined)
                .map((enhet) => enheter.find((e) => e.enhetId === enhet)!)
                .or(MaybeCls.of(enheter[0]))
                .map((match) => `${match.enhetId} ${match.navn}`)
                .withDefault(EMDASH);
        })
        .withDefault(EMDASH);
}

function Enhet() {
    const enhet: MaybeCls<string> = useSelector((state: State) => state.enhet);
    const saksbehandler = useSelector((state: State) => state.data.saksbehandler);

    return <span className="dekorator__hode__enhet">{lagEnhetvisning(enhet, saksbehandler)}</span>;
}

export default visibleIf(Enhet);
