import React from 'react';
import { useLinkHotkeys } from '../hooks/useLinkHotkeys';
import { useAppState } from '../states/AppState';
import StoreHandler from '../store/StoreHandler';
import Links from './Links/Links';

const Menu: React.FC = () => {
  const isOpen = useAppState((state) => state.open);

  const environment = useAppState((state) => state.environment);

  const { fnr, aktoerId } = StoreHandler.store((state) => ({
    fnr: state.fnr.value,
    aktoerId: '',
  }));

  useLinkHotkeys({ environment, fnr, aktoerId });
  if (!isOpen) return null;

  return (
    <div className="dr-bg-background">
      <Links />
    </div>
  );
};

export default Menu;
