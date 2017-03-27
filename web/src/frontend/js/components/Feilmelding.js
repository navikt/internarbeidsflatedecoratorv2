import React, { PropTypes } from 'react';

const Feilmelding = ({ feilmelding }) => (
        <div className="dekorator__feilmelding" aria-live="polite" role="alert">
            <span className="dekorator__feilmelding__tekst">{feilmelding}</span>
        </div>
);

Feilmelding.propTypes = {
    feilmelding: PropTypes.string,
};

export default Feilmelding;
