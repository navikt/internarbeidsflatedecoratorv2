import React, { PropTypes } from 'react';

import { EMDASH } from '../utils/utils';
import { hentValgtEnhetIDFraURL } from '../utils/url-utils';

const finnValgtEnhet = (valgtEnhetId, enhetliste) =>
    enhetliste.find(enhet => valgtEnhetId === enhet.enhetId);

const finnEnhetForVisning = enhetliste => {
    if (enhetliste.length === 0) {
        return '';
    }

    const valgtEnhet = finnValgtEnhet(hentValgtEnhetIDFraURL(), enhetliste);
    if (!valgtEnhet) {
        return enhetliste[0].navn;
    }
    return valgtEnhet.navn;
};

const Enhet = ({ enheter }) => {
    let navn = '';

    if (enheter.henter) {
        navn = '';
    } else if (enheter.hentingFeilet) {
        navn = EMDASH;
    } else {
        navn = finnEnhetForVisning(enheter.data.enhetliste);
    }

    return (
        <span className="dekorator__hode__enhet">
            {navn}
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
