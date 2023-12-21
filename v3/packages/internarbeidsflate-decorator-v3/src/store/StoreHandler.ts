import { StoreApi } from 'zustand';
import { EventHandler } from './EventHandler';
import { PropsUpdateHandler } from './PropsUpdateHandler';
import { ContextHolderAPI } from '../api/ContextHolderAPI';
import { Enhet } from '../types/Enhet';
import { Veileder } from '../types/Veileder';
import { ContextValue, getInitialContextValue } from '../types/ContextValue';
import { ErrorMessage, PredefiniertFeilmeldinger } from '../types/ErrorMessage';
import { ErrorMessageManager } from './ErrorMessageManager';
import { AppProps } from '../types/AppProps';
import { EnhetValueManager } from './EnhetValueManager';
import { FnrValueManager } from './FnrValueManager';
import { StateHandler } from './StateHandler';
import { SubstateHandlerProps } from './SubstateHandler';

export interface StoreProps extends AppProps {
  veiledersIdent: string;
  wsUrl: string;
  contextHolderApi: ContextHolderAPI;
}

export class StoreHandler extends StateHandler<State, StoreProps> {
  contextHolderApi?: ContextHolderAPI;
  eventHandler: EventHandler;
  readonly propsUpdateHandler: PropsUpdateHandler;
  readonly enhetValueManager: EnhetValueManager;
  readonly fnrValueManager: FnrValueManager;
  readonly errorManager: ErrorMessageManager;

  constructor() {
    super({
      enhet: getInitialContextValue(),
      fnr: getInitialContextValue(),
      errorMessages: {},
    });
    const substateProps: SubstateHandlerProps = {
      setState: this.setState,
      storeHandler: this,
    };
    this.propsUpdateHandler = new PropsUpdateHandler(
      substateProps,
      this.initialize,
    );
    this.errorManager = new ErrorMessageManager(substateProps);
    this.fnrValueManager = new FnrValueManager(
      substateProps,
      this.errorManager,
      this.propsUpdateHandler,
    );
    this.enhetValueManager = new EnhetValueManager(
      substateProps,
      this.errorManager,
      this.fnrValueManager,
      this.propsUpdateHandler,
    );
    this.eventHandler = new EventHandler(
      substateProps,
      this.fnrValueManager,
      this.enhetValueManager,
      this.errorManager,
    );
  }

  readonly initialize = async (props: StoreProps) => {
    this.setProps(props)
    if (!props.veiledersIdent?.length) {
      this.resetState()
      return
    }
    this.resetState();
    console.log('initialize');
    this.contextHolderApi = props.contextHolderApi;
    await Promise.all([
      this.#fetchVeileder(props.veiledersIdent),
      this.fnrValueManager.initialize(props),
      this.enhetValueManager.initialize(props),
    ]);
    this.eventHandler.initialize(props);
  };

  readonly #fetchVeileder = async (veilederIdent: string) => {
    const res = await this.contextHolderApi?.getVeilederDetails(veilederIdent);
    if (!res?.data || res.error) {
      this.errorManager.addErrorMessage(
        PredefiniertFeilmeldinger.HENT_SAKSBEHANDLER_DATA_FEILET,
      );
      return;
    }
    this.setState({ veileder: res?.data });
  };

  readonly shutdown = () => {
    console.log('shutdown');
    this.eventHandler.shutdown();
    this.propsUpdateHandler.shutdown();
    this.enhetValueManager.shutdown();
    this.fnrValueManager.shutdown();
    this.errorManager.shutdown();
  };

  resetState = () => {
    this.setState(
      {
        enhet: getInitialContextValue(),
        fnr: getInitialContextValue(),
        errorMessages: {},
      },
      true,
    );
  };
}

export default new StoreHandler();

export interface State {
  fnr: ContextValue<string>;
  enhet: ContextValue<Enhet>;
  enheter?: Enhet[];
  veileder?: Veileder | undefined;
  errorMessages: Record<string, ErrorMessage>;
}

export type SetState = (state: Partial<State>) => void;
export type Store = StoreApi<State>;
