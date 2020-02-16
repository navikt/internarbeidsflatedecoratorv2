import React from 'react';
import {MaybeCls} from '@nutgaard/maybe-ts';
import {Saksbehandler} from '../internal-domain';
import {EMDASH} from '../utils/string-utils';
import visibleIf from './visibleIf';
import {useInitializedState} from "../hooks/use-initialized-state";
import {useEnhetContextvalueState} from "../hooks/use-contextvalue-state";

function lagEnhetvisning(
    maybeEnhet: MaybeCls<string>,
    saksbehandler: Saksbehandler
): string {
    const enheter = saksbehandler.enheter;
    return maybeEnhet
        .filter((enhet) => enheter.find((e) => e.enhetId === enhet) !== undefined)
        .map((enhet) => enheter.find((e) => e.enhetId === enhet)!)
        .or(MaybeCls.of(enheter[0]))
        .map((match) => `${match.enhetId} ${match.navn}`)
        .withDefault(EMDASH);
}

function Enhet() {
    const enhet = useEnhetContextvalueState();
    const saksbehandler = useInitializedState((state) => state.data.saksbehandler);

    return <span className="dekorator__hode__enhet">{lagEnhetvisning(enhet, saksbehandler)}</span>;
}

export default visibleIf(Enhet);
