import {HENT_AKTOR_FEILET, HENTER_AKTOR, AKTOR_HENTET} from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    data: [],
};

export function hentGjeldendeAktorId(data) {
    console('henter gjeldende aktor');
    if (data && data[0]) {
        console.log('har data');
        const fnr = Object.keys(data[0]);
        if(fnr && data[0][fnr]) {
            console.log('har fnr');
            const gjeldendeAktor = data[0][fnr].identer.find(ident => ident.gjeldende === true);
            if (gjeldendeAktor) {
                console.log('fant gjeldende');
                return gjeldendeAktor.ident;
            }
        }
    }
    return undefined;
}

export default function enhet(state = initiellState, action = {}) {
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


