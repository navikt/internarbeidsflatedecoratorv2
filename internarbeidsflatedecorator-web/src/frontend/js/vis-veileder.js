import queryString from 'query-string'

import config from './config';
import { fetchToJson } from './rest-utils';
import { mockFetchVeileder, mockFetchEnheter} from './mock/mock';
import visningsnavn from './brukernavn';

const emdashCharacterCode = 8212;
const EMDASH = String.fromCharCode(emdashCharacterCode);

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

const hentValgtEnhetFraURL = (veileder) => {
    const queries = queryString.parse(location.search);
    return veileder.enhetliste.find(enhet => enhet.id === queries.valgtEnhet);
};

const hentValgtEnhet = (veileder) => {
    const valgtEnhet = hentValgtEnhetFraURL(veileder);
    if (!valgtEnhet) {
        return veileder.enhetliste[0];
    }
    return valgtEnhet;
};

export const hentEnhetNavn = (veileder) => {
    if (!veileder.enhetliste || veileder.enhetliste.length === 0) {
        return '';
    }

    const valgtEnhet = hentValgtEnhet(veileder);
    if (!valgtEnhet.navn) {
        return '';
    }

    return valgtEnhet.navn;
};

const visVeileder = (veileder) => {
    document.getElementById('js-dekorator-veileder-navn').innerText = hentVeilederNavn(veileder);
    document.getElementById('js-dekorator-veileder-ident').innerText = hentVeilederIdent(veileder);
};

export const visEnhet = (veileder) => {
    document.getElementById('js-dekorator-enhet-navn').innerText = hentEnhetNavn(veileder);
};

const handterHentVeilederFeil = (error) => {
    document.getElementById('js-dekorator-veileder-navn').innerText = EMDASH;
    console.error(error, error.stack); //eslint-disable-line no-console
};

const handterHentEnheterFeil = (error) => {
    document.getElementById('js-dekorator-enhet-navn').innerText = EMDASH;
    console.error(error, error.stack); //eslint-disable-line no-console
};

export const hentVeileder = () => {
    if (config.mockVeilederKall) {
        return mockFetchVeileder().then(visVeileder);
    }

    return fetchToJson(`${VEILEDER_URL}/me`)
        .then(
            visVeileder,
            handterHentVeilederFeil
        );
};

export const hentEnheter = () => {
    if (config.mockEnheterKall) {
        return mockFetchEnheter().then(visEnhet);
    }

    return fetchToJson(`${VEILEDER_URL}/enheter`)
        .then(
            visEnhet,
            handterHentEnheterFeil
        );
};

