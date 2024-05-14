import React from 'react';
import classNames from 'classnames';

const LandingPage = (props: React.PropsWithChildren) => {
  return <div
    className={classNames('dr-text-white dr-font-arial dr-bg-background', 'dr-min-h-screen', 'dr-flex', 'dr-flex-col', 'dr-items-center', 'dr-pt-10')}
    data-theme="internarbeidsflatedecorator-theme"
  >
    {props.children}
  </div>;
};

export default LandingPage;
