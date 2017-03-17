import { HENT_ENHETER_FEILET, HENT_ENHETER_FORESPURT, ENHETER_HENTET } from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    data: [],
};

export default function enhet(state = initiellState, action = {}) {
    switch (action.type) {
        case HENT_ENHETER_FEILET: {
            return {
                data: [],
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENT_ENHETER_FORESPURT: {
            return {
                data: [],
                henter: true,
                hentingFeilet: false,
            };
        }
        case ENHETER_HENTET: {
            return {
                henter: false,
                hentingFeilet: false,
                data: action.data,
            };
        }
        default: {
            return state;
        }
    }
}
