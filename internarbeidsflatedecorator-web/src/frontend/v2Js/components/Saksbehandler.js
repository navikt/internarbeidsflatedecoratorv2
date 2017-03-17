import React, { PropTypes } from 'react';

const Saksbehandler = ({ saksbehandler }) => {
    let navn = '';
    let ident = '';

    if (saksbehandler.henter) {
        navn = 'Henter...';
    } else if (saksbehandler.hentingFeilet) {
        navn = 'Henting av veilederdata feilet';
    } else {
        navn = saksbehandler.data.navn;
        ident = `(${saksbehandler.data.ident})`;
    }

    return (
        <div className="dekorator__hode__veileder_container">
            <span className="dekorator__hode__veileder_navn">{navn}</span>
            <span className="dekorator__hode__veileder_id">{ident}</span>
        </div>
    );
};

Saksbehandler.propTypes = {
    saksbehandler: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }),
    henterSaksbehandler: PropTypes.bool,
    hentingSaksbehandlerFeilet: PropTypes.bool,
};

export default Saksbehandler;
