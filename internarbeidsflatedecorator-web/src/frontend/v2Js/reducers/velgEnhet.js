import { ENHET_VALGT } from '../actions/actiontyper';

export default function velgEnhet(state = {}, action = {}) {
    switch (action.type) {
        case ENHET_VALGT: {
            return {
                enhet: action.enhet,
            };
        }
        default: {
            return state;
        }
    }
}
