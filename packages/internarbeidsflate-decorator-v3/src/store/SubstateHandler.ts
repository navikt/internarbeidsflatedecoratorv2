import { State, StoreHandler, StoreProps } from './StoreHandler';

export interface SubstateHandlerProps {
  storeHandler: StoreHandler;
  setState: (state: Partial<State>, replace?: boolean | undefined) => void;
}

export class SubstateHandler {
  protected readonly state!: State;
  protected readonly props?: StoreProps | undefined;
  protected setState: (
    partial: Partial<State>,
    replace?: boolean | undefined,
  ) => void;
  protected storeHandler: StoreHandler;
  #shutDownHooks: Record<string, () => void> = {};

  constructor({ storeHandler, setState }: SubstateHandlerProps) {
    this.setState = setState;
    this.storeHandler = storeHandler;
    Object.defineProperty(this, 'state', {
      get: this.storeHandler.getState,
    });
    Object.defineProperty(this, 'props', {
      get: () => this.storeHandler.props
    })
  }

  protected get contextHolderApi() {
    const contextHolderApi = this.storeHandler.contextHolderApi;
    if (!contextHolderApi) {
      throw new Error(
        'Make sure the store is initialized before starting to use it.',
      );
    }
    return contextHolderApi;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  readonly initialize = (_props: StoreProps) => {};

  protected readonly registerShutdown = (
    id: string,
    callbackFn: () => void,
  ) => {
    this.#shutDownHooks[id] = callbackFn;
  };

  readonly shutdown = () => {
    for (const hook of Object.values(this.#shutDownHooks)) {
      try {
        hook();
      } catch (e) {
        console.error('Failed to call shutdown hook: ', e);
      }
    }
  };
}
