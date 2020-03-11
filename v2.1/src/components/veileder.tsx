import React from 'react';
import visibleIf from './visibleIf';
import { useInitializedState } from '../hooks/use-initialized-state';
import { EMDASH } from '../utils/string-utils';

function Veileder() {
    const saksbehandler = useInitializedState((state) => state.data.saksbehandler);

    const ident = saksbehandler.map((data) => data.ident).withDefault(EMDASH);
    const navn = saksbehandler.map((data) => data.navn).withDefault(EMDASH);

    return (
        <section className="dekorator__hode__veileder_container">
            <p className="typo-avsnitt dekorator__hode__veileder_header">
                <span className="dekorator__hode__veileder_id">{ident}</span>
                <span className="dekorator__hode__veileder_navn">{navn}</span>
            </p>
        </section>
    );
}

export default visibleIf(Veileder);
