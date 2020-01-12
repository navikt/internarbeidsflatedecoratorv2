import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../redux';

function Feilmelding() {
    const maybeFeilmelding = useSelector((state: State) => state.feilmelding);

    return maybeFeilmelding
        .map((feilmelding) => (
            <div className="dekorator__feilmelding" aria-live="assertive" role="alert">
                <span className="dekorator__feilmelding__tekst">{feilmelding}</span>
            </div>
        ))
        .withDefault(null);
}

export default Feilmelding;
