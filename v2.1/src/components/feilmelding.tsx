import React from 'react';
import {useInitializedState} from "../hooks/use-initialized-state";

function Feilmelding() {
    const feilmeldinger = useInitializedState((state) => state.feilmeldinger);

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
