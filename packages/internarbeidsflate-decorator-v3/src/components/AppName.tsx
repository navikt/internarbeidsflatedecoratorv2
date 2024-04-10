import React from 'react';
import { useAppState } from '../states/AppState';
import NAVLogo from './Logo';

const AppName: React.FC = () => {
  const appName = useAppState((state) => state.appName);
  return (
    <div className="dr-flex dr-min-w-min dr-items-center dr-float-left">
      <div className="dr-w-14 dr-border-solid dr-border-r dr-border-gray-200 dr-pr-2">
        <NAVLogo />
      </div>
      <div className="dr-min-w-[7.75rem] dr-max-w-[16rem] dr-pl-2">{appName}</div>
    </div>
  );
};

export default AppName;
