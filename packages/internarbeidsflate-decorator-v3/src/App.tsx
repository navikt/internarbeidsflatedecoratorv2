import React, { useEffect } from 'react';
import './index.css';
import { AppProps } from './types/AppProps';
import { useOnOutsideClick } from './hooks/useOnOutsideClick';
import Banner from './components/Banner';
import useSyncAppState from './hooks/useSyncAppState';
import { useAppState } from './states/AppState';
import ErrorMessage from './components/ErrorMessageDisplay';
import Menu from './components/Menu';
import { useSyncHotkeys } from './hooks/useSyncHotkeys';
import { useHotkeys } from './hooks/useHotkeys';
import NewUserModal from './components/modals/NewUserModal';
import NewEnhetModal from './components/modals/NewEnhetModal';
import { useSyncStore } from './hooks/useSyncStore';
import useGlobalHandlers from './store/GlobalHandlers';
import classNames from 'classnames';
import LandingPage from './LandingPage';
import NAVLogo from './components/Logo';
import Enhet from './components/Enhet';
import EnhetVelger from './components/EnhetVelger';
import { FullScreenLinks } from './components/Links/Links';
import { Heading } from '@navikt/ds-react';
import { useGenerateLinks } from './components/Links/useGenerateLinks';

const App: React.FC<AppProps> = (props: AppProps) => {
  const { onLinkClick, isFullScreen } = props;

  useSyncStore(props);
  useSyncAppState(props);
  useSyncHotkeys(props);
  const { startListening, stopListening } = useHotkeys();

  useEffect(() => {
    if (props.enableHotkeys) {
      startListening();
    }
    return () => stopListening();
  }, [props.enableHotkeys, startListening, stopListening]);

  const ref = useOnOutsideClick<HTMLElement>(() =>
    useAppState.setState({ open: false })
  );

  const setHandler = useGlobalHandlers((state) => state.setHandler);

  useEffect(() => {
    if (onLinkClick) {
      setHandler('onLinkClick', (linkText, url) =>
        onLinkClick({ text: linkText, url })
      );
    }
  }, [setHandler, onLinkClick]);

  useEffect(() => {
    if (props.isFullScreen) {
      useAppState.setState({ open: true });
    }
  }, [props.isFullScreen]);

  const links = useGenerateLinks();

  if (isFullScreen) {
    return <LandingPage>
      <NAVLogo className="dr-w-24 dr-pb-3" />
      <Heading className="dr-pb-3" size={'large'}>Modia</Heading>
      <Enhet />
      <EnhetVelger />
      <FullScreenLinks {...links} />
    </LandingPage>;
  }

  return (
    <>
      <div className="dekorator"
           data-theme="internarbeidsflatedecorator-theme">
        <header ref={ref}
                className={classNames('dr-font-arial', 'dr-text-white', { 'dr-h-full dr-flex dr-flex-col': isFullScreen })}>
          <Banner />
          <Menu />
          <ErrorMessage />
        </header>
      </div>
      <NewUserModal />
      <NewEnhetModal />
    </>
  );
};

export default App;
