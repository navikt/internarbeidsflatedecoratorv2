import React, { PropTypes } from 'react';

const Enhet = ({ enheter }) => {
    let navn = '';

    if (enheter.henter) {
        navn = 'Henter...';
    } else if (enheter.hentingFeilet) {
        navn = 'Fant ikke enhet';
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
    enhet: PropTypes.shape({
        navn: PropTypes.string,
    }),
};

export default Enhet;
