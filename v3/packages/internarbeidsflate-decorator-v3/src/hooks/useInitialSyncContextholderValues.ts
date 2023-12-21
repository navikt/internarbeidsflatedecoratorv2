import { useEffect } from 'react';
import StoreHandler from '../store/StoreHandler';
import { AppProps } from '../types/AppProps';

export const useInitialSyncContextholderValues = ({
  fnr,
  userKey,
  enhet,
}: Pick<AppProps, 'fnr' | 'userKey' | 'enhet'> = {}) => {
  const veileder = StoreHandler.store((state) => state.veileder);
  useEffect(() => {
    if (!veileder) return;
    if (!enhet)
      StoreHandler.enhetValueManager.updateEnhetLocallyToMatchContextHolder(
        veileder.ident,
      );
    if (!fnr && !userKey)
      StoreHandler.fnrValueManager.updateFnrLocallyToMatchContextHolder(
        veileder.ident,
      );
  }, [enhet, fnr, userKey, veileder]);
};
