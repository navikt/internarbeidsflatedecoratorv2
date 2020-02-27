import { MaybeCls } from '@nutgaard/maybe-ts';
import { EnhetDisplay, FnrDisplay } from './domain';

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

export interface Data {
    saksbehandler: Saksbehandler;
    aktorId: MaybeCls<AktorIdResponse>;
}

export interface UninitializedState {
    initialized: false;
}

export interface ContextvalueStateDisabled {
    enabled: false;
}

export interface ContextvalueStateEnabled<T> {
    enabled: true;
    value: MaybeCls<string>;
    wsRequestedValue: MaybeCls<string>;
    display: T;
    showModal: boolean;
    onChange(value: string | null): void;
}

export type ContextvalueState<T> = ContextvalueStateDisabled | ContextvalueStateEnabled<T>;
export type EnhetContextvalueState = ContextvalueState<EnhetDisplay>;
export type FnrContextvalueState = ContextvalueState<FnrDisplay>;

export function isEnabled<T>(value: ContextvalueState<T>): value is ContextvalueStateEnabled<T> {
    return value.enabled;
}
