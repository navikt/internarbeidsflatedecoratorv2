import React from 'react';
import AppName from './AppName';
import Enhet from './Enhet';
import EnhetVelger from './EnhetVelger';
import HotkeyMenuElement from './HotkeyMenuElement';
import Markup from './Markup';
import MenuButton from './MenuButton';
import SearchArea from './SearchArea';
import VeilederDetails from './VeilederDetails';
import { useAppState } from '../states/AppState';

const Banner: React.FC = () => {
  const isFullScreen = useAppState((state) => state.isFullScreen);

  return (
    <div className="dr-p-2 dr-bg-background dr-text-white">
      <div className="dr-max-w-full dr-mx-auto">
        <div className="dr-flex dr-flex-wrap dr-items-center dr-justify-evenly dr-gap-1">
          <AppName />
          <div className="dr-flex dr-flex-wrap dr-flex-1 dr-gap-4 xl:dr-gap-8 dr-w-full dr-justify-center dr-items-center">
            <Enhet />
            <EnhetVelger />
            <SearchArea />
            <Markup />
            <HotkeyMenuElement />
            <VeilederDetails />
          </div>
          {!isFullScreen && <MenuButton />}
        </div>
      </div>
    </div>
  );
};

export default Banner;
