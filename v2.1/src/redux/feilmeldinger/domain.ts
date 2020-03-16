import { DataAction } from '../utils';

export enum FeilmeldingKode {
    VALIDERING_FNR = 'A001',
    UKJENT_VALIDERING_FNR = 'A002',
    INGEN_GYLDIG_ENHET = 'A100',
    HENT_SAKSBEHANDLER_DATA_FEILET = 'A200',
    HENT_BRUKER_CONTEXT = 'A300',
    HENT_AKTORID_FEILET = 'A400',
    WS_FEILET = 'A500'
}

export interface Feilmelding {
    kode: FeilmeldingKode;
    melding: string;
}

export enum FeilmeldingActionTypes {
    LEGG_TIL = 'REDUX/FEILMELDING/LEGG_TIL',
    FJERN = 'REDUX/FEILMELDING/FJERN'
}

export type PredefiniertFeilmelding = Feilmelding & { __final__: true };
function definer(kode: FeilmeldingKode, melding: string): PredefiniertFeilmelding {
    return { kode, melding } as PredefiniertFeilmelding;
}

export const PredefiniertFeilmeldinger = {
    HENT_SAKSBEHANDLER_DATA_FEILET: definer(
        FeilmeldingKode.HENT_SAKSBEHANDLER_DATA_FEILET,
        'Kunne ikke hente informasjon om innlogget saksbehandler.'
    ),
    HENT_BRUKER_CONTEXT_FEILET: definer(
        FeilmeldingKode.HENT_BRUKER_CONTEXT,
        'Kunne ikke hente ut person i kontekst'
    ),
    FNR_11_SIFFER: definer(
        FeilmeldingKode.VALIDERING_FNR,
        'Fødselsnummeret må inneholde 11 siffer'
    ),
    FNR_KUN_TALL: definer(FeilmeldingKode.VALIDERING_FNR, 'Fødselsnummeret må kun inneholde tall'),
    FNR_KONTROLL_SIFFER: definer(FeilmeldingKode.VALIDERING_FNR, 'Fødselsnummeret er ikke gyldig'),
    FNR_UKJENT_FEIL: definer(
        FeilmeldingKode.UKJENT_VALIDERING_FNR,
        'Ukjent feil ved validering av fødselsnummer.'
    ),
    WS_ERROR: definer(FeilmeldingKode.WS_FEILET, 'Feil ved tilkobling mot ws-contextholder'),
    HENT_AKTORID_FEILET: definer(
        FeilmeldingKode.HENT_AKTORID_FEILET,
        'Kunne ikke hente aktør-identifikator for bruker'
    ),
    INGEN_GYLDIG_ENHET: definer(
        FeilmeldingKode.INGEN_GYLDIG_ENHET,
        'Kunne ikke finne en passende enhet'
    )
};

export type LeggTilFeilmelding = DataAction<
    FeilmeldingActionTypes.LEGG_TIL,
    PredefiniertFeilmelding
>;
export type FjernFeilmelding = DataAction<FeilmeldingActionTypes.FJERN, FeilmeldingKode>;

export type FeilmeldingerActions = LeggTilFeilmelding | FjernFeilmelding;
