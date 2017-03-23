import {
    HENT_ENHETER_FORESPURT,
    HENT_ENHETER_FEILET,
    ENHETER_HENTET,
    HENTER_ENHETER,
    SETT_VALGT_ENHET,
        } from './actiontyper';

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
        type: HENT_ENHETER_FORESPURT,
    };
}

export function enheterHentet(data) {
    return {
        type: ENHETER_HENTET,
        data,
    };
}

export function settValgtEnhet(enhet) {
    return {
        type: SETT_VALGT_ENHET,
        enhet,
    };
}
