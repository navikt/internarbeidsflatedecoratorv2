import React, { useContext } from 'react';
import { AppContext } from '../application';

function Feilmelding() {
    const context = useContext(AppContext);

    return context.feilmelding.value
        .map((feilmelding) => (
            <div className="dekorator__feilmelding" aria-live="assertive" role="alert">
                <span className="dekorator__feilmelding__tekst">{feilmelding}</span>
            </div>
        ))
        .withDefault(null);

}

export default Feilmelding;
