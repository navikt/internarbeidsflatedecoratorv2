import React from 'react';
import { EMDASH } from '../utils/string-utils';
import { useSelector } from 'react-redux';
import { State } from '../redux';

function Veileder() {
    const saksbehandler = useSelector((state: State) => state.saksbehandler);
    const ident = saksbehandler.map((data) => data.ident).withDefault(EMDASH);
    const navn = saksbehandler.map((data) => data.navn).withDefault('');

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
