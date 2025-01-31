import { useEffect } from 'react';
import { AppProps } from '../types/AppProps';
import StoreHandler from '../store/StoreHandler';

export const useSyncStore = (appProps: AppProps) => {
  useEffect(() => {
    void StoreHandler.propsUpdateHandler.onPropsUpdated(appProps);
  }, [appProps]);
};
