import {
    HENT_AKTOR_FORESPURT,
    HENT_AKTOR_FEILET,
    AKTOR_HENTET,
    HENTER_AKTOR,
        } from './actiontyper';

export function hentAktorFeilet() {
    return {
        type: HENT_AKTOR_FEILET,
    };
}

export function henterAktor() {
    return {
        type: HENTER_AKTOR,
    };
}

export function hentAktor(data) {
    return {
        type: HENT_AKTOR_FORESPURT,
        data,
    };
}

export function aktorHentet(data) {
    return {
        type: AKTOR_HENTET,
        data,
    };
}

