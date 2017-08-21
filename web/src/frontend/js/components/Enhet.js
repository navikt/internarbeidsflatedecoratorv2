import React, { PropTypes } from 'react';

import { EMDASH } from '../utils/utils';

const Enhet = ({ enheter }) => {
    let visningsTekst = '';

    if (enheter.henter) {
        visningsTekst = '';
    } else if (enheter.hentingFeilet) {
        visningsTekst = EMDASH;
    } else {
        const enhet = finnEnhetForVisning(enheter.data.enhetliste);
        visningsTekst = `${enhet.enhetId} ${enhet.navn}`;
    }

    return (
        <span className="dekorator__hode__enhet">
            {visningsTekst}
        </span>
    );
};

Enhet.propTypes = {
    enheter: PropTypes.arrayOf({
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
        data: PropTypes.shape({
            navn: PropTypes.string,
        }),
    }),
};

export default Enhet;
