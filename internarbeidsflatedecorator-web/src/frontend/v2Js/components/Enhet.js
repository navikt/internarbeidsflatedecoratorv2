import React, { PropTypes } from 'react';

import { EMDASH } from '../utils/utils';

const Enhet = ({ enheter }) => {
    let navn = '';

    if (enheter.henter) {
        navn = '';
    } else if (enheter.hentingFeilet) {
        navn = EMDASH;
    } else {
        navn = enheter.data.navn;
    }

    return (
        <span aria-pressed="false" className="dekorator__hode__enhet">
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
