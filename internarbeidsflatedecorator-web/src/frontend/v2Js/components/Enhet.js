import React, { PropTypes } from 'react';

const Enhet = ({ enhet }) => {
    return (
        <span aria-pressed="false" className="dekorator__hode__enhet">
            { enhet && enhet.navn }
        </span>
    );
};

Enhet.propTypes = {
    enhet: PropTypes.shape({
        navn: PropTypes.string,
    }),
};

export default Enhet;
