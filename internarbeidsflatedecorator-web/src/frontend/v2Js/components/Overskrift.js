import React, { PropTypes } from 'react';
import NAVLogo from './NAVLogo';

const Overskrift = ({ applicationName = '' }) => {
    return (
        <h1 className="dekorator__tittel">
            <div className="dekorator__hode__logo">
                <NAVLogo />
                <span className="dekorator__hode__tittel">{applicationName}</span>
            </div>
        </h1>
    );
};

Overskrift.propTypes = {
    applicationName: PropTypes.string,
};

export default Overskrift;
