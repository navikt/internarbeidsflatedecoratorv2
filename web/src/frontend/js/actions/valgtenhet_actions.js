import { SETT_VALGT_ENHET } from './actiontyper';

export function settValgtEnhet(valgtEnhet) {
    return {
        type: SETT_VALGT_ENHET,
        data: valgtEnhet,
    };
}
