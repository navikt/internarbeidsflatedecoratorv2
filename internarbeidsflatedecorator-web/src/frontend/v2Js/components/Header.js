import React, { PropTypes } from 'react';
import Enhet from './Enhet';
import Saksbehandler from './Saksbehandler';
import Sokefelt from './Sokefelt';
import Overskrift from './Overskrift';
import Meny from './Meny';
import Feilmelding from './Feilmelding';

const Header = ({ applicationName, fnr, toggles = {}, visMeny, enheter, saksbehandler, feilmelding, toggleMeny }) => {
    return (
        <div className="dekorator">
            <div className="dekorator__hode" role="banner" id="js-dekorator-hode">
                <div className="dekorator__container" id="js-dekorator-hode-container">
                    <header className="dekorator__banner">
                        <Overskrift applicationName={applicationName} />
                        { toggles.visEnhet && <Enhet enheter={enheter} /> }
                        { toggles.visSokefelt && <Sokefelt /> }
                        { toggles.visSaksbehandler && <Saksbehandler saksbehandler={saksbehandler} /> }
                        <button aria-pressed="false" value="Meny" className={`dekorator__hode__toggleMeny ${visMeny ? 'dekorator__hode__toggleMeny --apen' : ''} `} onClick={() => {toggleMeny()}} />
                    </header>
                </div>
            </div>
            { visMeny && <Meny fnr={fnr} /> }
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
    visMeny: PropTypes.bool,
    toggleMeny: PropTypes.func,
    feilmelding: PropTypes.string,
    enheter: PropTypes.shape({
        data: PropTypes.shape({
            navn: PropTypes.string,
        }),
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
    }),
    saksbehandler: PropTypes.shape({
        data: PropTypes.shape({
            navn: PropTypes.string,
            ident: PropTypes.string,
        }),
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
    }),
};

export default Header;
