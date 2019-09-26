import React, { useContext } from 'react';
import { AppContext } from '../application';
import { EMDASH } from '../utils/string-utils';

function Veileder() {
    const context = useContext(AppContext);
    const ident = context.saksbehandler.data.map((data) => data.ident).withDefault(EMDASH);
    const navn = context.saksbehandler.data.map((data) => data.navn).withDefault('');

    return (
        <section className="dekorator__hode__veileder_container">
            <h2 className="typo-avsnitt dekorator__hode__veileder_header">
                <span className="dekorator__hode__veileder_id">{ident}</span>
                <span className="dekorator__hode__veileder_navn">{navn}</span>
            </h2>
        </section>
    );
}

export default Veileder;
