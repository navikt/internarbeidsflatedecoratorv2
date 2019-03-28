import React, { PropTypes } from 'react';
import { funksjonsomradeLenker, andreSystemerLenker } from './../menyConfig';

export function FunksjonsomradeLenker({ fnr, enhet }) {
    const config = funksjonsomradeLenker(fnr, enhet);
    const kolonner = config.map((topniva) => {
        const lenker = topniva.lenker.filter(lenke => lenke).map((lenke) => (
            <li>
                <a href={lenke.url} onClick={lenke.onClick} className="typo-normal dekorator__menylenke">{lenke.tittel}</a>
            </li>
        ));

        return (
            <section className="dekorator__kolonne">
                <h2 className="dekorator__lenkeheader">{topniva.tittel}</h2>
                <ul className="dekorator__menyliste">{lenker}</ul>
            </section>
        );
    });

    return (
        <div className="dekorator__kolonner">{kolonner}</div>
    );
}

FunksjonsomradeLenker.propTypes = {
    fnr: PropTypes.string.isRequired,
    enhet: PropTypes.string.isRequired,
};

export function AndreSystemerLenker({ fnr, aktorId, enhet }) {
    const config = andreSystemerLenker(fnr, aktorId, enhet);

    const lenker = config.lenker.map((lenke) => (
        <li>
            <a href={lenke.url} className="typo-normal dekorator__menylenke" target="_blank">{lenke.tittel}</a>
        </li>
    ));

    return (
        <section className="dekorator__rad">
            <h2 className="dekorator__lenkeheader">{config.tittel}</h2>
            <ul className="dekorator__menyliste">{lenker}</ul>
        </section>
    );
}

AndreSystemerLenker.propTypes = {
    fnr: PropTypes.string.isRequired,
    aktorId: PropTypes.string,
    enhet: PropTypes.string.isRequired,
};

function Meny({ fnr, aktorId, enhet, apen }) {
    if (!apen) {
        return null;
    }

    return (
        <div className="dekorator__nav dekorator__nav--apen">
            <nav className="dekorator__container dekorator__meny">
                <FunksjonsomradeLenker fnr={fnr} enhet={enhet} />
                <AndreSystemerLenker fnr={fnr} aktorId={aktorId} enhet={enhet} />
            </nav>
        </div>
    );
}

Meny.propTypes = {
    fnr: PropTypes.string.isRequired,
    aktorId: PropTypes.shape({
        data: PropTypes.string,
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
    }),
    enhet: PropTypes.string.isRequired,
    apen: PropTypes.bool.isRequired,
};

export default Meny;
