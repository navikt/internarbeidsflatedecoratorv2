import { EnhetValueManager } from './EnhetValueManager';
import { FnrValueManager } from './FnrValueManager';
import { StoreProps } from './StoreHandler';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

export class ParentCommunicator extends SubstateHandler {
  #fnrValueManager: FnrValueManager;
  #enhetValueManager: EnhetValueManager;
  #initialize: (props: StoreProps) => Promise<void>;

  constructor(
    substateProps: SubstateHandlerProps,
    fnrValueManager: FnrValueManager,
    enhetValueManager: EnhetValueManager,
    initialize: (props: StoreProps) => Promise<void>,
  ) {
    super(substateProps);
    this.#initialize = initialize;
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

  forceNewVeileder = (veiledersIdent: string) => {
    if (!this.props) {
      throw new Error("Manglet props for å bytte veileder")
    }
    this.#initialize({ ...this.props, veiledersIdent });
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
