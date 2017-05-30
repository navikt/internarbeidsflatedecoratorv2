import React, { PropTypes } from 'react';

import { EMDASH } from '../utils/utils';
import visningsnavn from '../utils/veiledernavn';

const Veileder = ({ veileder }) => {
    let navn = '';
    let ident = '';

    if (veileder.henter) {
        navn = '';
    } else if (veileder.hentingFeilet) {
        navn = EMDASH;
    } else {
        navn = visningsnavn(veileder.data.navn);
        ident = `${veileder.data.ident}`;
    }

    return (
        <section className="dekorator__hode__veileder_container">
            <h1 className="typo-avsnitt dekorator__hode__veileder_header">
                <span className="dekorator__hode__veileder_id">{ident}</span>
                <span className="dekorator__hode__veileder_navn">{navn}</span>
            </h1>
        </section>
    );
};

Veileder.propTypes = {
    veileder: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }),
    henterVeileder: PropTypes.bool,
    hentingVeilederFeilet: PropTypes.bool,
};

export default Veileder;
