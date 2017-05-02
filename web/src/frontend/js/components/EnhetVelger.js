import React, { PropTypes } from 'react';

const hentEnhetListeInnerHTML = (enhetliste, initiellEnhet = undefined, handleChangeEnhet) => {
    if (enhetliste.length === 1) {
        handleChangeEnhet(enhetliste[0].enhetId);
        return (
            <section className="dekorator-enhet">
                <h1 className="typo-avsnitt">{`${enhetliste[0].enhetId} ${enhetliste[0].navn}`}</h1>
            </section>
        );
    }
    const options = enhetliste.map((enhet) => <option value={enhet.enhetId}>{`${enhet.enhetId} ${enhet.navn}`}</option>);

    const onChange = (event) => {
        if (event.type === 'change') { // Må sjekke ettersom chrome fyrer av change og input ved onChange. Dersom man bruker onInput fanges ikke det opp av IE.
            handleChangeEnhet(event.srcElement.value);
        }
    };
    return (
        <div className="dekorator-select-container">
            <select value={initiellEnhet || enhetliste[0].enhetId} onChange={onChange}>
                {options}
            </select>
        </div>
    );
};

const EnhetVelger = ({ enheter, initiellEnhet, handleChangeEnhet }) => {
    if (enheter.henter) {
        return <span aria-pressed="false" className="dekorator__hode__enhet">Henter...</span>;
    } else if (enheter.hentingFeilet) {
        return <span aria-pressed="false" className="dekorator__hode__enhet">Kunne ikke hente enheter</span>;
    }
    return hentEnhetListeInnerHTML(enheter.data.enhetliste, initiellEnhet, handleChangeEnhet);
};

EnhetVelger.propTypes = {
    enheter: PropTypes.arrayOf({
        henter: PropTypes.bool,
        hentingFeilet: PropTypes.bool,
        data: PropTypes.shape({
            enhetListe: PropTypes.arrayOf({
                enhetId: PropTypes.string,
                navn: PropTypes.string,
            }),
        }),
    }),
    initiellEnhet: PropTypes.string,
    handleChangeEnhet: PropTypes.func,
};

export default EnhetVelger;
