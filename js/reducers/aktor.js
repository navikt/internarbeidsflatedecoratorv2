import {HENT_AKTOR_FEILET, HENTER_AKTOR, AKTOR_HENTET} from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    data: [],
};

export function hentGjeldendeAktorId(data) {
    if (data) {
        const fnr = Object.keys(data);
        if(fnr && data[fnr]) {
            const gjeldendeAktor = data[fnr].identer.find(ident => ident.gjeldende === true);
            if (gjeldendeAktor) {
                return gjeldendeAktor.ident;
            }
        }
    }
    return undefined;
}

export default function aktor(state = initiellState, action = {}) {
    switch (action.type) {
        case HENT_AKTOR_FEILET: {
            return {
                ...state,
                data: [],
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENTER_AKTOR: {
            return {
                ...state,
                data: [],
                henter: true,
                hentingFeilet: false,
            };
        }
        case AKTOR_HENTET: {
            return {
                ...state,
                henter: false,
                hentingFeilet: false,
                data: hentGjeldendeAktorId(action.data),
            };
        }
        default: {
            return state;
        }
    }
}


