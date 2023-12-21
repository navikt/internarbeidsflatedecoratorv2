import { Enhet } from '../types/Enhet';
import { Veileder } from '../types/Veileder';
import { ApiClient, FetchResponse } from './ApiClient';

export class ContextHolderAPI extends ApiClient {
  constructor(url: string, token?: string) {
    super(url, token);
  }

  readonly exhangeUserKeyForFnr = (
    userKey: string,
  ): Promise<FetchResponse<string>> => {
    return this.get<string>({ path: `/exchange-key/${userKey}` });
  };

  readonly changeFnr = (newFnr?: string | null) => {
    return this.post({ body: { fnr: newFnr } });
  };

  readonly changeEnhet = (newEnhet?: string | null) => {
    return this.post({ body: { enhet: newEnhet } });
  };

  readonly getEnhet = (enhetId: string): Promise<FetchResponse<Enhet>> => {
    return this.get<Enhet>({ path: `/enhet/${enhetId}` });
  };

  readonly getVeilederDetails = (
    veilederId: string,
  ): Promise<FetchResponse<Veileder>> => {
    return this.get<Veileder>({ path: `/${veilederId}/details` });
  };

  readonly getVeiledersActiveFnr = (
    veilederId: string,
  ): Promise<FetchResponse<string>> => {
    return this.get<string>({ path: `/${veilederId}/aktiv-bruker` });
  };

  readonly getVeiledersActiveEnhet = (
    veilederId: string,
  ): Promise<FetchResponse<string>> => {
    return this.get<string>({ path: `/${veilederId}/aktiv-enhet` });
  };
}
