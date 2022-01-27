import React from 'react';
import NAVLogo from './logo';

interface Props {
    appname: string;
}

function Overskrift(props: Props) {
    return (
        <section className="dekorator__hode__logo">
            <NAVLogo />
            <h1 className="typo-element dekorator__tittel">{props.appname}</h1>
        </section>
    );
}

export default Overskrift;
