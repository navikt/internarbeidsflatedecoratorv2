import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../redux';

function Feilmelding() {
    const feilmeldinger = useSelector((state: State) => state.feilmeldinger);

    if (feilmeldinger.length === 0) {
        return null;
    }

    const elementer = feilmeldinger
        .map((feilmelding) => <span className="dekorator__feilmelding__tekst">{feilmelding}</span>);

    return (
        <div className="dekorator__feilmelding" aria-live="assertive" role="alert">
            {elementer}
        </div>
    );
}

export default Feilmelding;
