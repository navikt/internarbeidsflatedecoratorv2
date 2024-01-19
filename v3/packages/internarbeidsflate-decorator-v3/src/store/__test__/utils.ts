import { FetchResponse } from "../../api/ApiClient";
import { ContextHolderAPI } from "../../api/ContextHolderAPI";
import { Enhet } from "../../types/Enhet";
import { Veileder } from "../../types/Veileder";

export class MockContextHolderApi implements ContextHolderAPI {
    createFetchResponse: <T>(data: T, error?: undefined | any) => FetchResponse<T>

    constructor(fetchResponse?: (<T>(data: T, error?: undefined | any) => FetchResponse<T>) | undefined) {
        this.createFetchResponse = fetchResponse ?? this.#internalFetchResponse
    }

    #internalFetchResponse = <T>(data: T, error?: undefined | any) => {
        const res: FetchResponse<T> = {
            data,
            error
        }
        return res
    }

    #resolvePromise = (fn: () => any): Promise<any> => {
        return new Promise((resolve) => resolve(fn()))
    }

    exhangeUserKeyForFnr = (
        _: string,
    ): Promise<FetchResponse<string>> => {
        return this.#resolvePromise(() => this.createFetchResponse<string>('10108000398'))
    };

    changeFnr = (_?: string | null): Promise<FetchResponse<void>> => {
        return this.#resolvePromise(() => this.createFetchResponse(undefined))
    };

    changeEnhet = (_?: string | null): Promise<FetchResponse<void>> => {
        return this.#resolvePromise(() => this.createFetchResponse(undefined))
    };

    getEnhet = (enhetId: string): Promise<FetchResponse<Enhet>> => {
        return this.#resolvePromise(() => this.createFetchResponse<Enhet>({ enhetId, navn: 'Test enhet' }))
    };

    getVeilederDetails = (
        ident: string,
    ): Promise<FetchResponse<Veileder>> => {
        return this.#resolvePromise(() => this.createFetchResponse<Veileder>({ ident, fornavn: 'Mock', etternavn: 'Mockesen', navn: 'Mock Mockesen', enheter: [{ enhetId: 'MK1234', navn: 'Mock Mockesen' }] }))
    };

    getVeiledersActiveFnr = (
        _: string,
    ): Promise<FetchResponse<string>> => {
        return this.#resolvePromise(() => this.createFetchResponse<string>('10108000398'))
    };

    getVeiledersActiveEnhet = (
        _: string,
    ): Promise<FetchResponse<string>> => {
        return this.#resolvePromise(() => this.createFetchResponse<string>('MK1234'))
    };
}