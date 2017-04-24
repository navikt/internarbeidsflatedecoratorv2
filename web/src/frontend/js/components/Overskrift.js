import React, { PropTypes } from 'react';
import NAVLogo from './NAVLogo';

const Overskrift = ({ applicationName = '' }) => (
    <section className="dekorator__hode__logo">
        <NAVLogo />
        <h1 className="typo-element">
            {applicationName}
        </h1>
    </section>
);

Overskrift.propTypes = {
    applicationName: PropTypes.string,
};

export default Overskrift;
