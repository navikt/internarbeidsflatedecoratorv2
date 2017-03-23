import React, { PropTypes } from 'react';

const visningsnavnFraEnhet = (enhet) => (
    `${enhet.enhetId} ${enhet.navn}`
);

const mapEnhetTilHtml = (enhet) => (
        <option value={enhet.enhetId}>
            { visningsnavnFraEnhet(enhet) }
        </option>
    );

const hentEnhetListeInnerHTML = (enhetliste, initiellEnhet, handleChangeEnhet) => {
    if (enhetliste.length === 1) {
        return (<div className="dekorator-enhet">
            <span>{visningsnavnFraEnhet(enhetliste[0])}</span></div>);
    }
    return (
        <div className="dekorator-select-container">
            <select value={initiellEnhet} onChange={(event) => { handleChangeEnhet(event, event.srcElement.value); }}>
                { enhetliste.map((enhet) => mapEnhetTilHtml(enhet))}
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
