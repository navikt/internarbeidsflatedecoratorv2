import React, { useMemo } from 'react';
import { useLinkHotkeys } from '../hooks/useLinkHotkeys';
import { useAppState } from '../states/AppState';
import StoreHandler from '../store/StoreHandler';
import { DecoratorLinks } from './Links/Links';
import classNames from 'classnames';
import { useGenerateLinks } from './Links/useGenerateLinks';

const Menu: React.FC = () => {
  const useStore = useMemo(() => StoreHandler.getStore(), []);

  const isOpen = useAppState((state) => state.open);
  const environment = useAppState((state) => state.environment);
  const fnr = useStore((state) => state.fnr.value);

  useLinkHotkeys({ environment, fnr, aktoerId: null });
  const links = useGenerateLinks();
  if (!isOpen) return null;

  return (
    <div className={classNames('dr-bg-background')}>
      <DecoratorLinks {...links} />
    </div>
  );
};

export default Menu;
