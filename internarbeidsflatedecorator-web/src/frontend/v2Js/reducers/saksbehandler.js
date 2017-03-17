import { HENT_SAKSBEHANDLER_FEILET, HENTER_SAKSBEHANDLER, SAKSBEHANDLER_HENTET } from '../actions/actiontyper';

const initiellState = {
    henter: false,
    hentingFeilet: false,
    data: [],
};

export default function saksbehandler(state = initiellState, action) {
    switch (action.type) {
        case HENT_SAKSBEHANDLER_FEILET: {
            return {
                data: [],
                henter: false,
                hentingFeilet: true,
            };
        }
        case HENTER_SAKSBEHANDLER: {
            return {
                data: [],
                henter: true,
                hentingFeilet: false,
            };
        }
        case SAKSBEHANDLER_HENTET: {
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
