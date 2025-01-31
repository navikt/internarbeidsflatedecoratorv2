export enum ErrorMessageCode {
  VALIDERING_FNR = 'A001',
  UKJENT_VALIDERING_FNR = 'A002',
  INGEN_GYLDIG_ENHET = 'A100',
  HENT_SAKSBEHANDLER_DATA_FEILET = 'A200',
  HENT_BRUKER_CONTEXT = 'A300',
  OPPDATER_BRUKER_CONTEXT_FEILET = 'A301',
  OPPDATER_ENHET_CONTEXT_FEILET = 'A302',
  HENT_AKTORID_FEILET = 'A400',
  WS_FEILET = 'A500',
  UGYLDIG_ARGUMENT = 'A600',
  BYTT_BRUKERNØKKEL_FEILET = 'A700',
  HENT_ENHET_FEILT = 'A800',
}

export interface ErrorMessage {
  code: ErrorMessageCode;
  message: string;
}

function createErrorMessage(
  code: ErrorMessageCode,
  message: string,
): ErrorMessage {
  return { code, message };
}

export const PredefiniertFeilmeldinger = {
  HENT_SAKSBEHANDLER_DATA_FEILET: createErrorMessage(
    ErrorMessageCode.HENT_SAKSBEHANDLER_DATA_FEILET,
    'Kunne ikke hente informasjon om innlogget saksbehandler.',
  ),
  HENT_BRUKER_CONTEXT_FEILET: createErrorMessage(
    ErrorMessageCode.HENT_BRUKER_CONTEXT,
    'Kunne ikke hente ut person i kontekst',
  ),
  OPPDATER_BRUKER_CONTEXT_FEILET: createErrorMessage(
    ErrorMessageCode.OPPDATER_BRUKER_CONTEXT_FEILET,
    'Kunne ikke oppdatere person i kontekst',
  ),
  OPPDATER_ENHET_CONTEXT_FEILET: createErrorMessage(
    ErrorMessageCode.OPPDATER_ENHET_CONTEXT_FEILET,
    'Kunne ikke oppdatere enhet i kontekst',
  ),
  FNR_11_SIFFER: createErrorMessage(
    ErrorMessageCode.VALIDERING_FNR,
    'Fødselsnummeret må inneholde 11 siffer',
  ),
  FNR_KUN_TALL: createErrorMessage(
    ErrorMessageCode.VALIDERING_FNR,
    'Fødselsnummeret må kun inneholde tall',
  ),
  FNR_KONTROLL_SIFFER: createErrorMessage(
    ErrorMessageCode.VALIDERING_FNR,
    'Fødselsnummeret er ikke gyldig',
  ),
  FNR_UKJENT_FEIL: createErrorMessage(
    ErrorMessageCode.UKJENT_VALIDERING_FNR,
    'Ukjent feil ved validering av fødselsnummer.',
  ),
  WS_ERROR: createErrorMessage(
    ErrorMessageCode.WS_FEILET,
    'Feil ved tilkobling mot ws-contextholder',
  ),
  HENT_AKTORID_FEILET: createErrorMessage(
    ErrorMessageCode.HENT_AKTORID_FEILET,
    'Kunne ikke hente aktør-identifikator for bruker',
  ),
  INGEN_GYLDIG_ENHET: createErrorMessage(
    ErrorMessageCode.INGEN_GYLDIG_ENHET,
    'Kunne ikke finne en passende enhet',
  ),
  HENT_ENHET_FEILET: createErrorMessage(
    ErrorMessageCode.HENT_ENHET_FEILT,
    'Feil ved uthenting av enhet',
  ),
};
