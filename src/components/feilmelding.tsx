import React from 'react';
import { useSelector } from 'react-redux';
import { feilmeldingerSelector } from '../redux/feilmeldinger/reducer';
import { Feilmelding } from '../redux/feilmeldinger/domain';
import './feilmelding.css';

function FeilmeldingVisning() {
    const feilmeldinger: Array<Feilmelding> = Object.values(useSelector(feilmeldingerSelector));
    if (feilmeldinger.length === 0) {
        return null;
    } else if (feilmeldinger.length === 1) {
        return (
            <div className="dekorator__feilmelding">
                <span className="dekorator__feilmelding__tekst">
                    {feilmeldinger[0].melding} ({feilmeldinger[0].kode})
                </span>
            </div>
        );
    } else {
        const feilkoder = feilmeldinger
            .sort((a, b) => a.kode.localeCompare(b.kode))
            .map((feilmelding) => (
                <>
                    <abbr title={feilmelding.melding}>{feilmelding.kode}</abbr>{' '}
                </>
            ));

        return (
            <div className="dekorator__feilmelding" aria-live="assertive" role="alert">
                <span className="dekorator__feilmelding__tekst">
                    Det oppstod flere feil; {feilkoder}
                </span>
            </div>
        );
    }
}

export default FeilmeldingVisning;
