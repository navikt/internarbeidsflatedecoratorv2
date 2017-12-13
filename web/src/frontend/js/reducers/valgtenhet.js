import { ENHETER_HENTET, SETT_VALGT_ENHET } from '../actions/actiontyper';

const initiellState = {
    valgtEnhet: null,
};

export default function valgtenhet(state = initiellState, action = {}) {
    switch (action.type) {
        case SETT_VALGT_ENHET: {
            return { valgtEnhet: action.data };
        }
        case ENHETER_HENTET: {
            // I tilfeller hvor initiell enhet ikke er satt så setter vi automatisk første i listen
            if (state.valgtEnhet === null && action.data.enhetliste.length > 0) {
                return { valgtEnhet: action.data.enhetliste[0].enhetId };
            }
            return state;
        }
        default: {
            return state;
        }
    }
}
