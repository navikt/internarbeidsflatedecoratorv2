import React, {PropTypes} from 'react';

import { EMDASH } from '../utils/utils';

const Veileder  = ({veileder}) => {
    let navn = '';
    let ident = '';

    if (veileder.henter) {
        navn = '';
    } else if (veileder.hentingFeilet) {
        navn = EMDASH;
    } else {
        navn = veileder.data.navn;
        ident = `(${veileder.data.ident})`;
    }

    return <div className="dekorator__hode__veileder_container">
        <span className="dekorator__hode__veileder_navn">{navn}</span>
        <span className="dekorator__hode__veileder_id">{ident}</span>
    </div>;
};

Veileder.propTypes = {
    veileder             : PropTypes.shape({
        navn : PropTypes.string,
        ident: PropTypes.string,
    }),
    henterVeileder       : PropTypes.bool,
    hentingVeilederFeilet: PropTypes.bool,
};

export default Veileder;
