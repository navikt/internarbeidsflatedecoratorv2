import React, { PropTypes } from 'react';

const Overskrift = ({ applicationName='' }) => {
    return (
        <h1 className="dekorator__tittel">
            <a href="/" className="dekorator__hode__logo" id="js-dekorator-hjem">
                <span className="dekorator__hode__tittel">{applicationName}</span>
            </a>
        </h1>
    );
};

export default Overskrift;
