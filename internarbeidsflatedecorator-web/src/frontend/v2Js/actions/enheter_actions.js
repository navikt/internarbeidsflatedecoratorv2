import { HENT_ENHETER_FORESPURT, HENT_ENHETER_FEILET, ENHETER_HENTET } from './actiontyper';

export function hentEnheterFeilet() {
    return {
        type: HENT_ENHETER_FEILET,
    };
}

export function hentEnheter() {
    return {
        type: HENT_ENHETER_FORESPURT,
    };
}

export function enheterHentet(data) {
    return {
        type: ENHETER_HENTET,
        data,
    };
}
