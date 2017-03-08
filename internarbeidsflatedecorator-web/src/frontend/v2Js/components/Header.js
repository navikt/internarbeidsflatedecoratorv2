import React, { PropTypes } from 'react';
import Enhet from './Enhet';
import Saksbehandler from './Saksbehandler';
import Sokefelt from './Sokefelt';
import Overskrift from './Overskrift';
import Meny from './Meny';
import Feilmelding from './Feilmelding';

const Header = ({ applicationName, fnr, toggles = {}, enhet, saksbehandler, feilmelding }) => {
    return (
        <div className="dekorator">
            <div className="dekorator__hode" role="banner" id="js-dekorator-hode">
                <div className="dekorator__container" id="js-dekorator-hode-container">
                    <header className="dekorator__banner">
                        <Overskrift applicationName={applicationName} />
                        { toggles.visEnhet && <Enhet enhet={enhet} /> }
                        { toggles.visSokefelt && <Sokefelt /> }
                        { toggles.visSaksbehandler && <Saksbehandler saksbehandler={saksbehandler} /> }
                        <button aria-pressed="false" className="dekorator__hode__toggleMeny"
                                id="js-dekorator-toggle-meny">Meny
                        </button>
                    </header>
                </div>
            </div>
            <Meny fnr={fnr} />
            <Feilmelding feilmelding={feilmelding} />
        </div>
    );
};

Header.propTypes = {
    applicationName: PropTypes.string,
    toggles: PropTypes.shape({
        visEnhet: PropTypes.bool,
        visSokefelt: PropTypes.bool,
        visSaksbehandler: PropTypes.bool,
    }),
    fnr: PropTypes.string,
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
