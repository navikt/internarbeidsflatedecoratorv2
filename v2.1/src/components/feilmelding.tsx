import React from 'react';
import { useSelector } from 'react-redux';
import { State } from '../redux/reducer';

function Feilmelding() {
    const feilmeldinger = useSelector((state: State) => state.feilmeldinger);
    if (feilmeldinger.length === 0) {
        return null;
    }

    const elementer = feilmeldinger
        .sort((a, b) => b.level - a.level)
        .map((feilmelding) => {
            return (
                <span className="dekorator__feilmelding__tekst" key={feilmelding.message}>
                    {feilmelding.message}
                </span>
            );
        });

    return (
        <div className="dekorator__feilmelding" aria-live="assertive" role="alert">
            {elementer}
        </div>
    );
}

export default Feilmelding;
