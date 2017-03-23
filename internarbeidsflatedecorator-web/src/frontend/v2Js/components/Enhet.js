import React, { PropTypes } from 'react';

import { EMDASH } from '../utils/utils';

const finnValgtEnhet = enhetliste => {
    if (enhetliste.length === 0) {
        return '';
    }
    return enhetliste[0].navn;
};

const Enhet = ({ enheter }) => {
    let navn = '';

    if (enheter.henter) {
        navn = '';
    } else if (enheter.hentingFeilet) {
        navn = EMDASH;
    } else {
        navn = finnValgtEnhet(enheter.data.enhetliste);
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
