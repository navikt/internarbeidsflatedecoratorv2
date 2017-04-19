import React, { PropTypes } from 'react';

const defaultLenker = (fnr) => (
    {
        lenker: [
            [`/sykefravaer/${fnr}`, 'Sykefravær'],
            ['/moteoversikt', 'Mine dialogmøter'],
            ['/modiabrukerdialog', 'Modia'],
            ['/mia', 'Muligheter i Arbeidslivet'],
        ],
        tittel: 'Lenker',
    }
);

const getLenker = (lenkeobjekt, apen) => {
    const tittel = lenkeobjekt.tittel && <h1 className="typo-innholdstittel">{lenkeobjekt.tittel}</h1>;
    const menyelementer = !apen ? null : (
        <nav className="dekorator__container dekorator__meny">
            {tittel}
            <ul>
                { lenkeobjekt.lenker.map(([href, tekst]) => <li><a href={href} className="typo-normal">{tekst}</a></li>)}
            </ul>
        </nav>
    );
    const dekoratorCls = ['dekorator__nav', apen ? 'dekorator__nav--apen' : ''].join(' ');
    return (
        <div className={dekoratorCls} aria-controlledby="js-dekorator-toggle-meny">
            {menyelementer}
        </div>
    );
};

const Meny = ({ fnr, egendefinerteLenker, apen }) => (
    egendefinerteLenker ? getLenker(egendefinerteLenker, apen) : getLenker(defaultLenker(fnr), apen)
);

Meny.propTypes = {
    fnr: PropTypes.string,
    egendefinerteLenker: PropTypes.shape({
        lenker: PropTypes.arrayOf(PropTypes.array(PropTypes.string)),
    }),
    apen: PropTypes.bool,
};

export default Meny;
