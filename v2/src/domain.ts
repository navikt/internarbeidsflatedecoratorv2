export interface Me {
    readonly ident: string;
    readonly navn: string;
}

export interface Enhet {
    readonly enhetId: string;
    readonly navn: string;
}

export interface Enheter {
    readonly enhetliste: Array<Enhet>;
}

export interface Toggles {
    visVeilder: boolean;
    visSokefelt: boolean;
    visEnhetVelger: boolean;
    visEnhet: boolean;
}

export interface Markup {
    etterSokefelt?: string
}

export interface AktorIdResponse {
    [fnr: string]: {
        feilmelding: string | null;
        identer: Array<{
            gjeldende: boolean;
            ident: string;
            identgruppe: string;
        }>
    }
}

export enum AppPhase {
    INIT = 'INIT',
    INSYNC = 'INSYNC'
}

export interface AktivEnhet {
    aktivEnhet: string | null;
}

export interface AktivBruker {
    aktivBruker: string | null;
}