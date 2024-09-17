import React from 'react';
import AppName from './AppName';
import EnhetVelger from './EnhetVelger';
import HotkeyMenuElement from './HotkeyMenuElement';
import Markup from './Markup';
import MenuButton from './MenuButton';
import SearchArea from './SearchArea';
import VeilederDetails from './VeilederDetails';

const Banner: React.FC = () => {
  return (
    <div className="dr-p-2 dr-bg-background dr-text-white">
      <div className="dr-flex dr-justify-center dr-w-full dr-mx-auto">
        <div className="dr-flex dr-flex-wrap dr-items-center dr-justify-between dr-gap-1 dr-w-full dr-max-w-screen-2xl">
          <AppName />
          <div className="dr-flex dr-flex-1 dr-gap-4 xl:dr-gap-8 dr-w-full dr-justify-center dr-items-center">
            <EnhetVelger />
            <SearchArea />
            <Markup />
            <HotkeyMenuElement />
            <VeilederDetails />
          </div>
          <MenuButton />
        </div>
      </div>
    </div>
  );
};

export default Banner;
