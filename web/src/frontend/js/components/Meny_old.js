import React, { PropTypes } from 'react';
import { finnMiljoStreng } from '../sagas/util';

const modappDomain = `https://modapp-${finnMiljoStreng()}.adeo.no`;
const appDomain = `https://modapp-${finnMiljoStreng()}.adeo.no`;
const menyConfig = (fnr) => [
    {
        tittel: 'Oppfølging',
        lenker: [
            {
                tittel: 'Arbeidsmarkedet',
                url: `${appDomain}/mia/ledigestillinger`,
            },
            {
                tittel: 'Enhetens oversikt',
                url: `${appDomain}/veilarbportefoljeflatefs/tilbaketilenhet`,
            },
            {
                tittel: 'Min oversikt',
                url: `${appDomain}/veilarbportefoljeflatefs/tilbaketilveileder`,
            },
            {
                tittel: 'Personoversikt',
                url: `${appDomain}/veilarbpersonflatefs/${fnr ? fnr : ''}`,
            },
            {
                tittel: 'Sykefraværsoppfolging',
                url: `${modappDomain}/moteoversikt`,
            },
        ],
    },
    {
        tittel: 'Brukerdialog',
        lenker: [
            {
                tittel: 'Modia/Søk',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}` : ''}`,
            },
            {
                tittel: 'Saksoversikt',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!saksoversikt` : ''}`,
            },
            {
                tittel: 'Sykepenger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!sykepenger` : ''}`,
            },
            {
                tittel: 'Foreldrepenger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!foreldrepenger` : ''}`,
            },
            {
                tittel: 'Meldinger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!meldinger` : ''}`,
            },
            {
                tittel: 'Varslinger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!varsling` : ''}`,
            },
            {
                tittel: 'Utbetalinger',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!utbetalinger` : ''}`,
            },
            {
                tittel: 'Oppfolging',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!kontrakter` : ''}`,
            },
            {
                tittel: 'Brukerprofil',
                url: `${modappDomain}/modiabrukerdialog/${fnr ? `person/${fnr}#!brukerprofil` : ''}`,
            },
        ],
    },
    ];

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
