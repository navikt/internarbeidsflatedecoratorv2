import React from 'react';
import { MaybeCls } from '@nutgaard/maybe-ts';
import { EMDASH } from '../utils/string-utils';
import visibleIf from './visibleIf';
import { useInitializedState } from '../hooks/use-initialized-state';
import { useEnhetContextvalueState } from '../hooks/use-contextvalue-state';
import { Enhet as EnhetType } from './../internal-domain';
import './enhet.css';

function lagEnhetvisning(maybeEnhet: MaybeCls<string>, enheter: Array<EnhetType>): string {
    return maybeEnhet
        .filter((enhet) => enheter.find((e) => e.enhetId === enhet) !== undefined)
        .map((enhet) => enheter.find((e) => e.enhetId === enhet)!)
        .or(MaybeCls.of(enheter[0]))
        .map((match) => `${match.enhetId} ${match.navn}`)
        .withDefault(EMDASH);
}

function Enhet() {
    const enhet = useEnhetContextvalueState();
    const enheter = useInitializedState((state) => state.data.saksbehandler)
        .map((saksbehandler) => saksbehandler.enheter)
        .withDefault([]);

    return <span className="dekorator__hode__enhet">{lagEnhetvisning(enhet, enheter)}</span>;
}

export default visibleIf(Enhet);
