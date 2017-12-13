import React, { PropTypes } from 'react';
import Enhet from './Enhet';
import Veileder from './Veileder';
import Sokefelt from '../containers/SokefeltContainer';
import Overskrift from './Overskrift';
import Meny from './Meny';
import Feilmelding from './Feilmelding';
import EnhetVelger from './EnhetVelger';
import { hentValgtEnhetIDFraURL } from '../utils/url-utils';

const defaultPersonsokHandler = (fodselsnummer) => {
    const personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-personsok', true, true);
    personsokEvent.fodselsnummer = fodselsnummer;
    document.dispatchEvent(personsokEvent);
};

const defaultFjernPersonHandler = () => {
    const personsokEvent = document.createEvent('Event');
    personsokEvent.initEvent('dekorator-hode-fjernperson', true, true);
    document.dispatchEvent(personsokEvent);
};

const finnValgtEnhet = (valgtEnhetId, enhetliste) =>
    enhetliste.find(enhet => valgtEnhetId === enhet.enhetId);

export const finnEnhetForVisning = data => {
    if (!data || data.length === 0) {
        return '';
    }

    const valgtEnhet = finnValgtEnhet(hentValgtEnhetIDFraURL(), data.enhetliste);
    if (!valgtEnhet) {
        return data.enhetliste[0];
    }
    return valgtEnhet;
};

const Header = ({
                    applicationName,
                    fnr,
                    autoSubmit,
                    toggles = {},
                    handlePersonsokSubmit,
                    handlePersonsokReset,
                    handleChangeEnhet = () => {},
                    settValgtEnhet,
                    visMeny,
                    enheter,
                    veileder,
                    feilmelding,
                    toggleMeny,
                    valgtEnhet,
                    extraMarkup = { etterSokefelt: null },
                }) => {
    const triggerPersonsokEvent = handlePersonsokSubmit || defaultPersonsokHandler;
    const triggerFjernPersonEvent = handlePersonsokReset || defaultFjernPersonHandler;

    return (
        <div className="dekorator">
            <div className="dekorator__hode" role="banner">
                <div className="dekorator__container">
                    <header className="dekorator__banner">
                        <Overskrift applicationName={applicationName} />
                        <div className="flex-center">
                            { toggles.visEnhet && <Enhet enheter={enheter} /> }
                            { toggles.visEnhetVelger && <EnhetVelger
                                toggleSendEventVedEnEnhet={toggles.toggleSendEventVedEnEnhet}
                                enheter={enheter}
                                handleChangeEnhet={(oppdatertEnhet, endringsType) => {
                                    settValgtEnhet(oppdatertEnhet);
                                    handleChangeEnhet(oppdatertEnhet, endringsType);
                                }}
                                valgtEnhet={valgtEnhet}
                            /> }
                            { toggles.visSokefelt && <Sokefelt
                                triggerPersonsokEvent={triggerPersonsokEvent}
                                triggerFjernPersonEvent={triggerFjernPersonEvent}
                                fnr={fnr}
                                autoSubmit={autoSubmit}
                            /> }
                            { extraMarkup.etterSokefelt && <div dangerouslySetInnerHTML={{ __html: extraMarkup.etterSokefelt }} /> }
                            { toggles.visVeileder && <Veileder veileder={veileder} /> }
                        </div>
                        <section>
                            <button aria-pressed="false"
                                className={`dekorator__hode__toggleMeny ${visMeny ? 'dekorator__hode__toggleMeny--apen' : ''} `}
                                id="js-dekorator-toggle-meny"
                                onClick={() => {
                                    toggleMeny();
                                }}>Meny
                            </button>
                        </section>
                    </header>
                </div>
            </div>
            <Meny apen={visMeny} fnr={fnr} enhet={valgtEnhet} />
            { feilmelding && <Feilmelding feilmelding={feilmelding} /> }
        </div>
    );
};

Header.propTypes = {
    applicationName: PropTypes.string,
    toggles: PropTypes.shape({
        visEnhet: PropTypes.bool,
        visEnhetVelger: PropTypes.bool,
        visSokefelt: PropTypes.bool,
        visVeileder: PropTypes.bool,
        toggleSendEventVedEnEnhet: PropTypes.bool,
    }),
    fnr: PropTypes.string,
    autoSubmit: PropTypes.bool,
    visMeny: PropTypes.bool,
    toggleMeny: PropTypes.func,
    handleChangeEnhet: PropTypes.func,
    handlePersonsokSubmit: PropTypes.func,
    handlePersonsokReset: PropTypes.func,
    settValgtEnhet: PropTypes.func,
    feilmelding: PropTypes.string,
    valgtEnhet: PropTypes.string,
    enheter: PropTypes.shape({
        data: PropTypes.shape({
            navn: PropTypes.string,
        }),
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
    }),
    extraMarkup: PropTypes.shape({ etterSokefelt: PropTypes.String }),
    veileder: PropTypes.shape({
        data: PropTypes.shape({
            navn: PropTypes.string,
            ident: PropTypes.string,
        }),
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
    }),
};

export default Header;
