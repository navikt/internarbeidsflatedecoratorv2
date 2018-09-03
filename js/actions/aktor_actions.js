import {
    HENT_AKTOR_FORESPURT,
    HENT_AKTOR_FEILET,
    AKTOR_HENTET,
    HENTER_AKTOR,
        } from './actiontyper';

const url = '/aktoerregister/api/v1/identer?identgruppe=AktoerId';

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

export function hentAktor(fnr) {
    const data = {
        url: url,
        fnr: fnr,
    }
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

