import { Veileder } from '../types/Veileder';
import { ApiClient, FetchResponse } from './ApiClient';

interface AktivBrukerResponse {
  aktivBruker: string | undefined;
}

interface AktivEnhetResponse {
  aktivEnhet: string | undefined;
}

interface FnrCodeResponse {
  fnr: string;
  code: string;
}

export class ContextHolderAPI extends ApiClient {
  constructor(url: string, token?: string) {
    super(url, token);
  }

  readonly exhangeUserKeyForFnr = (
    code: string,
  ): Promise<FetchResponse<FnrCodeResponse>> => {
    return this.post<FnrCodeResponse>({
      path: `/context/fnr-code/retrieve`,
      body: { code },
    });
  };

  readonly changeFnr = (
    newFnr?: string | null,
  ): Promise<FetchResponse<void>> => {
    return this.post({
      path: '/context',
      body: { eventType: 'NY_AKTIV_BRUKER', verdi: newFnr },
    });
  };

  readonly changeEnhet = (
    newEnhet?: string | null,
  ): Promise<FetchResponse<void>> => {
    return this.post({
      path: '/context',
      body: { eventType: 'NY_AKTIV_ENHET', verdi: newEnhet },
    });
  };

  readonly clearFnr = () => this.delete<void>({ path: '/context/aktivbruker' });

  readonly getVeilederDetails = (): Promise<FetchResponse<Veileder>> => {
    return this.get<Veileder>({ path: `/decorator` });
  };

  readonly getVeiledersActiveFnr = (): Promise<
    FetchResponse<AktivBrukerResponse>
  > => {
    return this.get<AktivBrukerResponse>({ path: `/context/v2/aktivbruker` });
  };

  readonly getVeiledersActiveEnhet = (): Promise<
    FetchResponse<AktivEnhetResponse>
  > => {
    return this.get<AktivEnhetResponse>({ path: `/context/v2/aktivenhet` });
  };
}
