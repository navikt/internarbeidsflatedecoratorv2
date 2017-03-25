import { HENT_VEILEDER_FORESPURT, HENT_VEILEDER_FEILET, HENTER_VEILEDER, VEILEDER_HENTET } from './actiontyper';

export function hentVeilederFeilet() {
    return {
        type: HENT_VEILEDER_FEILET,
    };
}

export function henterVeileder() {
    return {
        type: HENTER_VEILEDER,
    };
}

export function hentVeileder() {
    return {
        type: HENT_VEILEDER_FORESPURT,
    };
}

export function veilederHentet(data) {
    return {
        type: VEILEDER_HENTET,
        data,
    };
}
