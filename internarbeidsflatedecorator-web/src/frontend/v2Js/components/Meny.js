import React, { PropTypes } from 'react';

const defaultLenker = ( fnr ) => {
    return (
        {
            lenker:
        [
            [`/sykefravaer/${fnr}`, 'Sykefravær'],
            ['/moteoversikt', 'Mine dialogmøter'],
            ['/modiabrukerdialog', 'Modia'],
            ['/mia', 'Muligheter i Arbeidslivet'],
        ],
            tittel:
            'Lenker'
        }

    );
};

const getLenker = (lenkeobjekt) => {
    return (
        <div className="dekorator__nav dekorator__nav--apen" aria-controlledby="js-dekorator-toggle-meny">
            <nav className="dekorator__container dekorator__meny">
                <h2>{lenkeobjekt.tittel}</h2>
                <ul>
                    { lenkeobjekt.lenker.map( ([href, tekst]) => <li><a href={href}>{tekst}</a></li> )}
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
    egendefinerteLenker: PropTypes.shape({
        lenker: PropTypes.arrayOf(PropTypes.array(PropTypes.string))
    })
};

export default Meny;
