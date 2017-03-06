import { fetchToJson } from './rest-utils';
import visningsnavn from './brukernavn';

const VEILEDER_URL = `/veilarbveileder/tjenester/veileder`;

const visVeileder = (veileder) => {
    if (!veileder.navn || !veileder.ident) {
        return;
    }
    document.getElementById('js-dekorator-veileder-navn').innerText = visningsnavn(veileder.navn);
    document.getElementById('js-dekorator-veileder-ident').innerText = `(${veileder.ident})`;
};

const visEnhet = (veileder) => {
    if (!veileder.enhetliste || veileder.enhetliste.length === 0 || !veileder.enhetliste[0].navn) {
        return;
    }
    document.getElementById('js-dekorator-enhet-navn').innerText = veileder.enhetliste[0].navn;
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

