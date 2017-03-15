import React, { PropTypes } from 'react';

const defaultLenker = ( fnr ) => {
    return ([
        [`/sykefravaer/${fnr}`, 'Sykefravær'],
        ['/moteoversikt', 'Mine dialogmøter'],
        ['/modiabrukerdialog', 'Modia'],
        ['/mia', 'Muligheter i Arbeidslivet'],
    ]);
};

const getLenker = (lenker) => {
    return (
        <div id="js-dekorator-nav-container" className="dekorator__nav dekorator__nav--apen" aria-controlledby="js-dekorator-toggle-meny">
            <nav id="js-dekorator-nav" className="dekorator__container dekorator__meny">
                <h2>Lenker</h2>
                <ul>
                    { lenker.map( ([href, tekst]) => <li><a href={href}>{tekst}</a></li> )}
                </ul>
            </nav>
        </div>
    );
};


const Meny = ({ fnr, egendefinerteLenker }) => {
    return egendefinerteLenker ? getLenker(egendefinerteLenker) : getLenker(defaultLenker(fnr))
};

Meny.propTypes = {
    fnr: PropTypes.string,
};

export default Meny;
