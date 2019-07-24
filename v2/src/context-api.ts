import {AktivBruker, AktivEnhet} from "./domain";


export enum ContextApiType {
    NY_AKTIV_ENHET = 'NY_AKTIV_ENHET',
    NY_AKTIV_BRUKER = 'NY_AKTIV_BRUKER',
}

async function doFetch(url: string, options?: RequestInit): Promise<Response> {
    return await fetch(url, {...options, credentials: 'include'});
}

async function getJson<T>(url: string, options?: RequestInit): Promise<T> {
    try {
        const resp = await doFetch(url, options);
        return await resp.json();
    } catch (e) {
        return Promise.reject(e);
    }
}

async function postJson<T>(url: string, body: T, options?: RequestInit): Promise<T> {
    try {
        await doFetch(url, {
            ...options,
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        });
        return body;
    } catch (e) {
        return Promise.reject(e);
    }
}

export async function oppdaterAktivBruker(fnr: string | null | undefined) {
    return await postJson('/modiacontextholder/api/context', {
        verdi: fnr,
        eventType: ContextApiType.NY_AKTIV_BRUKER
    });
}

export async function oppdaterAktivEnhet(enhet: string | null | undefined) {
    return await postJson('/modiacontextholder/api/context', {
        verdi: enhet,
        eventType: ContextApiType.NY_AKTIV_ENHET
    });
}

export async function hentAktivBruker(): Promise<AktivBruker> {
    return await getJson<AktivBruker>('/modiacontextholder/api/context/aktivbruker');
}

export async function hentAktivEnhet(): Promise<AktivEnhet> {
    return await getJson<AktivEnhet>('/modiacontextholder/api/context/aktivenhet');

}