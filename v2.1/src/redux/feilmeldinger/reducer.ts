import { State } from './..';
import {
    Feilmelding,
    FeilmeldingActionTypes,
    FeilmeldingerActions,
    FeilmeldingKode,
    FjernFeilmelding,
    LeggTilFeilmelding,
    PredefiniertFeilmelding
} from './domain';
import { Required } from '../utils';

export type Feilmeldinger = {
    [key in keyof typeof FeilmeldingKode]?: Feilmelding;
};

const initialState: Feilmeldinger = {};

export default function reducer(
    state: Feilmeldinger = initialState,
    action: FeilmeldingerActions
): Feilmeldinger {
    switch (action.type) {
        case FeilmeldingActionTypes.LEGG_TIL:
            return {
                ...state,
                [action.data.kode]: action.data
            };
        case FeilmeldingActionTypes.FJERN: {
            const copy: Feilmeldinger = { ...state };
            const id: FeilmeldingKode & string = action.data;
            // @ts-ignore
            delete copy[id];
            return copy;
        }
        default:
            return state;
    }
}

export function feilmeldingerSelector(state: State): Required<Feilmeldinger> {
    // Typescript forstår bare ikke hvordan optional-keys fungerer i dette tilfellet.
    return state.feilmeldinger as Required<Feilmeldinger>;
}

export function leggTilFeilmelding(feilmelding: PredefiniertFeilmelding): LeggTilFeilmelding {
    return {
        type: FeilmeldingActionTypes.LEGG_TIL,
        data: feilmelding
    };
}

export function fjernFeilmelding(feilmeldingKode: FeilmeldingKode): FjernFeilmelding {
    return {
        type: FeilmeldingActionTypes.FJERN,
        data: feilmeldingKode
    };
}
