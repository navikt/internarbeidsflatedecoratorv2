import {MaybeCls} from "@nutgaard/maybe-ts";
import { lagFnrFeilmelding } from '../utils/fnr-utils';
import { finnMiljoStreng, hentMiljoFraUrl } from '../utils/url-utils';
import { AktivBruker, AktivEnhet, AktorIdResponse, Saksbehandler } from '../internal-domain';
import failureConfig from './../mock/mock-error-config';

export enum ContextApiType {
    NY_AKTIV_ENHET = 'NY_AKTIV_ENHET',
    NY_AKTIV_BRUKER = 'NY_AKTIV_BRUKER'
}

export function lagModiacontextholderUrl(): string {
    const urlEnv = hentMiljoFraUrl();

    if (urlEnv.environment === 'local') {
        return '/modiacontextholder/api';
    } else if (urlEnv.isNaisUrl && urlEnv.envclass === 'q') {
        return `https://modiacontextholder-${urlEnv.environment}.nais.preprod.local/modiacontextholder/api`;
    } else if (urlEnv.isNaisUrl && urlEnv.envclass === 'p') {
        return `https://modiacontextholder.nais.adeo.no/modiacontextholder/api`;
    } else if (!urlEnv.isNaisUrl && urlEnv.envclass !== 'p') {
        return `https://app-${urlEnv.environment}.adeo.no/modiacontextholder/api`;
    } else {
        return `https://app.adeo.no/modiacontextholder/api`;
    }
}

export const modiacontextholderUrl = lagModiacontextholderUrl();
export const AKTIV_ENHET_URL = `${modiacontextholderUrl}/context/aktivenhet`;
export const AKTIV_BRUKER_URL = `${modiacontextholderUrl}/context/aktivbruker`;
export const SAKSBEHANDLER_URL = `${modiacontextholderUrl}/decorator`;
export const AKTORID_URL = (fnr: string) => `${modiacontextholderUrl}/aktor/${fnr}`;

export type ResponseError = { data: undefined; error: string };
export type ResponseOk<T> = { data: T; error: undefined };
export type FetchResponse<T> = ResponseOk<T> | ResponseError;

export function hasError<T>(response: FetchResponse<T>): response is ResponseError {
    return response.error !== undefined;
}

async function doFetch(url: string, options?: RequestInit): Promise<Response> {
    return await fetch(url, { ...options, credentials: 'include' });
}

export async function getJson<T>(info: RequestInfo, init?: RequestInit): Promise<FetchResponse<T>> {
    try {
        const corsInit: RequestInit = { ...(init || {}), credentials: 'include' };
        const response: Response = await fetch(info, corsInit);
        if (response.status > 299) {
            const content = await response.text();
            return { data: undefined, error: content };
        }
        const data: T = await response.json();
        return { data, error: undefined };
    } catch (error) {
        return { data: undefined, error };
    }
}

async function postJson<T>(url: string, body: T, options?: RequestInit): Promise<FetchResponse<T>> {
    try {
        await doFetch(url, {
            ...options,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        return { data: body, error: undefined };
    } catch (error) {
        return { data: undefined, error };
    }
}

export function hentAktorId(fnr: string): Promise<FetchResponse<AktorIdResponse>> {
    const feilmelding = lagFnrFeilmelding(fnr);

    if (feilmelding.isJust()) {
        return Promise.reject('Ugyldig fødselsnummer, kan ikke hente aktørId');
    }

    return getJson<AktorIdResponse>(AKTORID_URL(fnr));
}

export function logError(message: string, extra: { [key: string ]: string }) {
    const error = {
        message: message,
        url: document.URL,
        ...extra
    };

    console.error(error);
    if (window.frontendlogger) {
        window.frontendlogger.error(error);
    }
}

export function oppdaterAktivBruker(fnr: string | null | undefined) {
    return postJson(`${modiacontextholderUrl}/context`, {
        verdi: fnr,
        eventType: ContextApiType.NY_AKTIV_BRUKER
    });
}

export function oppdaterAktivEnhet(enhet: string | null | undefined) {
    return postJson(`${modiacontextholderUrl}/context`, {
        verdi: enhet,
        eventType: ContextApiType.NY_AKTIV_ENHET
    });
}

export function nullstillAktivBruker() {
    return fetch(AKTIV_BRUKER_URL, { method: 'DELETE', credentials: 'include' }).catch(() => {});
}

export function nullstillAktivEnhet() {
    return fetch(AKTIV_ENHET_URL, { method: 'DELETE', credentials: 'include' }).catch(() => {});
}

export function hentAktivBruker(): Promise<FetchResponse<AktivBruker>> {
    return getJson<AktivBruker>(AKTIV_BRUKER_URL);
}

export function hentAktivEnhet(): Promise<FetchResponse<AktivEnhet>> {
    return getJson<AktivEnhet>(AKTIV_ENHET_URL);
}

export function hentSaksbehandlerData(): Promise<FetchResponse<Saksbehandler>> {
    return getJson<Saksbehandler>(SAKSBEHANDLER_URL);
}

export function getWebSocketUrl(maybeSaksbehandler: MaybeCls<Saksbehandler>): string | null {
    if (process.env.REACT_APP_MOCK === 'true' && failureConfig.websocketConnection) {
        return 'ws://localhost:2999/hereIsWS/failure-url';
    } else if (process.env.NODE_ENV === 'development') {
        return 'ws://localhost:2999/hereIsWS';
    } else {
        return maybeSaksbehandler
            .map((saksbehandler) => saksbehandler.ident)
            .map((ident) => `wss://veilederflatehendelser${finnMiljoStreng()}.adeo.no/modiaeventdistribution/ws/${ident}`)
            .withDefault(null);
    }
}
