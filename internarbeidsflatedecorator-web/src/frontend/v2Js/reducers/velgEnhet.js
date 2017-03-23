import { SETT_VALGT_ENHET } from '../actions/actiontyper';

export default function velgEnhet(state = {}, action = {}) {
    switch (action.type) {
        case SETT_VALGT_ENHET: {
            return {
                enhet: action.enhet,
            };
        }
        default: {
            return state;
        }
    }
}
