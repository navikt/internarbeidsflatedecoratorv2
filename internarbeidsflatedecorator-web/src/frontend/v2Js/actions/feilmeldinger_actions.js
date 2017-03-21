import { VIS_FEILMELDING, FJERN_FEILMELDING } from './actiontyper';

export function visFeilmelding(feilmelding) {
    return {
        type: VIS_FEILMELDING,
        data: feilmelding,
    };
}

export function fjernFeilmelding() {
    return {
        type: FJERN_FEILMELDING,
    };
}
