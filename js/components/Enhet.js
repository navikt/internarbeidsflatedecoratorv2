import React, { PropTypes } from 'react';
import { finnEnhetForVisning } from './Header';

import { EMDASH } from '../utils/utils';

const Enhet = ({ valgtEnhet, enheter }) => {
    let visningsTekst = '';

    if (enheter.henter) {
        visningsTekst = '';
    } else if (enheter.hentingFeilet) {
        visningsTekst = EMDASH;
    } else {
        const enhet = finnEnhetForVisning(valgtEnhet, enheter.data);
        visningsTekst = `${enhet.enhetId} ${enhet.navn}`;
    }

    return (
        <span className="dekorator__hode__enhet">
            {visningsTekst}
        </span>
    );
};

Enhet.propTypes = {
    valgtEnhet: PropTypes.string,
    enheter: PropTypes.arrayOf({
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
        data: PropTypes.shape({
            navn: PropTypes.string,
        }),
    }),
};

export default Enhet;
