import { HENT_ENHETER_FEILET, HENTER_ENHETER, ENHETER_HENTET, ENHET_VALGT } from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    data: [],
};

export default function enhet(state = initiellState, action = {}) {
    switch (action.type) {
        case HENT_ENHETER_FEILET: {
            return {
                ...state,
                data: [],
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENTER_ENHETER: {
            return {
                ...state,
                data: [],
                henter: true,
                hentingFeilet: false,
            };
        }
        case ENHETER_HENTET: {
            return {
                ...state,
                henter: false,
                hentingFeilet: false,
                data: action.data,
            };
        }
        case ENHET_VALGT: {
            return {
                ...state,
                valgtEnhet: action.enhet,
            };
        }
        default: {
            return state;
        }
    }
}
