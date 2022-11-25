import { MaybeCls } from '@nutgaard/maybe-ts';
import { EnhetDisplay, FnrDisplay } from './domain';

export type LogAttrs = { [key: string]: any };
export interface FrontendLogger {
    info(message: string | LogAttrs): void;
    warn(message: string | LogAttrs): void;
    error(message: string | LogAttrs): void;
    event(name: string, fields: LogAttrs, tags: LogAttrs): void;
}

declare global {
    interface Window {
        frontendlogger?: FrontendLogger;
    }
}

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
    visHotkeys: boolean;
}

export interface AktorIdResponse {
    fnr: string;
    aktorId: string;
}

export interface AktivEnhet {
    aktivEnhet: string | null;
}

export interface AktivBruker {
    aktivBruker: string | null;
}

export interface Data {
    saksbehandler: MaybeCls<Saksbehandler>;
    aktorId: MaybeCls<AktorIdResponse>;
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
    skipModal: boolean;
    ignoreWsEvents: boolean;
}

export type ContextvalueState<T> = ContextvalueStateDisabled | ContextvalueStateEnabled<T>;
export type EnhetContextvalueState = ContextvalueState<EnhetDisplay>;
export type FnrContextvalueState = ContextvalueState<FnrDisplay>;

export function isEnabled<T>(value: ContextvalueState<T>): value is ContextvalueStateEnabled<T> {
    return value.enabled;
}

export function isDisabled<T>(value: ContextvalueState<T>): value is ContextvalueStateDisabled {
    return !value.enabled;
}
