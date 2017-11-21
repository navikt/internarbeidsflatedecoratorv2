import React, { PropTypes } from 'react';
import { finnMiljoStreng } from '../sagas/util';

const menyConfig = (fnr) => [{
    tittel: 'Modia',
    lenker: [
        {
            tittel: 'Oversikt',
            url: `https://modapp${finnMiljoStreng()}.adeo.no/modiabrukerdialog/${fnr ? `person/${fnr}` : ''}`,
        },
    ],
}, {
    tittel: 'Oppfølging',
    lenker: [
        {
            tittel: 'Arbeidsmarkedet',
            url: `https://app${finnMiljoStreng()}.adeo.no/mia/ledigestillinger`,
        },
        {
            tittel: 'Enhetsportefolje',
            url: `https://app${finnMiljoStreng()}.adeo.no/veilarbportefoljeflatefs/tilbaketilenhet`,
        },
        {
            tittel: 'Veilederportefølje',
            url: `https://app${finnMiljoStreng()}.adeo.no/veilarbportefoljeflatefs/tilbaketilveileder`,
        },
    ],
}, {
    tittel: 'Sykefravær',
    lenker: [
        {
            tittel: 'Sykefravær',
            url: `https://app${finnMiljoStreng()}.adeo.no/sykefravaersoppfoelging`,
        },
        {
            tittel: 'Fastlege',
            url: `https://app${finnMiljoStreng()}.adeo.no/fastlege`,
        },
    ],
}];

const getLenker = (lenkeobjekt, apen) => {
    const tittel = lenkeobjekt.tittel && <h1 className="typo-innholdstittel">{lenkeobjekt.tittel}</h1>;
    const menyelementer = !apen ? null : (
        <nav className="dekorator__container dekorator__meny">
            {tittel}
            <ul>
                { lenkeobjekt.lenker.map(([href, tekst]) => <li><a href={href} className="typo-normal">{tekst}</a>
                </li>)}
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

const defaultmeny = ({ fnr, apen }) => {
    const dekoratorCls = ['dekorator__nav', apen ? 'dekorator__nav--apen' : ''].join(' ');
    return !apen ? null : (
        <div className={dekoratorCls} aria-controlledby="js-dekorator-toggle-meny">
            <nav className="dekorator__container dekorator__meny">
                <ul className="dekorator__kolonner">
                    {
                        menyConfig(fnr).map((kolonne) => (
                                <li className="dekorator__kolonne">
                                    <h2>{kolonne.tittel}</h2>
                                    {
                                        kolonne.lenker.map((lenke) => (
                                                <li className="kolonne_lenke">
                                                    <a href={lenke.url} className="typo-normal">{lenke.tittel}</a>
                                                </li>
                                            )
                                        )
                                    }
                                </li>
                            )
                        )
                    }
                </ul>
            </nav>
        </div>
    );
};
defaultmeny.propTypes = {
    fnr: PropTypes.string.isRequired,
    apen: PropTypes.bool.isRequired,
};


const Meny = ({ fnr, egendefinerteLenker, apen }) => (
    egendefinerteLenker ? getLenker(egendefinerteLenker, apen) : defaultmeny({ fnr, apen })
);

Meny.propTypes = {
    fnr: PropTypes.string,
    egendefinerteLenker: PropTypes.shape({
        lenker: PropTypes.arrayOf(PropTypes.array(PropTypes.string)),
    }),
    apen: PropTypes.bool,
};

export default Meny;
