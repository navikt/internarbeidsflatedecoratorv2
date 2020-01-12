import { lagFnrFeilmelding } from '../utils/fnr-utils';
import { finnMiljoStreng, randomCallId } from '../utils/url-utils';
import { AktivBruker, AktivEnhet, AktorIdResponse, Saksbehandler } from '../domain';
import { ContextApiType, modiacontextholderUrl } from '../context-api';

export type ResponseError = { data: undefined; error: string };
export type ResponseOk<T> = { data: T; error: undefined };
export type FetchResponse<T> = ResponseOk<T> | ResponseError;

export function hasError<T>(response: FetchResponse<T>): response is ResponseError {
    return !!response.error;
}

async function doFetch(url: string, options?: RequestInit): Promise<Response> {
    return await fetch(url, { ...options, credentials: 'include' });
}

export async function getJson<T>(info: RequestInfo, init?: RequestInit): Promise<FetchResponse<T>> {
    try {
        const response = await fetch(info, init);
        const data = await response.json();
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

export const defaultAktorIdUrl = `https://app${finnMiljoStreng()}.adeo.no/aktoerregister/api/v1/identer?identgruppe=AktoerId`;

export function hentAktorId(
    aktoridUrl: string,
    fnr: string
): Promise<FetchResponse<AktorIdResponse>> {
    const feilmelding = lagFnrFeilmelding(fnr);

    if (feilmelding.isJust()) {
        return Promise.reject('Ugyldig fødselsnummer, kan ikke hente aktørId');
    }

    const request: RequestInit = {
        credentials: 'include',
        headers: {
            'Nav-Consumer-Id': 'internarbeidsflatedecorator',
            'Nav-Call-Id': randomCallId(),
            'Nav-Personidenter': fnr
        }
    };

    return getJson<AktorIdResponse>(aktoridUrl, request);
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
    return fetch(AKTIV_BRUKER_URL, { method: 'DELETE', credentials: 'include' });
}

export const AKTIV_ENHET_URL = `${modiacontextholderUrl}/context/aktivenhet`;
export const AKTIV_BRUKER_URL = `${modiacontextholderUrl}/context/aktivbruker`;
export const SAKSBEHANDLER_URL = `${modiacontextholderUrl}/decorator`;

export function hentAktivBruker(): Promise<FetchResponse<AktivBruker>> {
    return getJson<AktivBruker>(AKTIV_BRUKER_URL);
}

export function hentAktivEnhet(): Promise<FetchResponse<AktivEnhet>> {
    return getJson<AktivEnhet>(AKTIV_ENHET_URL);
}

export function hentSaksbehandlerData(): Promise<FetchResponse<Saksbehandler>> {
    return getJson<Saksbehandler>(SAKSBEHANDLER_URL);
}
