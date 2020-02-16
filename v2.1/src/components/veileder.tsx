import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../redux';
import { EMDASH } from '../utils/string-utils';
import visibleIf from "./visibleIf";

function Veileder() {
    const saksbehandler = useSelector((state: State) => state.data.saksbehandler);
    const ident = saksbehandler.map((data) => data.ident).withDefault(EMDASH);
    const navn = saksbehandler.map((data) => data.navn).withDefault('');

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
