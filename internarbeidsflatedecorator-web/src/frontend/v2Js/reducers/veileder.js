import { HENT_VEILEDER_FEILET, HENTER_VEILEDER, VEILEDER_HENTET } from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    data: {},
};

export default function veileder(state = initiellState, action = {}) {
    switch (action.type) {
        case HENT_VEILEDER_FEILET: {
            return {
                data: {},
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENTER_VEILEDER: {
            return {
                data: {},
                henter: true,
                hentingFeilet: false,
            };
        }
        case VEILEDER_HENTET: {
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
