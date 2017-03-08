import React, { PropTypes } from 'react';

const Saksbehandler = ({ saksbehandler = { navn: 'Vegard Veileder', ident: 'Z990572' }}) => {
    return (
        <div>
            <span id="js-dekorator-saksbehandler-navn" className="dekorator__hode__veileder_navn">{saksbehandler.navn}</span>
            <span id="js-dekorator-saksbehandler-ident" className="dekorator__hode__veileder_id">({saksbehandler.ident})</span>
        </div>
    );
};

Saksbehandler.propTypes = {
    saksbehandler: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }),
};

export default Saksbehandler;
