import { EnhetValueManager } from './EnhetValueManager';
import { FnrValueManager } from './FnrValueManager';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

export class ParentCommunicator extends SubstateHandler {
  #fnrValueManager: FnrValueManager;
  #enhetValueManager: EnhetValueManager;

  constructor(
    substateProps: SubstateHandlerProps,
    fnrValueManager: FnrValueManager,
    enhetValueManager: EnhetValueManager,
  ) {
    super(substateProps);
    this.#fnrValueManager = fnrValueManager;
    this.#enhetValueManager = enhetValueManager;
  }

  forceNewFnr = (fnr: string): Promise<void> => {
    return this.#fnrValueManager.changeFnrLocallyAndExternally(fnr);
  };

  exchangeUserForUserKeyAndUpdateContextholder = async (
    userKey: string,
  ): Promise<void> => {
    const fnr = await this.contextHolderApi.exhangeUserKeyForFnr(userKey);
    if (fnr.error) {
      throw Error(fnr.error);
    }
    if (!fnr.data) {
      throw Error('Fikk ikke noe respons på den nøkkelen');
    }
    this.#fnrValueManager.changeFnrLocallyAndExternally(fnr.data);
  };

  forceNewEnhet = (enhet: string): Promise<void> => {
    return this.#enhetValueManager.changeEnhetLocallyAndExternally(enhet);
  };

  clearFnr = () => {
    this.#fnrValueManager.clearFnr();
  };

  clearEnhet = () => {
    this.#enhetValueManager.clearEnhet();
  };

  clearVeileder = () => {
    this.storeHandler.resetState()
  };
}
