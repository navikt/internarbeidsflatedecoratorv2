import React, { PropTypes } from 'react';

const mapEnhetTilHtml = (enhet) => (
        <option value={enhet.enhetId}>
            {`${enhet.enhetId} ${enhet.navn}`}
        </option>
    );

const hentEnhetListeInnerHTML = (enhetliste, initiellEnhet, handleChangeEnhet) => {
    if (enhetliste.length === 1) {
        return (<div className="dekorator-enhet">
            <span>{`${enhetliste[0].enhetId} ${enhetliste[0].navn}`}</span></div>);
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
        enhet: PropTypes.shape({
            enhetId: PropTypes.string,
            navn: PropTypes.string,
        }),
    }),
    initiellEnhet: PropTypes.shape({
        enhetId: PropTypes.string,
        navn: PropTypes.string,
    }),
    handleChangeEnhet: PropTypes.func,
};

export default EnhetVelger;
