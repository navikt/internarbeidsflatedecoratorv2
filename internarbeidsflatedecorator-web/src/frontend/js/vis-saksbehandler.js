import { fetchToJson } from './rest-utils';
import visningsnavn from './brukernavn';

const VEILEDER_URL = `/veilarbveileder/tjenester/veileder`;

export const hentVeilederNavn = (veileder) => {
    if (!veileder.navn) {
        return '';
    }
    return visningsnavn(veileder.navn);
};

export const hentVeilederIdent = (veileder) => {
    if (!veileder.ident) {
        return '';
    }
    return `(${veileder.ident})`;
};

export const hentEnhetNavn = (veileder) => {
    if (!veileder.enhetliste || veileder.enhetliste.length === 0 || !veileder.enhetliste[0].navn) {
        return '';
    }
    return veileder.enhetliste[0].navn;
};

const visVeileder = (veileder) => {
    document.getElementById('js-dekorator-veileder-navn').innerText = hentVeilederNavn(veileder);
    document.getElementById('js-dekorator-veileder-ident').innerText = hentVeilederIdent(veileder);
};

export const visEnhet = (veileder) => {
    document.getElementById('js-dekorator-enhet-navn').innerText = hentEnhetNavn(veileder);
};

const handterFeil = (error) => {
    console.error(error, error.stack); //eslint-disable-line no-console
};

export const hentVeileder = () => {
    return fetchToJson(`${VEILEDER_URL}/me`)
        .then(
            visVeileder,
            handterFeil
        );
};

export const hentEnheter = () => {
    return fetchToJson(`${VEILEDER_URL}/enheter`)
        .then(
            visEnhet,
            handterFeil
        );
};

