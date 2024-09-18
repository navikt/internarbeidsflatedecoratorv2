import React from 'react';
import EnhetVelger from './EnhetVelger';
import HotkeyMenuElement from './HotkeyMenuElement';
import Markup from './Markup';
import MenuButton from './MenuButton';
import SearchArea from './SearchArea';
import { InternalHeader } from '@navikt/ds-react';
import { useAppState } from '../states/AppState';
import StoreHandler from '../store/StoreHandler';

const Banner: React.FC = () => {
  const appName: string = useAppState((state) => state.appName);
  const veileder = StoreHandler.store((state) => state.veileder);
  return (
    <div className="dr-bg-background dr-text-white dr-flex dr-justify-center">
      <InternalHeader className="dr-max-w-screen-hd dr-w-full">
        <InternalHeader.Title>{appName}</InternalHeader.Title>
        <div className="dr-flex dr-flex-1 dr-gap-4 xl:dr-gap-8 dr-w-full dr-justify-center dr-items-center">
          <EnhetVelger />
          <SearchArea />
          <Markup />
          <HotkeyMenuElement />
        </div>
        <MenuButton />
        <InternalHeader.User
          name={veileder?.navn ?? ''}
          description={veileder?.ident ?? ''}
        />
      </InternalHeader>
    </div>
  );
};

export default Banner;
