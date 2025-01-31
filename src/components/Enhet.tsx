import React from 'react';
import StoreHandler from '../store/StoreHandler';
import { useAppState } from '../states/AppState';

const Enhet: React.FC = () => {
  const enhet = StoreHandler.store((state) => state.enhet?.display);
  const enheter = StoreHandler.store((state) => state.veileder?.enheter);
  const showEnheter = useAppState((state) => state.showEnheter);

  if ((enheter && enheter.length > 1) || !showEnheter) {
    return null;
  }

  return (
    <div>{enhet ? `${enhet?.enhetId} ${enhet?.navn}` : 'Ingen enhet'}</div>
  );
};

export default Enhet;
