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

enum ContextholderMessages {
    NY_AKTIV_ENHET = 'NY_AKTIV_ENHET',
    NY_AKTIV_BRUKER = 'NY_AKTIV_BRUKER'
}