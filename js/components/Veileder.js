import React, { PropTypes } from 'react';

import { EMDASH } from '../utils/utils';
import visningsnavn from '../utils/veiledernavn';

const Veileder = ({ veileder, nameCase }) => {
    let navn = '';
    let ident = '';

    if (veileder.henter) {
        navn = '';
    } else if (veileder.hentingFeilet) {
        navn = EMDASH;
    } else {
        navn = visningsnavn(veileder.data.navn, nameCase);
        ident = `${veileder.data.ident}`;
    }

    return (
        <section className="dekorator__hode__veileder_container">
            <h2 className="typo-avsnitt dekorator__hode__veileder_header">
                <span className="dekorator__hode__veileder_id">{ident}</span>
                <span className="dekorator__hode__veileder_navn">{navn}</span>
            </h2>
        </section>
    );
};

Veileder.propTypes = {
    veileder: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }),
    nameCase: PropTypes.bool,
    henterVeileder: PropTypes.bool,
    hentingVeilederFeilet: PropTypes.bool,
};

export default Veileder;
