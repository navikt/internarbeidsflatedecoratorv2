import React, { useContext } from 'react';
import { AppContext } from '../application';
import NAVLogo from './logo';

function Overskrift() {
    const context = useContext(AppContext);

    return (
        <section className="dekorator__hode__logo">
            <NAVLogo />
            <h1 className="typo-element dekorator__tittel">{context.appname}</h1>
        </section>
    );
}

export default Overskrift;
