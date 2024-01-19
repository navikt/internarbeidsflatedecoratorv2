import { ContextHolderAPIImpl } from '../api/ContextHolderAPI';
import { AppProps } from '../types/AppProps';
import { modiaContextHolderUrl, wsEventDistribusjon } from '../utils/urlUtils';
import { StoreProps } from './StoreHandler';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

type Callback = (
  newProps: StoreProps,
  oldProps?: StoreProps | undefined,
) => void;

export class PropsUpdateHandler extends SubstateHandler {
  #previousStoreProps?: StoreProps;
  #previousAppProps?: AppProps;
  #callBacks: {
    [key in keyof Partial<StoreProps>]: { id: string; callback: Callback }[];
  } = {};
  #initializeStore: (newProps: StoreProps) => void;
  #criticalProps: (keyof AppProps)[] = [
    'environment',
    'urlFormat',
    'accessToken',
    'onBeforeRequest',
    'proxy',
    'veiledersIdent',
  ];

  constructor(
    substateProps: SubstateHandlerProps,
    initializeStore: (newProps: StoreProps) => void,
  ) {
    super(substateProps);
    this.#initializeStore = initializeStore;
  }

  registerCallback = (
    id: string,
    callback: Callback,
    ...keys: (keyof StoreProps)[]
  ) => {
    for (const key of keys) {
      const callbacks = [...(this.#callBacks[key] ?? [])];
      callbacks.push({ id, callback });
      this.#callBacks[key] = callbacks;
    }
  };

  clearOldValue = (key: keyof AppProps) => {
    if (this.#previousStoreProps) {
      delete this.#previousStoreProps[key];
    }
  };

  #checkIfPropUpdated = <T = AppProps | StoreProps>(
    key: keyof T,
    newProps: T,
    previousProps?: T | undefined,
  ): boolean => {
    if (!previousProps) return true;
    const oldValue = previousProps[key];
    const newValue = newProps[key];
    return oldValue !== newValue;
  };

  #onNonCritialPropsUpdated = (newProps: StoreProps) => {
    const idsThatHaveBeenCalled: string[] = [];
    for (const key of Object.keys(newProps)) {
      const castedKey = key as keyof StoreProps;
      const callbacks = this.#callBacks[castedKey] ?? [];
      if (
        callbacks.length &&
        this.#checkIfPropUpdated(castedKey, newProps, this.#previousStoreProps)
      ) {
        for (const { id, callback } of callbacks) {
          if (idsThatHaveBeenCalled.includes(id)) {
            continue;
          }
          callback(newProps, this.#previousStoreProps);
          idsThatHaveBeenCalled.push(id);
        }
      }
    }
    this.#previousStoreProps = newProps;
  };

  #onCriticalPropsUpdated = (props: AppProps) => {
    const {
      environment,
      urlFormat,
      proxy,
      accessToken,
      contextholderUrl,
      veiledersIdent,
    } = props;
    const apiUrl =
      contextholderUrl ?? modiaContextHolderUrl(environment, urlFormat, proxy);
    const contextHolderApi = new ContextHolderAPIImpl(apiUrl, accessToken);
    const wsUrl = wsEventDistribusjon(environment, urlFormat);
    const storeProps = {
      ...props,
      contextHolderApi,
      wsUrl,
      veiledersIdent,
    };
    this.#previousAppProps = props;
    this.#previousStoreProps = storeProps;
    this.#initializeStore(storeProps);
  };

  #checkIfCritialPropsUpdate = (newProps: AppProps): boolean => {
    for (const criticalKey of this.#criticalProps) {
      if (
        this.#checkIfPropUpdated(criticalKey, newProps, this.#previousAppProps)
      ) {
        return true;
      }
    }
    return false;
  };

  #mergeAppPropsAndStoreProps = (
    appProps: AppProps,
    storeProps: StoreProps,
  ): StoreProps => {
    return {
      ...appProps,
      wsUrl: storeProps.wsUrl,
      contextHolderApi: storeProps.contextHolderApi,
      veiledersIdent: storeProps.veiledersIdent,
    };
  };

  onPropsUpdated = (newProps: AppProps) => {
    if (this.#checkIfCritialPropsUpdate(newProps)) {
      this.#onCriticalPropsUpdated(newProps);
      return;
    }
    if (!this.#previousStoreProps) return;
    const mergedProps = this.#mergeAppPropsAndStoreProps(newProps, this.#previousStoreProps)
    this.#onNonCritialPropsUpdated(mergedProps);
  };
}
