import { ContextHolderAPI } from '../api/ContextHolderAPI';
import { AppProps } from '../types/AppProps';
import { PredefiniertFeilmeldinger } from '../types/ErrorMessage';
import { modiaContextHolderUrl, wsEventDistribusjon } from '../utils/urlUtils';
import { ErrorMessageManager } from './ErrorMessageManager';
import { FirstSyncContextValue } from './FirstSyncContextValue';
import { StoreProps } from './StoreHandler';
import { SubstateHandler, SubstateHandlerProps } from './SubstateHandler';

type Callback = (
  newProps: StoreProps,
  oldProps?: StoreProps | undefined,
) => void;

export class PropsUpdateHandler extends SubstateHandler {
  #previousStoreProps?: StoreProps;
  #previousAppProps?: AppProps;
  #errorMessageManager: ErrorMessageManager
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
  ];

  constructor(
    substateProps: SubstateHandlerProps,
    initializeStore: (newProps: StoreProps) => void,
    errorMessageManager: ErrorMessageManager
  ) {
    super(substateProps);
    this.#initializeStore = initializeStore;
    this.#errorMessageManager = errorMessageManager
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

  #onCriticalPropsUpdated = async (props: AppProps) => {
    const {
      environment,
      urlFormat,
      proxy,
      accessToken,
      contextholderUrl,
    } = props;
    const apiUrl =
      contextholderUrl ?? modiaContextHolderUrl(environment, urlFormat, proxy);
    const contextHolderApi = new ContextHolderAPI(apiUrl, accessToken);
    const veilederDetails = await contextHolderApi.getVeilederDetails()
    if (veilederDetails.error || !veilederDetails.data) {
      this.#errorMessageManager.addErrorMessage(PredefiniertFeilmeldinger.HENT_SAKSBEHANDLER_DATA_FEILET)
      return
    }
    const wsUrl = wsEventDistribusjon(environment, urlFormat);
    const storeProps = {
      ...props,
      contextHolderApi,
      wsUrl,
      veiledersIdent: veilederDetails.data.ident,
    };
    const firstSyncContextValue = new FirstSyncContextValue(contextHolderApi, this.#errorMessageManager, !!props.fetchActiveUserOnMount, !!props.fetchActiveEnhetOnMount)
    const [fnrRes, enhetRes] = await Promise.allSettled([firstSyncContextValue.getFnr(props.fnr), firstSyncContextValue.getEnhet(props.enhet)])
    if (fnrRes.status === 'fulfilled') {
      storeProps.fnr = fnrRes.value
    }
    if (enhetRes.status === 'fulfilled') {
      storeProps.enhet = enhetRes.value
    }
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
      veiledersIdent: storeProps.veiledersIdent
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
