import { ContextHolderAPI } from '../api/ContextHolderAPI';
import { PredefiniertFeilmeldinger } from '../types/ErrorMessage';
import { ErrorMessageManager } from './ErrorMessageManager';

export class FirstSyncContextValue {
  #contextHolderApi: ContextHolderAPI;
  #errorMessageManager: ErrorMessageManager;
  #haveSyncedFnr = false;
  #haveSyncedEnhet = false;

  constructor(
    contextHolderApi: ContextHolderAPI,
    errorMessageManager: ErrorMessageManager,
    shouldSyncFnr: boolean,
    shouldSyncEnhet: boolean,
  ) {
    if (!shouldSyncFnr) {
      this.#haveSyncedFnr = true;
    }
    if (!shouldSyncEnhet) {
      this.#haveSyncedEnhet = true;
    }
    this.#contextHolderApi = contextHolderApi;
    this.#errorMessageManager = errorMessageManager;
  }

  getFnr = async (fnr: string | undefined): Promise<string | undefined> => {
    if (this.#haveSyncedFnr || fnr) {
      return fnr;
    }
    const res = await this.#contextHolderApi.getVeiledersActiveFnr();
    this.#haveSyncedFnr = true;
    if (res.error || !res.data) {
      this.#errorMessageManager.addErrorMessage(
        PredefiniertFeilmeldinger.HENT_BRUKER_CONTEXT_FEILET,
      );
      return fnr;
    }
    return res.data.aktivBruker;
  };

  getEnhet = async (enhet: string | undefined): Promise<string | undefined> => {
    if (this.#haveSyncedEnhet || enhet) {
      return enhet;
    }

    const res = await this.#contextHolderApi.getVeiledersActiveEnhet();
    this.#haveSyncedEnhet = true;
    if (res.error || !res.data) {
      this.#errorMessageManager.addErrorMessage(
        PredefiniertFeilmeldinger.HENT_ENHET_FEILET,
      );
      return enhet;
    }
    return res.data.aktivEnhet;
  };
}
