import { VIS_FEILMELDING, FJERN_FEILMELDING } from '../actions/actiontyper';

const initiellState = {
    feilmelding: null,
};

export default function feilmelding(state = initiellState, action = {}) {
    switch (action.type) {
        case VIS_FEILMELDING: {
            return Object.assign({}, state, {
                feilmelding: action.data,
            });
        }
        case FJERN_FEILMELDING: {
            return Object.assign({}, state, {
                feilmelding: null,
            });
        }
        default: {
            return state;
        }
    }
}
