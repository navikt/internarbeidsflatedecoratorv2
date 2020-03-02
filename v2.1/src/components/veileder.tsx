import React from 'react';
import visibleIf from './visibleIf';
import { useInitializedState } from '../hooks/use-initialized-state';

function Veileder() {
    const saksbehandler = useInitializedState((state) => state.data.saksbehandler);

    return (
        <section className="dekorator__hode__veileder_container">
            <p className="typo-avsnitt dekorator__hode__veileder_header">
                <span className="dekorator__hode__veileder_id">{saksbehandler.ident}</span>
                <span className="dekorator__hode__veileder_navn">{saksbehandler.navn}</span>
            </p>
        </section>
    );
}

export default visibleIf(Veileder);
