import { ContextValue } from '../types/ContextValue';
import { Enhet } from '../types/Enhet';
import { PredefiniertFeilmeldinger } from '../types/ErrorMessage';
import { ContextValueManager } from './ContextValueManager';
import { ErrorMessageManager } from './ErrorMessageManager';
import { FnrValueManager } from './FnrValueManager';
import { PropsUpdateHandler } from './PropsUpdateHandler';
import { StoreProps } from './StoreHandler';
import { SubstateHandlerProps } from './SubstateHandler';

type EnhetContextValue = ContextValue<Enhet>;

export class EnhetValueManager extends ContextValueManager {
  #errorMessageManager: ErrorMessageManager;
  #fnrValueManager: FnrValueManager;
  #propsUpdateHandler: PropsUpdateHandler;
  #onEnhetChanged?: (newEnhet?: string | null) => void;
  constructor(
    substateProps: SubstateHandlerProps,
    errorMessageManager: ErrorMessageManager,
    fnrValueManager: FnrValueManager,
    propsUpdateHandler: PropsUpdateHandler,
  ) {
    super(substateProps);
    this.#errorMessageManager = errorMessageManager;
    this.#fnrValueManager = fnrValueManager;
    this.#propsUpdateHandler = propsUpdateHandler;
  }

  override initialize = async ({
    enhet,
    onEnhetChanged,
  }: StoreProps) => {
    this.#registerPropsHandler();
    this.#onEnhetChanged = onEnhetChanged;
    if (enhet && enhet === this.state.enhet.value) {
      return;
    }
    const saksbehandler =
      await this.contextHolderApi.getVeilederDetails();
    if (saksbehandler.error) {
      return this.#errorMessageManager.addErrorMessage(
        PredefiniertFeilmeldinger.HENT_SAKSBEHANDLER_DATA_FEILET,
      );
    }

    const enheter = saksbehandler.data?.enheter;
    if (!enheter?.length) {
      this.#resetFnrAndEnhetDueToNoLegalEnhet();
      return;
    }

    if (enhet?.length) {
      return this.#updateEnhetExternallyToMatchRequestedEnhet(enheter, enhet);
    }
  };

  readonly #registerPropsHandler = () => {
    this.#propsUpdateHandler.registerCallback(
      'enhetValueManager',
      this.initialize,
      'enhet',
    );
  };

  readonly updateEnhetLocallyToMatchContextHolder = async (
  ) => {
    const enheter = this.state.veileder?.enheter;
    if (!enheter?.length) return;

    const passendeEnhet = enheter[0];

    const activeEnhet =
      await this.contextHolderApi.getVeiledersActiveEnhet();
    if (activeEnhet.error || !activeEnhet.data) {
      this.#errorMessageManager.addErrorMessage(
        PredefiniertFeilmeldinger.HENT_ENHET_FEILET,
      );
      return this.changeEnhetLocallyAndExternally(passendeEnhet.enhetId);
    }
    return this.changeEnhetLocally(activeEnhet.data.aktivEnhet);
  };

  readonly #updateEnhetExternallyToMatchRequestedEnhet = async (
    enheter: Enhet[],
    enhet: string,
  ) => {
    if (!this.#haveLegalEnhet(enhet, enheter)) {
      return this.changeEnhetLocallyAndExternally(enheter[0].enhetId);
    }
    return this.changeEnhetLocallyAndExternally(enhet);
  };

  readonly #resetFnrAndEnhetDueToNoLegalEnhet = async () => {
    await this.#fnrValueManager.changeFnrLocallyAndExternally();
    await this.changeEnhetLocallyAndExternally();
    this.#errorMessageManager.addErrorMessage(
      PredefiniertFeilmeldinger.INGEN_GYLDIG_ENHET,
    );
  };

  readonly #updateEnhet = (newEnhet?: Enhet | null): EnhetContextValue => {
    const tmpEnhet = { ...this.state.enhet };
    tmpEnhet.value = newEnhet?.enhetId;
    tmpEnhet.display = newEnhet;
    tmpEnhet.wsRequestedValue = undefined;
    return tmpEnhet;
  };

  readonly setWSEnhetRequestedValue = (value: string) => {
    this.setWSRequestedValue('enhet', value);
  };

  readonly openEnhetModal = () => this.openModal('enhet');

  readonly changeEnhetLocallyToWsRequestedValue = () => {
    this.changeEnhetLocally(this.state.enhet.wsRequestedValue);
    this.closeModal('enhet');
  };

  readonly changeEnhetLocally = async (newEnhetId?: string | null) => {
    if (!newEnhetId) {
      const enhet = this.#updateEnhet(undefined);
      this.setState({ enhet });
      if (this.#onEnhetChanged) this.#onEnhetChanged(newEnhetId);
      return;
    }

    const enhetResponse = await this.contextHolderApi.getEnhet(newEnhetId);
    if (enhetResponse.error) {
      this.#errorMessageManager.addErrorMessage(
        PredefiniertFeilmeldinger.HENT_ENHET_FEILET,
      );
      const enhet = this.#updateEnhet(null);
      this.setState({ enhet });
      if (this.#onEnhetChanged) this.#onEnhetChanged(null);
      return;
    }
    if (!enhetResponse.error && enhetResponse.data) {
      const enhet = this.#updateEnhet(enhetResponse.data);
      this.setState({ enhet });
      if (this.#onEnhetChanged) this.#onEnhetChanged(newEnhetId);
    }
  };

  readonly changeEnhetLocallyAndExternally = async (newEnhetId?: string) => {
    await this.changeEnhetLocally(newEnhetId);
    this.contextHolderApi.changeEnhet(newEnhetId);
  };

  readonly changeEnhetExternallyToLocalValue = async () => {
    this.contextHolderApi.changeEnhet(this.state.enhet.value);
    this.clearWSRequestedValue('enhet');
    this.closeModal('enhet');
  };

  readonly clearEnhet = () => {
    this.changeEnhetLocally();
  };

  #haveLegalEnhet = (requestedEnhet: string, enheter: Enhet[]) =>
    enheter.some((enhet) => enhet.enhetId === requestedEnhet);
}
