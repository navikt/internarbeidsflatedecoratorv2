export interface Saksbehandler {
    readonly ident: string;
    readonly fornavn: string;
    readonly etternavn: string;
    readonly navn: string;
    readonly enheter: Array<Enhet>;
}

export interface Enhet {
    readonly enhetId: string;
    readonly navn: string;
}

export interface Toggles {
    visVeileder: boolean;
    visSokefelt: boolean;
    visEnhetVelger: boolean;
    visEnhet: boolean;
}

export interface Contextholder {
    enabled: boolean;
    promptBeforeEnhetChange?: boolean;
}

export interface Markup {
    etterSokefelt?: string;
}

export interface AktorIdResponse {
    [fnr: string]: {
        feilmelding: null | string;
        identer: null | Array<{
            gjeldende: boolean;
            ident: string;
            identgruppe: string;
        }>;
    };
}

export interface AktivEnhet {
    aktivEnhet: string | null;
}

export interface AktivBruker {
    aktivBruker: string | null;
}
