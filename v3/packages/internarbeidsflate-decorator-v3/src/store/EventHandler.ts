import { WebSocketWrapper } from '../api/WebSocketWrapper';
import { PredefiniertFeilmeldinger } from '../types/ErrorMessage';
import { WebSocketMessage } from '../types/WebsocketMessage';
import { erGyldigFodselsnummer, makeFnrFeilmelding } from '../utils/fnrUtils';
import { EnhetValueManager } from './EnhetValueManager';
import { ErrorMessageManager } from './ErrorMessageManager';
import { FnrValueManager } from './FnrValueManager';
import { StoreProps } from './StoreHandler';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

export class EventHandler extends SubstateHandler {
  #webSocketWrapper?: WebSocketWrapper | undefined;
  #errorMessageManager: ErrorMessageManager;
  #fnrValueManager: FnrValueManager;
  #enhetValueManager: EnhetValueManager;

  constructor(
    substateProps: SubstateHandlerProps,
    fnrValueManager: FnrValueManager,
    enhetValueManager: EnhetValueManager,
    errorMessageManager: ErrorMessageManager,
  ) {
    super(substateProps);
    this.#fnrValueManager = fnrValueManager;
    this.#enhetValueManager = enhetValueManager;
    this.#errorMessageManager = errorMessageManager;
  }
  override initialize = ({ wsUrl, veiledersIdent }: StoreProps) => {
    this.#webSocketWrapper = new WebSocketWrapper(`${wsUrl}${veiledersIdent}`, {
      onMessage: this.#onWSMessage,
      onError: this.#onWSError,
    });
    this.#webSocketWrapper.open();
    this.registerShutdown('websocketwrapper', this.#webSocketWrapper.close);
  };

  #onWSMessage = (message: MessageEvent) => {
    const data = JSON.parse(message.data) as WebSocketMessage;
    console.log('Recieved data', data);
    if (data.type === 'NY_AKTIV_BRUKER') {
      this.#handleFnrChangedExternally(data.payload);
    } else if (data.type === 'NY_AKTIV_ENHET') {
      this.#handleEnhetChangedExternally(data.payload);
    }
  };

  #onWSError = () => {
    this.#errorMessageManager.clearAllErrorMessages();
    this.#errorMessageManager.addErrorMessage(
      PredefiniertFeilmeldinger.WS_ERROR,
    );
  };

  #handleFnrChangedExternally = (newFnr?: string | null) => {
    if (!newFnr) {
      return;
    }
    if (!this.state.fnr.value) {
      this.#fnrValueManager.setWSFnrRequestedValue(newFnr);
      this.#fnrValueManager.changeFnrLocallyToWsRequestedValue();
    }
    if (this.#checkThatUpdateIsNewAndNotAwaitingAccept('fnr', newFnr)) {
      this.#fnrValueManager.setWSFnrRequestedValue(newFnr);
      this.#fnrValueManager.openFnrModal();
    }
  };

  #handleEnhetChangedExternally = (newEnhet?: string | null) => {
    if (!newEnhet) {
      return;
    }
    if (this.#checkThatUpdateIsNewAndNotAwaitingAccept('enhet', newEnhet)) {
      this.#enhetValueManager.setWSEnhetRequestedValue(newEnhet);
      this.#enhetValueManager.openEnhetModal();
    }
  };

  #checkThatUpdateIsNewAndNotAwaitingAccept = (
    key: 'fnr' | 'enhet',
    newValue: string,
  ) =>
    newValue !== this.state[key].value &&
    newValue !== this.state[key].wsRequestedValue;

  readonly changeFnr = (newFnr?: string | undefined) => {
    this.#errorMessageManager.clearAllErrorMessages();
    if (!newFnr) {
      this.#fnrValueManager.clearFnr();
      return;
    }
    if (!erGyldigFodselsnummer(newFnr)) {
      const errorMessage = makeFnrFeilmelding(newFnr);
      if (errorMessage) {
        this.#errorMessageManager.addErrorMessage(errorMessage);
      }
      return;
    }
    this.#fnrValueManager.changeFnrLocallyAndExternally(newFnr);
  };
}
