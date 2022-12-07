import React from 'react';
import visibleIf from './visibleIf';
import { useInitializedState } from '../hooks/use-initialized-state';
import { EMDASH } from '../utils/string-utils';

function Veileder() {
    const saksbehandler = useInitializedState((state) => state.data.saksbehandler);

    const identElement = saksbehandler
        .map((data) => data.ident)
        .map((ident) => <span className="dekorator__hode__veileder_id">{ident}</span>)
        .withDefault(<span className="dekorator__hode__veileder_id">{EMDASH}</span>);

    const navnElement = saksbehandler
        .map((data) => data.navn)
        .map((navn) => <span className="dekorator__hode__veileder_navn">{navn}</span>)
        .withDefault(null);

    return (
        <section className="dekorator__hode__veileder_container">
            <p className="typo-avsnitt dekorator__hode__veileder_header">
                {identElement}
                {navnElement}
            </p>
        </section>
    );
}

export default visibleIf(Veileder);
