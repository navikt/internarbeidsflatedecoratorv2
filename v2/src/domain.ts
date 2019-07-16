export interface Me {
    readonly ident: string;
    readonly navn: string;
    readonly fornavn: string;
    readonly etternavn: string;
}

export interface Enhet {
    readonly enhetId: string;
    readonly navn: string;
}

export interface Enheter {
    readonly ident: string;
    readonly enhetliste: Array<Enhet>;
}

export interface ContextChange {
    type: 'FNR' | 'ENHET';
    value: string | null;
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