import React, { PropTypes } from 'react';
import NAVLogo from './NAVLogo';

const Overskrift = ({ applicationName='' }) => {
    return (
        <h1 className="dekorator__tittel">
            <span className="dekorator__hode__logo">
            <NAVLogo />
            <span className="dekorator__hode__tittel">{applicationName}</span>
            </span>
        </h1>
    );
};

export default Overskrift;
