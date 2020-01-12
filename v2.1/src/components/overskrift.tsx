import React from 'react';
import NAVLogo from './logo';
import { useSelector } from 'react-redux';
import { State } from '../redux';

function Overskrift() {
    const appname = useSelector((state: State) => state.appname);

    return (
        <section className="dekorator__hode__logo">
            <NAVLogo />
            <h1 className="typo-element dekorator__tittel">{appname}</h1>
        </section>
    );
}

export default Overskrift;
