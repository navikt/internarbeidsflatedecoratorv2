import React, { PropTypes } from 'react';
import Enhet from './Enhet';
import Saksbehandler from './Saksbehandler';
import Sokefelt from './Sokefelt';
import Overskrift from './Overskrift';
import Meny from './Meny';
import Feilmelding from './Feilmelding';

const Header = ({ applicationName, fnr, toggles = {}, visMeny, enheter, saksbehandler, feilmelding }) => {
    return (
        <div className="dekorator">
            <div className="dekorator__hode" role="banner" id="js-dekorator-hode">
                <div className="dekorator__container" id="js-dekorator-hode-container">
                    <header className="dekorator__banner">
                        <Overskrift applicationName={applicationName} />
                        { toggles.visEnhet && <Enhet enheter={enheter} /> }
                        { toggles.visSokefelt && <Sokefelt /> }
                        { toggles.visSaksbehandler && <Saksbehandler saksbehandler={saksbehandler} /> }
                        <button aria-pressed="false" className="dekorator__hode__toggleMeny" onClick={() => console.log("klikket")}>Meny
                        </button>
                    </header>
                </div>
            </div>
            { visMeny && <Meny fnr={fnr} /> }
            <Feilmelding feilmelding={feilmelding} />
        </div>
    );
};

Header.propTypes = {
    henterSaksbehandler: PropTypes.bool,
    hentingSaksbehandlerFeilet: PropTypes.bool,
    applicationName: PropTypes.string,
    toggles: PropTypes.shape({
        visEnhet: PropTypes.bool,
        visSokefelt: PropTypes.bool,
        visSaksbehandler: PropTypes.bool,
    }),
    fnr: PropTypes.string,
    visMeny: PropTypes.bool,
    feilmelding: PropTypes.string,
    enhet: PropTypes.shape({
        navn: PropTypes.string,
    }),
    saksbehandler: PropTypes.shape({
        navn: PropTypes.string,
        ident: PropTypes.string,
    }),
};

export default Header;
