import { lagFnrFeilmelding } from '../utils/fnr-utils';
import { finnMiljoStreng, hentMiljoFraUrl, randomCallId } from '../utils/url-utils';
import { AktivBruker, AktivEnhet, AktorIdResponse, Saksbehandler } from '../internal-domain';

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
export const AKTORID_URL = `https://app${finnMiljoStreng()}.adeo.no/aktoerregister/api/v1/identer?identgruppe=AktoerId`;

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

export function hentAktorId(fnr: string): Promise<FetchResponse<AktorIdResponse>> {
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

    return getJson<AktorIdResponse>(AKTORID_URL, request);
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

export function nullstillAktivEnhet() {
    return fetch(AKTIV_ENHET_URL, { method: 'DELETE', credentials: 'include' });
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
export function getWebSocketUrl(saksbehandler: Saksbehandler): string {
    if (process.env.NODE_ENV === 'development') {
        return 'ws://localhost:2999/hereIsWS';
    }
    const ident = saksbehandler.ident;
    return `wss://veilederflatehendelser${finnMiljoStreng()}.adeo.no/modiaeventdistribution/ws/${ident}`;
}
