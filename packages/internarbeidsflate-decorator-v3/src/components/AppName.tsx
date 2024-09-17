import React from 'react';
import { useAppState } from '../states/AppState';

const AppName: React.FC = () => {
  const appName = useAppState((state) => state.appName);
  return (
    <div className="dr-flex dr-min-w-min dr-items-center dr-float-left">
      <div className="dr-min-w-[7.75rem] dr-max-w-[16rem] dr-pl-2">
        {appName}
      </div>
    </div>
  );
};

export default AppName;
