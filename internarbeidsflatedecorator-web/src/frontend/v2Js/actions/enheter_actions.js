import { HENT_ENHETER_FORESPURT, HENT_ENHETER_FEILET, HENTER_ENHETER, ENHETER_HENTET } from './actiontyper';

export function hentEnheterFeilet() {
    return {
        type: HENT_ENHETER_FEILET,
    };
}

export function henterEnheter() {
    return {
        type: HENTER_ENHETER,
    };
}

export function hentEnheter() {
    return {
        type: HENT_ENHETER_FORESPURT
    };
}

export function enheterHentet(data) {
    return {
        type: ENHETER_HENTET,
        data,
    };
}
