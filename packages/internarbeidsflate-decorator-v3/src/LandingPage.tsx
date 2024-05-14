import React, { useEffect } from 'react';
import './index.css';
import classNames from 'classnames';
import useAppLogic from './hooks/useAppLogic';
import { AppProps } from './types/AppProps';
import NAVLogo from './components/Logo';
import { Heading } from '@navikt/ds-react';
import Enhet from './components/Enhet';
import EnhetVelger from './components/EnhetVelger';
import { FullScreenLinks } from './components/Links/Links';
import { useGenerateLinks } from './components/Links/useGenerateLinks';
import { useAppState } from './states/AppState';

const LandingPage: React.FC<AppProps> = (props) => {
  useAppLogic(props);
  const links = useGenerateLinks();

  useEffect(() => {
    useAppState.setState({ open: true });
  }, []);

  return (
    <div
      className={classNames(
        'dr-text-white dr-font-arial dr-bg-background',
        'dr-min-h-screen',
        'dr-flex',
        'dr-flex-col',
        'dr-items-center',
        'dr-pt-10',
      )}
      data-theme="internarbeidsflatedecorator-theme"
    >
      <NAVLogo className="dr-w-24 dr-pb-3" />
      <Heading className="dr-pb-3" size={'large'}>
        Modia
      </Heading>
      <Enhet />
      <EnhetVelger />
      <FullScreenLinks {...links} />
    </div>
  );
};

export default LandingPage;
