import React from 'react';
import { useLinkHotkeys } from '../hooks/useLinkHotkeys';
import { useAppState } from '../states/AppState';
import StoreHandler from '../store/StoreHandler';
import { DecoratorLinks } from './Links/Links';
import classNames from 'classnames';
import { useGenerateLinks } from './Links/useGenerateLinks';

const Menu: React.FC = () => {
  const isOpen = useAppState((state) => state.open);
  const isFullScreen = useAppState((state) => state.isFullScreen);

  const environment = useAppState((state) => state.environment);

  const { fnr, aktoerId } = StoreHandler.store((state) => ({
    fnr: state.fnr.value,
    aktoerId: ''
  }));

  useLinkHotkeys({ environment, fnr, aktoerId });
  const links = useGenerateLinks()
  if (!isOpen) return null;

  return (
    <div className={classNames('dr-bg-background', { 'dr-h-full': isFullScreen })}>
      <DecoratorLinks {...links} />
    </div>
  );
};

export default Menu;
